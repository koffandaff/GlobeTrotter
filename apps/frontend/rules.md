You are now responsible ONLY for the frontend application located at:

```text
frontend/
```

Read `rules.md` at the repository root before making ANY changes.

The frontend uses:

- Next.js 16
- React
- TypeScript
- App Router
- Feature-based architecture
- Express as the backend API
- PostgreSQL/Prisma indirectly through the backend

The frontend is NOT responsible for database access.

Do NOT modify backend business logic.

Do NOT invent product features.

---

# 1. Frontend Architecture

Use Next.js App Router.

Keep routing inside:

```text
app/
```

Keep reusable UI inside:

```text
components/
```

Keep feature-specific code inside:

```text
features/
```

Keep frontend infrastructure inside:

```text
lib/
```

Keep reusable hooks inside:

```text
hooks/
```

---

# 2. Feature Architecture

Features should follow:

```text
features/
└── feature/
    ├── components/
    ├── hooks/
    ├── api/
    ├── schemas/
    ├── types.ts
    └── constants.ts
```

Do not put feature-specific components into global `components/`.

Example:

```text
features/projects/components/ProjectCard.tsx
```

rather than:

```text
components/ProjectCard.tsx
```

unless the component is genuinely reusable across unrelated features.

---

# 3. Global UI Components

Reusable design-system components belong in:

```text
components/ui/
```

Examples:

```text
Button
Input
Dialog
Modal
Toast
Dropdown
Select
Table
Skeleton
Badge
Tooltip
```

Do not recreate these individually for every feature.

Use the project's chosen UI component library where appropriate.

Do not install multiple UI libraries for the same purpose.

---

# 4. UI Philosophy

The application should look:

- professional
- clean
- modern
- understandable
- consistent
- responsive

Do NOT make it flashy for the sake of being flashy.

Avoid:

- excessive gradients
- unnecessary animations
- excessive shadows
- random glassmorphism
- giant cards
- excessive rounded containers
- inconsistent spacing
- unnecessary decorative elements

The interface should communicate hierarchy clearly.

---

# 5. Design Consistency

Establish consistent rules for:

- spacing
- typography
- buttons
- inputs
- cards
- borders
- dialogs
- tables
- navigation
- colors
- status indicators
- error states

Once a design pattern exists, reuse it.

Do not invent a new button style on every page.

Do not invent a different modal design on every feature.

---

# 6. User Journey

Every major user journey should consider:

```text
Entry
 ↓
Loading
 ↓
Interaction
 ↓
Validation
 ↓
Submission
 ↓
Success / Error
 ↓
Next logical action
```

The user should always understand:

- what is happening
- what they can do
- what went wrong
- what to do next

---

# 7. Loading States

Do not leave users staring at blank screens.

Use appropriate:

- skeletons
- spinners
- disabled states
- optimistic updates where safe

Loading UI should match the content being loaded.

Do not use a spinner for everything if a skeleton would communicate the structure better.

---

# 8. Empty States

Every list/table/grid that can be empty should have a useful empty state.

Example:

```text
No projects yet.

Create your first project to get started.

[Create Project]
```

Avoid simply displaying:

```text
No data
```

when a more useful explanation is possible.

---

# 9. Error States

Handle API failures gracefully.

Do not show:

```text
500 Internal Server Error
```

directly to normal users.

Normalize API errors through the frontend API layer.

Show useful, safe messages.

Where appropriate provide:

```text
Try again
Go back
Return to dashboard
Contact support
```

---

# 10. API Architecture

The frontend communicates with Express through a centralized API layer.

Avoid scattering raw:

```ts
fetch(...)
```

through UI components.

Prefer:

```text
lib/api/
```

and feature-specific API functions:

```text
features/projects/api/
```

For example:

```text
projectsApi.list()
projectsApi.getById()
projectsApi.create()
projectsApi.update()
projectsApi.delete()
```

Components should not need to understand low-level HTTP details.

---

# 11. API Security

Never assume the frontend is a security boundary.

The backend MUST independently enforce:

- authentication
- authorization
- RBAC
- resource ownership
- validation

The frontend should only mirror permissions for UX.

For example, hiding an Admin button is useful.

But it must NOT be considered authorization.

---

# 12. Authentication State

Authentication handling should be centralized.

Do not duplicate authentication logic throughout components.

Handle:

- authenticated user
- unauthenticated user
- loading authentication state
- expired authentication
- unauthorized API responses

Avoid infinite redirects.

Be careful with authentication-related client/server rendering boundaries.

---

# 13. Forms

Forms must have:

- accessible labels
- clear validation
- useful error messages
- loading state
- disabled state when appropriate
- success feedback
- preserved input where appropriate

Use a consistent schema/validation strategy.

Frontend validation improves UX.

Backend validation remains authoritative.

---

# 14. Dialogs

Do NOT use:

```text
alert()
confirm()
prompt()
```

Use accessible dialog/modal components.

Destructive actions should have clear confirmation where appropriate.

Example:

```text
Delete account?

This action cannot be undone.

[Cancel] [Delete]
```

Do not make destructive actions easy to trigger accidentally.

---

# 15. Toasts and Notifications

Use one consistent notification mechanism.

Do not create custom toast implementations for every feature.

Use notifications for meaningful events such as:

- successful creation
- successful update
- successful deletion
- recoverable errors

Do not spam users with unnecessary notifications.

---

# 16. Responsive Design

The application must work on:

```text
Mobile
Tablet
Desktop
```

Consider:

- narrow screens
- long text
- large numbers
- tables
- forms
- navigation
- dialogs
- empty states
- error messages

Do not assume desktop width.

---

