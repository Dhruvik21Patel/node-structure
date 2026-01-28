# AI Refactor Suggestions

This document contains architectural and code-level refactoring suggestions identified by an AI analysis of the codebase. The goal of these suggestions is to improve maintainability, scalability, and adherence to best practices.

---

### 1. Standardize Repository Plain Types with `Prisma.GetPayload`

-   **Priority**: High
-   **Title**: Unify Plain Object Type Generation
-   **Current Implementation**: The `product.repository.ts` correctly uses `Prisma.ProductGetPayload` to derive a type from a `select` object. However, `user.repository.ts` and `category.repository.ts` define their `PlainUser` and `PlainCategory` types manually. This is inconsistent and error-prone if the `select` object changes.
-   **What Should Be Improved**: All repositories should adopt the `Prisma.GetPayload` pattern. Manual type definitions for repository return objects should be eliminated.
-   **Why This Is Important**:
    -   **Architecture / Clean Code**: Enforces a single source of truth. The type is derived directly from the query that generates it, eliminating any possibility of drift between the returned object shape and its type definition.
    -   **Maintainability**: When a field is added or removed from a `select` object, the TypeScript compiler will immediately catch any resulting type errors throughout the application, preventing runtime bugs.
-   **Example Code Snippet (Improved `user.repository.ts`)**:

    ```typescript
    import { Prisma } from "@prisma/client";
    import { prisma } from "../config/prisma";

    const userSelect = {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    };

    // The login query needs a different selection
    const userWithPasswordSelect = {
        ...userSelect,
        password: true,
    };

    // Derive the types from the select objects
    export type PlainUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;
    export type PlainUserWithPassword = Prisma.UserGetPayload<{ select: typeof userWithPasswordSelect }>;


    export const findByEmail = async (email: string): Promise<PlainUserWithPassword | null> => {
      return prisma.user.findUnique({
        where: { email },
        select: userWithPasswordSelect,
      });
    };

    // Other functions use the standard 'userSelect'
    export const findById = async (id: string): Promise<PlainUser | null> => {
      return prisma.user.findUnique({
        where: { id },
        select: userSelect, // Consistently use the select object
      });
    };
    ```

---

### 2. Standardize Paginated API Responses

-   **Priority**: High
-   **Title**: Implement a Consistent Structure for Paginated Endpoints
-   **Current Implementation**: The pagination logic and response structure are inconsistent. The `user.service` returns a structured object `{ items, pagination }`, while the `product.service` returns a simple array `[]`, losing the pagination context for the client. Repository `findAll` methods are also inconsistent in what they return.
-   **What Should Be Improved**:
    1.  All repository `findAll` methods that support pagination must return an object: `{ items: T[], total: number }`.
    2.  All service methods for paginated data must return a standardized, structured response containing the data and pagination metadata.
    3.  A generic `PaginationResponseDTO` should be created to enforce this structure.
-   **Why This Is Important**:
    -   **Architecture**: Provides a predictable and consistent API contract for all collection-based endpoints, making the API easier to consume.
    -   **Scalability**: Ensures that clients always receive the necessary information (`totalPages`, `totalItems`, etc.) to build robust pagination controls on the frontend.
-   **Example Code Snippet (Improved `product.service.ts` and a new DTO)**:

    ```typescript
    // 1. Create a generic Pagination DTO
    // src/types/dto/response/pagination.response.dto.ts
    export class PaginationInfo {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    }
    export class PaginatedResponseDTO<T> {
        items: T[];
        pagination: PaginationInfo;

        constructor(items: T[], total: number, page: number, limit: number) {
            this.items = items;
            this.pagination = {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                pageSize: limit
            };
        }
    }

    // 2. Refactor product.repository.ts's findAll
    // src/repositories/product.repository.ts
    export const findAll = async (options: any): Promise<{ items: PlainProduct[], total: number }> => {
      const { where, skip, take, orderBy } = options;
      const [items, total] = await prisma.$transaction([
          prisma.product.findMany({ where, skip, take, orderBy, select: productSelect }),
          prisma.product.count({ where })
      ]);
      return { items, total };
    };

    // 3. Refactor product.service.ts's getAllProducts
    // src/services/product.service.ts
    export const getAllProducts = async (
      options: any,
    ): Promise<PaginatedResponseDTO<ProductResponseDTO>> => {
      const { page = 1, limit = 10, ...filters } = options;
      const skip = (page - 1) * limit;

      // ... logic to build prismaOptions from filters ...

      const { items, total } = await productRepository.findAll(prismaOptions);
      const productDTOs = items.map((product) => new ProductResponseDTO(product));
      
      return new PaginatedResponseDTO(productDTOs, total, page, limit);
    };
    ```

---

### 3. Abstract Repository Logic with a Generic Base Class

