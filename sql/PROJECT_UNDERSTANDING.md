# Enterprise Node.js API: Architecture & Developer Guide

This document provides a comprehensive overview of the project's architecture, design principles, and development patterns. It serves as an essential guide for developers and technical interviewers to understand the codebase's structure, quality, and scalability.

## 1. Core Technology Stack

This project is built on a modern, robust, and type-safe technology stack chosen for enterprise-grade applications.

- **Runtime & Framework**: Node.js with Express.js for building a resilient and scalable web server.
- **Language**: TypeScript for static typing, leading to safer code, better developer experience, and easier maintenance.
- **Database**: PostgreSQL, a powerful and reliable open-source relational database.
- **ORM**: Prisma, a next-generation ORM that provides a fully type-safe database client and simplifies data access.
- **Validation**: Joi for describing data schemas and validating request payloads with detailed error reporting.
- **Authentication**: JSON Web Tokens (JWT) for stateless, secure authentication, with `bcrypt` for password hashing.
- **API Documentation**: Swagger (OpenAPI) is used for generating interactive API documentation directly from code annotations.

## 2. Unidirectional Layered Architecture

The application enforces a strict, unidirectional layered architecture. This separation of concerns is fundamental to the project's design, ensuring that the codebase is modular, testable, and maintainable.

The lifecycle of an API request follows a clear and predictable path:

**`Route` → `Validation (Joi)` → `Controller` → `Service` → `Repository` → `Prisma (DB)`**

1.  **Route (`src/routes`)**: Defines the API endpoints, HTTP methods, and connects them to corresponding middleware and controllers. It is the entry point for all incoming requests.
2.  **Validation (`src/middlewares/validate.middleware.ts`)**: Before any business logic is executed, this middleware intercepts the request and validates its payload (`body`, `params`, `query`) against a predefined Joi schema. This ensures that all data is in the correct format, preventing invalid data from penetrating deeper into the application.
3.  **Controller (`src/controllers`)**: Manages the HTTP request-response cycle. Its sole responsibility is to parse the request, call the appropriate service method with the necessary data, and send a standardized response (success or error) back to the client. Controllers do not contain any business logic.
4.  **Service (`src/services`)**: Contains the core business logic. It orchestrates operations, enforces business rules, and coordinates data flow between the controllers and repositories. It is responsible for mapping repository data to a client-safe DTO.
5.  **Repository (`src/repositories`)**: The data access layer (DAL). This is the *only* layer that directly interacts with the database via the Prisma client. It encapsulates all database queries, abstracting the data source from the rest of the application.

## 3. The Database Contract: `prisma/schema.prisma`

The `prisma/schema.prisma` file is the **single source of truth** for the database schema. It is treated as a formal contract that defines all models, fields, relations, and database-level constraints. The entire application is built as a consumer of this contract.

This approach enforces discipline:
-   **Decoupling**: The application code is decoupled from the database schema's implementation details.
-   **Clarity**: Provides a clear, declarative definition of our data structures.
-   **Type Safety**: Prisma uses this schema to generate a fully type-safe client, ensuring that all database queries are validated at compile time.

## 4. Type-Safe Payloads: `select` & `Prisma.GetPayload`

To maintain a strict separation between our database schema and the objects used within the application, we **never** work with raw Prisma model instances in our business logic. Instead, we generate plain, type-safe objects.

This is achieved using a powerful Prisma pattern in the repository layer:

1.  **Define a `select` Object**: A constant `select` object is defined for each model (e.g., `productSelect` in `product.repository.ts`). This object explicitly lists every field that should be returned from the database, including fields from related models.
2.  **Generate a Plain Type**: Prisma's `Prisma.ModelGetPayload` utility is used to generate a TypeScript type based on the `select` object.
    ```typescript
    // src/repositories/product.repository.ts
    export type PlainProduct = Prisma.ProductGetPayload<{
      select: typeof productSelect;
    }>;
    ```
3.  **Enforce Selection**: Every Prisma query in the repository uses this `select` object, guaranteeing that every query for that model returns a consistently shaped, plain JavaScript object.