# 17. Accessibility

Use semantic HTML.

Ensure:

- keyboard navigation
- visible focus states
- accessible labels
- appropriate heading hierarchy
- accessible dialogs
- accessible forms
- sufficient contrast
- meaningful button text

Do not use clickable `<div>` elements when a button/link is appropriate.

---

# 18. Server vs Client Components

Use Server Components by default where appropriate.

Use Client Components only when client-side behavior requires them.

Do not add:

```text
"use client"
```

to entire pages unnecessarily.

Keep the client-side JavaScript surface as small as practical.

---

# 19. Data Fetching

Use the appropriate Next.js data-fetching strategy for each use case.

Do not automatically make everything client-side.

Consider:

- Server Components
- client-side fetching
- caching
- revalidation
- mutations
- loading states

The choice should be based on the actual UX and data requirements.

---

# 20. State Management

Do NOT introduce a global state-management library unless the application actually needs one.

Prefer:

- local component state
- URL state
- server state
- React state
- existing framework capabilities

Only introduce global state when there is a clear cross-feature requirement.

---

# 21. URL State

Use URL parameters where state should be:

- shareable
- bookmarkable
- navigable
- preserved on refresh

Examples:

```text
search
filter
sort
page
tab
```

Do not hide important navigation state entirely inside local React state.

---

# 22. Error Boundaries

Use appropriate Next.js error handling mechanisms.

Consider:

```text
error.tsx
not-found.tsx
loading.tsx
```

where appropriate.

Do not create unnecessary duplicates.

Each route should have an intentional failure/loading experience.

---

# 23. Security

Never expose:

- backend secrets
- database credentials
- private API keys
- privileged credentials

through frontend code.

Treat all client-side code as publicly inspectable.

Be especially careful with environment variables.

Anything exposed to the browser should be considered public.

---

# 24. XSS and User Content

Never blindly render user-controlled HTML.

Avoid unsafe HTML rendering unless there is a clear requirement and proper sanitization.

Do not use:

```text
dangerouslySetInnerHTML
```

without understanding exactly where the content comes from and how it is sanitized.

---

# 25. Components

Components should have clear responsibilities.

Avoid giant components containing:

- API calls
- business logic
- form logic
- UI
- data transformation
- authorization logic
- navigation

all in one file.

Split responsibilities where it improves readability.

Do not split components into tiny files without reason.

---

# 26. Reusability

Before creating a component/helper/hook, search the repository.

Ask:

> Does this already exist?

If yes, reuse or extend it.

Do not create:

```text
formatDate1()
formatDate2()
formatDateForTable()
formatDateForCard()
```

when one properly designed reusable formatter is sufficient.

---

# 27. Type Safety

Use TypeScript properly.

Avoid unnecessary:

```text
any
```

Do not bypass typing simply to make errors disappear.

API responses should have explicit types.

Where practical, shared API contracts/types may be placed in:

```text
packages/shared-types/
```

Do not duplicate types unnecessarily.

---

# 28. UX Edge Cases

Before considering a UI complete, test:

```text
Long names
Long text
Empty lists
Huge numbers
Slow network
Failed network
Unauthorized response
Expired session
Duplicate submission
Double-clicking buttons
Mobile width
Keyboard navigation
Missing optional data
Unexpected API response
```

The UI should fail gracefully.

---

# 29. Performance

Avoid unnecessary:

- client components
- API requests
- re-renders
- large client bundles
- expensive computations
- duplicated data fetching

Use appropriate:

- lazy loading
- memoization
- caching
- server rendering
- image optimization

Do not optimize blindly.

---

# 30. Frontend Development Workflow

For every frontend task:

### Step 1

Read `rules.md`.

### Step 2

Inspect the existing feature.

### Step 3

Search for reusable components/hooks/helpers.

### Step 4

Understand the API contract.

### Step 5

Understand authentication and permissions.

### Step 6

Design the complete user journey.

### Step 7

Implement the smallest clean solution.

### Step 8

Handle loading/empty/error/success states.

### Step 9

Test responsive behavior.

### Step 10

Check accessibility.

### Step 11

Check API failure behavior.

### Step 12

Run linting and type checking.

### Step 13

Review for unnecessary client-side code.

---

# 31. Do Not Do This

Never:

- trust frontend RBAC as security
- expose backend secrets
- call the database directly
- duplicate business logic from Express
- scatter raw fetch calls everywhere
- use browser alerts
- ignore loading states
- ignore empty states
- ignore API errors
- create inconsistent UI patterns
- install multiple libraries for the same purpose
- add global state without justification
- make everything a Client Component
- use `dangerouslySetInnerHTML` casually
- hide backend authorization failures
- silently change API contracts

---

# 32. Definition of Done

A frontend feature is complete when:

```text
[ ] UI works
[ ] API integration works
[ ] Loading state exists
[ ] Empty state exists
[ ] Error state exists
[ ] Success feedback exists
[ ] Validation exists
[ ] Authentication behavior is correct
[ ] Authorization UX is correct
[ ] Backend remains authoritative for permissions
[ ] Responsive behavior works
[ ] Accessibility considered
[ ] Components are reusable where appropriate
[ ] No unnecessary client-side code
[ ] No obvious performance issue
[ ] TypeScript passes
[ ] Lint passes
```

The frontend should feel like one coherent application, not a collection of independently generated pages.

---

# 33. Final Frontend Standard

The frontend should be:

```text
Clean
Consistent
Accessible
Responsive
Understandable
Secure
Fast
Maintainable
```

Do not optimize for "wow" screenshots at the expense of usability.

The goal is:

> A user should understand what to do without needing to think about how the application was built.
