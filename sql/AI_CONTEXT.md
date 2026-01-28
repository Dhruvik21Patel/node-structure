# AI Code Generation Rules for This Repository

**Objective**: To ensure all AI-generated code strictly adheres to the established architecture, patterns, and quality standards of this project. These are not guidelines; they are mandatory rules.

---

### Rule 1: The Database Contract is Immutable
- **ALWAYS** read `prisma/schema.prisma` before performing any task. This file is the absolute source of truth for all data models.
- **NEVER** modify `prisma/schema.prisma`. Assume it is read-only and managed by a database administrator. Your role is to build code that conforms to this schema.

### Rule 2: The Unidirectional Layered Architecture is Absolute
You **MUST** follow this exact data flow. Do not skip or merge layers.
**`Route` → `Validation (Joi)` → `Controller` → `Service` → `Repository` → `Prisma`**

- **Controllers** only manage HTTP requests and responses.
- **Services** only contain business logic.
- **Repositories** only access the database.

### Rule 3: Data Access Layer (Repository) Constraints
- The Prisma client (`import { prisma } from ...`) is **ONLY** permitted in repository files (`src/repositories/*.ts`).
- **Services and Controllers are FORBIDDEN from importing or using the Prisma client or any Prisma-generated types.** This is a critical architectural boundary.

### Rule 4: Plain Types via `Prisma.GetPayload` (The "Select" Pattern)
To ensure type safety and decoupling from the ORM, you **MUST** use the `GetPayload` pattern.
1. For each model, define a `select` object in its repository that specifies all fields to be retrieved.
   ```typescript
   // src/repositories/product.repository.ts
   const productSelect = {
     id: true,
     name: true,
     // ... other fields
     category: { select: { id: true, name: true } },
   };
   ```
2. Generate a plain object type using `Prisma.GetPayload`. **Manually writing plain object types is now forbidden.**
   ```typescript
   // src/repositories/product.repository.ts
   import { Prisma } from "@prisma/client";

   export type PlainProduct = Prisma.ProductGetPayload<{
     select: typeof productSelect;
   }>;
   ```
3. All repository methods (`find`, `create`, `update`) **MUST** use this `select` object and return the generated `Plain` type (e.g., `Promise<PlainProduct>`).

### Rule 5: DTO (Data Transfer Object) Mapping
- The API's public contract is defined by Response DTOs, not database models.
- A `Response DTO` (e.g., `ProductResponseDTO`) **MUST** have a constructor that accepts a `Plain` object (e.g., `PlainProduct`).
- This constructor is the **only** place where data from the repository is mapped to the final response shape.
- Services **MUST** return `Response DTOs`. They must never return `Plain` types or Prisma models.

### Rule 6: Relational Integrity Enforcement
- **Services Enforce Business Rules**: Before creating or updating an entity, the **Service** layer is responsible for verifying the existence of related entities. For example, the `product.service.ts` must call `categoryRepository.findById` to ensure the `categoryId` is valid.
- **Repositories Manage Connections**: After validation, the Service passes the foreign key ID (e.g., `userId`, `categoryId`) to the repository. The repository includes this ID directly in the `data` payload for the `create` or `update` Prisma call.

### Rule 7: Authentication and Authorization Flow
1. The `auth.middleware.ts` is the single source of truth for user authentication. It verifies the JWT and attaches the plain `user` object to `req.user`.
2. **Controllers** retrieve the user ID via `getAuthUser(req).id`.
3. **Services** **MUST** receive the `userId` as a primitive function parameter from the controller. Services must remain agnostic of the `req` object, JWTs, and the authentication process.

### Rule 8: Validation and Documentation
- **Joi Schemas**: All Joi validation schemas in `src/validations/` must precisely match the fields and constraints of the corresponding `prisma/schema.prisma` model and the Request DTO.
- **Swagger**: Every route **MUST** have a JSDoc block. The `@swagger` schemas (`requestBody`, `responses`) **MUST** reference the DTO schemas (e.g., `$ref: '#/components/schemas/ProductResponse'`).

### Rule 9: Code Quality and Strictness
- The `any` type is strictly **FORBIDDEN**. Adhere to the `strict: true` setting in `tsconfig.json`.
- All new code must follow the existing file naming and coding conventions.
- Do not add comments explaining *what* code does. Add comments only to explain *why* complex or non-obvious logic exists.