-   **Priority**: Medium
-   **Title**: Reduce Boilerplate with a Generic `BaseRepository`
-   **Current Implementation**: Each repository (`user.repository`, `product.repository`, etc.) re-implements the same set of basic CRUD functions (`create`, `findById`, `update`, `remove`). This is highly repetitive boilerplate code.
-   **What Should Be Improved**: Create a generic `BaseRepository` class that encapsulates the common CRUD logic. Individual repositories can then extend this base class, inheriting the common methods and only implementing model-specific logic.
-   **Why This Is Important**:
    -   **Clean Code / DRY**: Drastically reduces code duplication, making the codebase smaller and easier to read.
    -   **Maintainability**: Centralizes core data access logic. If a cross-cutting change is needed (e.g., adding logging to all `create` operations), it only needs to be done in one place.
-   **Example Code Snippet (New `BaseRepository` and refactored `UserRepository`)**:

    ```typescript
    // src/repositories/base.repository.ts
    import { Prisma, PrismaClient } from '@prisma/client';

    export class BaseRepository<T extends { id: string }, TSelect, TPlain, TArgs extends { select: TSelect }> {
        protected model: any; // e.g., prisma.user

        constructor(model: any) {
            this.model = model;
        }

        async create(data: any, select: TSelect): Promise<TPlain> {
            return this.model.create({ data, select });
        }

        async findById(id: string, select: TSelect): Promise<TPlain | null> {
            return this.model.findUnique({ where: { id }, select });
        }
        
        // ... other generic methods like update, remove, findAll ...
    }


    // src/repositories/user.repository.ts (refactored)
    import { BaseRepository } from './base.repository';
    import { prisma, Prisma } from '../config/prisma';

    // ... define userSelect, PlainUser type etc. as before ...

    class UserRepository extends BaseRepository<Prisma.UserDelegate, typeof userSelect, PlainUser> {
        constructor() {
            super(prisma.user);
        }

        // Inherits create(), findById(), etc.

        // Implement model-specific methods here
        async findByEmail(email: string): Promise<PlainUserWithPassword | null> {
            return this.model.findUnique({
                where: { email },
                select: userWithPasswordSelect,
            });
        }
    }

    export const userRepository = new UserRepository(); // Export an instance
    ```

---

### 4. Single Source of Truth for Swagger Request Schemas

-   **Priority**: Medium
-   **Title**: Generate Swagger Schemas from Joi Validations
-   **Current Implementation**: Swagger schemas for request bodies are defined manually inside JSDoc blocks in the route files (e.g., `RegisterRequest` in `auth.routes.ts`). This duplicates the logic already present in the Joi validation schemas and DTOs.
-   **What Should Be Improved**: Use a library like `joi-to-swagger` to automatically generate OpenAPI schemas from the Joi validation objects. These can then be merged into the main Swagger specification.
-   **Why This Is Important**:
    -   **Architecture / DRY**: Establishes the Joi validation schema as the single source of truth for the shape of incoming requests.
    -   **Maintainability**: Eliminates documentation drift. When a validation rule is updated in the Joi schema, the API documentation is updated automatically, ensuring it is never out of sync.
-   **Example Code Snippet (Conceptual)**:

    ```typescript
    // 1. Install joi-to-swagger
    // npm install joi-to-swagger

    // 2. Update swagger config to merge generated schemas
    // src/config/swagger.ts
    import j2s from 'joi-to-swagger';
    import { registerSchema, loginSchema } from '../validations/auth.validation';

    const { swagger: authSchemas } = j2s({
        'RegisterRequest': registerSchema,
        'LoginRequest': loginSchema
    });

    const options: swaggerJSDoc.Options = {
        definition: {
            // ... existing openapi config
            components: {
                // ... existing components
                schemas: {
                    ...authSchemas, // Merge the auto-generated schemas
                    // ... other manually defined schemas like responses
                }
            }
        },
        apis: ["./src/routes/**/*.ts"],
    };
    ```

---

### 5. Improve Type Safety in Repository Method Signatures

-   **Priority**: Low
-   **Title**: Replace `any` with Specific Prisma Types in Repository Functions
-   **Current Implementation**: Many repository methods accept `any` as a parameter type (e.g., `create(data: any)`, `findAll(options: any)`). This undermines the strict type safety enforced elsewhere.
-   **What Should Be Improved**: Replace `any` with the appropriate, specific types generated by Prisma.
-   **Why This Is Important**:
    -   **TypeScript Typing**: Improves compile-time safety and developer experience. It allows for autocompletion and ensures that only valid filter, sort, and data structures can be passed to the data layer.
-   **Example Code Snippet (Improved `product.repository.ts`)**:

    ```typescript
    // Define a specific type for findAll options
    type ProductFindAllOptions = {
        where?: Prisma.ProductWhereInput;
        skip?: number;
        take?: number;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }

    export const create = async (data: Prisma.ProductCreateInput): Promise<PlainProduct> => {
      return prisma.product.create({
        data,
        select: productSelect,
      });
    };

    export const findAll = async (options: ProductFindAllOptions): Promise<{ items: PlainProduct[], total: number }> => {
        const { where, skip, take, orderBy } = options;
        // ... implementation
    };
    ```