This pattern provides the benefits of an ORM while preventing internal database models from ever leaking into the service or controller layers.

## 5. DTO Pattern & API Contract

The project strictly uses **Data Transfer Objects (DTOs)** to define its public API contract.

-   **Request DTOs (`src/types/dto/request`)**: Define the expected shape of incoming data. They are used by controllers and services to handle input.
-   **Response DTOs (`src/types/dto/response`)**: Define the shape of data sent back to the client. Services are responsible for mapping plain objects from the repository into these DTOs before returning them.

**Why are Prisma models never exposed?**
1.  **Security**: Prevents accidental leakage of sensitive fields like user passwords, internal flags, or hashed values.
2.  **API Stability**: Decouples the API contract from the database schema. The database schema can be refactored internally without breaking the public-facing API.
3.  **Flexibility**: Allows the API to return responses shaped specifically for the client's needs, which may differ from the underlying database structure.

## 6. Relational Integrity

Relational integrity is enforced at both the database and application levels. While the Prisma schema defines `@@unique` and `@@index` constraints, the **Service layer** is responsible for validating the existence of related entities before performing write operations.

For example, when creating a product, the `product.service.ts` first queries the `category.repository.ts` to ensure the provided `categoryId` exists and belongs to the authenticated user. This prevents orphaned records and ensures business rules are met.

## 7. Authentication Flow (JWT)

1.  **Login**: A user submits credentials, which the `auth.service.ts` validates against the hashed password in the database using `bcrypt.compare`.
2.  **Token Generation**: Upon successful validation, a JWT is generated containing the user's ID in the payload.
3.  **Protected Routes**: The client sends the JWT in the `Authorization: Bearer <token>` header for all requests to protected routes.
4.  **Auth Middleware (`src/middlewares/auth.middleware.ts`)**: This middleware intercepts the request, verifies the token's validity, and uses the user ID from the token's payload to fetch the full user object from the repository.
5.  **Request Augmentation**: The fetched plain `user` object is attached to the Express `Request` object (i.e., `req.user`), making it available to all subsequent layers in a type-safe manner.

## 8. Validation and Pagination

-   **Validation**: The generic `validate` middleware uses Joi to enforce schemas. With `abortEarly: false`, it collects all validation errors and returns a detailed `400` response, providing clear feedback to the client. `stripUnknown: true` ensures that no unexpected properties are allowed in the request body.
-   **Pagination**: A standardized pagination strategy is implemented in the service layer. It parses `page` and `limit` query parameters, calculates `skip` and `take` values, and passes them to the repository, which then uses them in the Prisma query.

## 9. API Documentation with Swagger

The project uses `swagger-jsdoc` and `swagger-ui-express` to generate interactive API documentation.

-   Documentation is written as JSDoc comments directly above the route handlers in `src/routes/`.
-   Request and response schemas are defined within the comments, often referencing the DTOs, which ensures the documentation is always in sync with the API's actual contract.
-   The documentation is accessible at the `/api-docs` endpoint.

## 10. How to Add a New Module

To add a new feature module (e.g., "Reviews"), follow the established architectural pattern:

1.  **Schema**: Add the `Review` model to `prisma/schema.prisma` and run `prisma generate`.
2.  **DTOs**: Create `review.request.dto.ts` and `review.response.dto.ts` in `src/types/dto/`.
3.  **Validation**: Add Joi schemas in a new `src/validations/review.validation.ts` file.
4.  **Repository**: Create `src/repositories/review.repository.ts`. Define the `reviewSelect` object, the `PlainReview` type using `GetPayload`, and all data access functions (`create`, `findById`, etc.).
5.  **Service**: Create `src/services/review.service.ts`. Implement all business logic here, calling the repository and mapping results to `ReviewResponseDTO`.
6.  **Controller**: Create `src/controllers/review.controller.ts` to handle the HTTP logic and call the service.
7.  **Routes**: Create `src/routes/review.routes.ts`. Define endpoints, apply `auth` and `validate` middleware, connect controllers, and add Swagger JSDoc comments.
8.  **Register Routes**: Import and use the new review router in `src/routes/index.ts`.
