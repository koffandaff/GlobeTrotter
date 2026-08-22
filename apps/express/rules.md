
You are now responsible ONLY for the backend application located at:

```text
express/
```

The backend uses:

* Express
* TypeScript
* PostgreSQL
* Prisma ORM
* REST API architecture
* Modular/feature-based architecture

The backend must be designed as a professional modular monolith.

Do NOT modify the frontend unless absolutely necessary for a backend integration requirement.

Do NOT invent application-specific business features.

---

# 1. Backend Architecture

The request flow should conceptually be:

```text
HTTP Request
    ↓
Security Middleware
    ↓
Request ID / Logging
    ↓
CORS / Headers / Rate Limiting
    ↓
Authentication
    ↓
Authorization / RBAC
    ↓
Request Validation
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

Not every endpoint needs every layer explicitly, but the architectural boundaries must remain clear.

---

# 2. Module-Based Architecture

Business functionality MUST live inside:

```text
src/modules/
```

Do NOT create global:

```text
controllers/
services/
repositories/
models/
```

folders for business features.

Instead:

```text
src/modules/
└── feature/
    ├── feature.routes.ts
    ├── feature.controller.ts
    ├── feature.service.ts
    ├── feature.repository.ts
    ├── feature.schema.ts
    ├── feature.types.ts
    └── index.ts
```

Keep feature-specific code inside its module.

---

# 3. Core vs Business Logic

The following belongs in `src/core/`:

```text
auth/
errors/
http/
logger/
middleware/
rbac/
```

These are application-wide infrastructure concerns.

Business logic belongs inside:

```text
src/modules/
```

Reusable generic functionality belongs inside:

```text
src/shared/
```

Do not place feature-specific logic into `shared/`.

---

# 4. Express Application Setup

Create a clean separation between:

```text
app.ts
server.ts
```

`app.ts` should be responsible for constructing/configuring the Express application.

`server.ts` should be responsible for starting the server.

This separation makes testing easier.

---

# 5. Configuration

Create centralized environment configuration.

Environment variables must be validated at startup.

Do not access `process.env` randomly throughout the application.

Prefer a centralized configuration layer.

Required configuration should fail fast when missing.

Never log secret values.

---

# 6. Security Middleware

Establish sensible baseline security.

Consider and implement where appropriate:

* Helmet/security headers
* CORS
* request body size limits
* rate limiting
* request ID
* structured logging
* safe error handling
* secure cookie configuration if cookies are used

CORS must be explicitly configured.

Do not blindly use:

```text
origin: "*"
```

for authenticated applications.

---

# 7. Error System

Implement a centralized application error system.

Create typed errors for common situations such as:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
DatabaseError
ExternalServiceError
InternalServerError
```

Create centralized Express error middleware.

All unexpected errors should eventually reach this middleware.

Do not duplicate error response formatting in every controller.

Production responses must NOT expose:

* stack traces
* SQL errors
* filesystem paths
* secrets
* internal implementation details

Development logging may contain additional diagnostic information, but never secrets.

---

# 8. API Response Design

Create a consistent response strategy.

Success responses should be predictable.

Error responses should be predictable.

Use appropriate HTTP status codes.

Do not create different response formats randomly between modules.

Document the chosen response format.

---

# 9. Request Validation

Implement runtime validation for:

* request body
* route parameters
* query parameters

Use one consistent validation library.

Validation should happen before business logic.

Controllers should receive validated data.

Do not trust TypeScript types as runtime validation.

---

# 10. Authentication Foundation

Create the backend architecture required for authentication, but DO NOT invent a final authentication mechanism unless one has already been selected.

Authentication should be isolated from business modules.

The architecture should make it possible to support:

```text
Authentication
    ↓
Current User
    ↓
Authorization
```

Do not implement fake authentication.

Do not hardcode users.

Do not create insecure demo credentials.

If authentication strategy is not yet decided, leave a clean integration point and document what remains undecided.

---

# 11. RBAC Foundation

Create reusable authorization infrastructure.

The design must support:

```text
User
    ↓
Role
    ↓
Permission
```

where appropriate.

Authorization middleware/utilities should be reusable by future modules.

Do not hardcode role checks inside every controller.

Avoid:

```ts
if (user.role === "admin") {
   ...
}
```

being duplicated throughout the application.

Prefer a centralized permission model.

However, do not invent a complete business-specific permission matrix before the actual product requirements exist.

---

# 12. Authorization Requirements

For every future protected route, the developer/agent must explicitly determine:

1. Is authentication required?
2. Which roles/permissions are allowed?
3. Is resource ownership relevant?
4. Are organization/team boundaries relevant?
5. Is the action destructive?
6. Is additional validation required?

Frontend authorization is NEVER sufficient.

The backend is the final security boundary.

---

# 13. Repository Pattern

Database access should normally be contained in repositories.

Example:

```text
controller
    ↓
service
    ↓
repository
    ↓
prisma
```

Repositories should provide focused functions.

Avoid leaking Prisma implementation details unnecessarily throughout business logic.

Do not duplicate database queries.

Before creating a repository function, search for an existing one that can be reused.

---

# 14. Prisma

Prisma should be the standard database access mechanism.

Use:

```text
prisma/
    schema.prisma
    migrations/
```

However:

## DATABASE SCHEMA IS LOCKED BY DEFAULT.

Do NOT invent schema models.

Do NOT modify schema.prisma because a feature "might need" something.

Do NOT generate migrations without explicit approval.

If a feature requires a database change:

STOP and report:

```text
DATABASE SCHEMA CHANGE REQUIRED

Problem:
...

Proposed change:
...

Reason:
...

Impact:
...

Alternatives:
...

Recommendation:
...

Approval required.
```

---

# 15. N+1 Query Prevention

N+1 queries are explicitly prohibited where avoidable.

Before implementing database access, consider:

* joins
* Prisma relation loading
* batching
* aggregation
* pagination
* query composition

Do not blindly include every relation.

Fetch only what the operation requires.

For list endpoints, think carefully about query count.

---

# 16. Pagination

Any endpoint that could return an unbounded collection must consider pagination.

Do not return potentially thousands of records by default.

Use a consistent pagination strategy.

Validate pagination parameters.

Protect the API from unreasonable page sizes.

---

# 17. Database Transactions

Use transactions when multiple database operations must succeed or fail together.

Do not use transactions unnecessarily.

Document important transactional behavior.

---

# 18. Service Layer

Services own business logic.

A service may:

* validate business rules
* coordinate repositories
* coordinate multiple operations
* interact with external services
* enforce workflow rules

Services should not depend on Express `Request`/`Response` objects.

Keep HTTP concerns out of the service layer.

---

# 19. Controller Layer

Controllers should be thin.

Typical controller responsibility:

```text
Request
    ↓
Read validated input
    ↓
Call service
    ↓
Return response
```

Do not put:

* database queries
* complex business rules
* authorization logic
* large workflows

inside controllers.

---

# 20. Logging

Implement structured logging where practical.

Logs should help diagnose:

* requests
* errors
* important application events
* external service failures
* database failures

NEVER log:

* passwords
* access tokens
* refresh tokens
* API keys
* secrets
* private credentials
* unnecessary sensitive user data

---

# 21. External Services

If future modules interact with external APIs:

* use timeouts
* handle failures
* validate responses
* handle rate limits
* avoid hanging requests
* retry only when safe
* log failures without secrets

Do not assume external services are reliable.

---

# 22. API Versioning

Use a consistent API prefix.

Prefer:

```text
/api/v1
```

unless the existing project requirements specify otherwise.

Keep versioning centralized.

---

# 23. Health Endpoint

Create a minimal health endpoint.

It should distinguish, where practical, between:

```text
Application is running
```

and:

```text
Application dependencies are healthy
```

Do not expose sensitive infrastructure information.

---

# 24. Testing Foundation

Set up the testing structure without inventing business tests.

The architecture should make it possible to test:

* services
* repositories
* validation
* middleware
* authorization
* API routes

Future security-critical functionality should receive tests.

---

# 25. Code Quality

Use strict TypeScript where practical.

Avoid:

```text
any
```

unless there is a justified reason.

Avoid:

* duplicated code
* magic strings
* giant functions
* deeply nested conditionals
* unused code
* dead code
* unnecessary abstractions
* generic "god" services
* generic "god" utility files

Use descriptive names.

Prefer explicit code over clever code.

---

# 26. Security Review

Before completing any backend feature, verify:

```text
[ ] Authentication considered
[ ] Authorization implemented
[ ] RBAC/permissions correct
[ ] Resource ownership checked
[ ] Input validated
[ ] Input safely handled
[ ] Rate limiting considered
[ ] CORS considered
[ ] Sensitive data protected
[ ] Errors do not leak internals
[ ] Database queries are safe
[ ] N+1 avoided
[ ] Pagination considered
[ ] Secrets are not exposed
[ ] Logs do not contain secrets
```

---

# 27. Performance Review

Before completing an endpoint, ask:

```text
How many database queries does this make?

Can this query return too much data?

Is pagination required?

Could this cause N+1?

Could this operation be expensive under repeated requests?

Does this need caching?

Is there unnecessary serialization or processing?
```

Do not optimize blindly.

Optimize based on actual bottlenecks and predictable risks.

---

# 28. API Documentation

Keep API documentation updated as endpoints are introduced.

Document:

* endpoint
* method
* authentication
* authorization
* request body
* query parameters
* response
* possible errors

Do not allow undocumented behavior to become the accidental API contract.

---

# 29. Agent Development Workflow

For every backend task:

### Step 1

Read `rules.md`.

### Step 2

Inspect the relevant module.

### Step 3

Search for reusable code.

### Step 4

Understand existing API contracts.

### Step 5

Check authentication/authorization requirements.

### Step 6

Check whether database changes are required.

### Step 7

If schema changes are required, STOP and ask for approval.

### Step 8

Implement the smallest clean solution.

### Step 9

Run type checking.

### Step 10

Run linting.

### Step 11

Run relevant tests.

### Step 12

Review security implications.

### Step 13

Review database query efficiency.

### Step 14

Update documentation if behavior changed.

---

# 30. Do Not Do This

Never:

* bypass authentication because it is inconvenient
* rely on frontend authorization
* expose database errors
* expose secrets
* trust client-provided roles
* trust client-provided ownership
* directly query Prisma from controllers
* duplicate repository queries
* silently change database schema
* create migrations without approval
* add packages without justification
* disable security middleware just to make development easier
* use `any` everywhere to make TypeScript errors disappear
* swallow errors silently
* return stack traces to users
* implement fake security
* hardcode credentials

---

# 31. Final Backend Standard

The backend should be:

```text
Modular
Typed
Secure
Validated
Testable
Observable
Performant
Predictable
Maintainable
```

The hackathon deadline is not a reason to bypass security or architecture.

Use the simplest architecture that satisfies the requirements.

Do not build infrastructure for hypothetical future requirements.

Build what is required, but build it correctly.
