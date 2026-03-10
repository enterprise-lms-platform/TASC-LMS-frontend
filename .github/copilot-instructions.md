# AI Agent Instructions for TASC LMS Frontend

## Project Overview
**TASC LMS Frontend** is a React 19 + TypeScript + Vite application for a Learning Management System. It supports **six user roles** with distinct feature sets: Learner, Instructor, Manager, Finance, Business, and Superadmin. The project uses a **service-oriented architecture** with TanStack Query for data management and role-based routing.

---

## Architecture Overview

### High-Level Data Flow
```
User Request → React Router → ProtectedRoute (role check) → Route Loader (data prefetch)
    ↓
Page Component → Hooks (useAuth, useLearning, etc.) → Services (*.services.ts)
    ↓
TanStack Query Cache → Axios API Client → Django Backend (http://localhost:8000/api)
```

### Role-Based Structure
Each role has its own component folder and route configuration:
- **Learner** (`src/components/learner/`): Course browsing, enrollment, learning, certificates
- **Instructor** (`src/components/instructor/`): Course creation, content upload, grading
- **Manager** (`src/components/manager/`): Organization category management, approvals
- **Finance** (`src/components/finance/`): Payments, invoices, subscriptions, analytics
- **Business** (`src/components/business/`): B2B partnerships and features
- **Superadmin** (`src/components/superadmin/`): System-wide management (users, organizations, audit logs)

**Key Pattern**: Access control enforced via `ProtectedRoute` component which checks `user.role` against required role(s).

### Service Layer Organization
Located in `src/services/`:
- **auth.services.ts**: Login, registration, token refresh, MFA
- **catalogue.services.ts**: Courses, categories, tags, modules, sessions, quiz management
- **learning.services.ts**: Enrollments, progress tracking, certificates, discussions
- **payments.services.ts**: Invoices, transactions, subscriptions, payment methods
- **public.services.ts**: Public courses (no auth required)
- **upload.services.ts**: File/avatar/media uploads (FormData-based)
- **organization.services.ts**: Organizations, user management
- **superadmin.services.ts**: Audit logs, system settings
- **main.api.ts**: Consolidated API export (use `import { api }` for convenience)

**Pattern**: Each service exports a named API object (e.g., `courseApi`, `enrollmentApi`) with CRUD methods that return Axios promises.

---

## Critical Development Patterns

### 1. Route Loaders (Pre-Fetch Data)
Located in `src/routes/loaders/*.ts`. Loaders are **required** for all role-specific pages.

**Key Concept**: Loaders run BEFORE component renders using `queryClient.ensureQueryData()` to leverage TanStack Query cache.

**Example Pattern** (from learnerLoaders.ts):
```typescript
export const learnerDashboardLoader = async (queryClient: QueryClient) => {
  try {
    const enrollments = await queryClient.ensureQueryData({
      queryKey: queryKeys.enrollments.all,
      queryFn: () => enrollmentApi.getAll().then((r) => r.data),
      staleTime: 5 * 60 * 1000, // Cache 5 minutes
    });
    return { enrollments };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 401) return redirect('/login');
    return { enrollments: [] }; // Graceful fallback
  }
};
```

**When Creating New Loaders**:
- Handle 401 (redirect to `/login`) and 403 (redirect to learner dashboard)
- Always provide fallback return values for failed queries
- Use `staleTime` to set cache freshness (5-10 min typical)
- Pass loader to router and call via `createLoader()` HOF in router.tsx

### 2. Query Key Management
Centralized in `src/hooks/queryKeys.ts`. This ensures cache invalidation works correctly.

**Pattern**: Nested objects mapping entities to their query keys:
```typescript
queryKeys.courses.all({ instructor_courses: true }) → ['courses', { instructor_courses: true }]
queryKeys.courses.detail(123) → ['courses', 'detail', 123]
queryKeys.enrollments.all → ['enrollments']
```

**When Updating/Creating/Deleting**: Use `queryClient.invalidateQueries()` with the appropriate key to clear cache.

### 3. Custom Hooks (Data Fetching)
Located in `src/hooks/use*.ts`. Each domain has a dedicated hook file:

**Examples**:
- `useAuth()`: Returns auth context with login/register/logout methods
- `useLearning()`: Hooks for enrollments, progress, certificates, discussions
- `useCatalogue()`: Hooks for courses, categories, tags
- `usePayments()`: Hooks for invoices, subscriptions

**Pattern**: Hooks use TanStack Query mutations/queries with automatic error handling.

### 4. Authentication Context
`src/contexts/AuthContext.tsx` provides global auth state with:
- `user`: Current user object (or null)
- `login()`, `register()`, `logout()` async methods
- `error`: Auth-related error message
- `isLoading`, `isFetching`: Loading states

**Usage**: `const { user, login, logout } = useAuth()`

---

## API Communication

### Base API Setup
- **Base URL**: Backend configured in `vite.config.ts` proxy: `http://127.0.0.1:8000`
- **API Path**: All requests go to `/api/v1/*`
- **Auth**: Token stored in HTTP-only cookies (set by backend on login)

### Making Requests in Services
```typescript
// In catalogue.services.ts (example)
export const courseApi = {
  getAll: (params?: CourseListParams) =>
    apiClient.get<CourseDetail[]>(`${BASE_PATH}/courses/`, { params }),
  
  create: (data: CourseCreateRequest) =>
    apiClient.post<CourseDetail>(`${BASE_PATH}/courses/`, data),
  
  update: (id: number, data: Partial<CourseCreateRequest>) =>
    apiClient.patch<CourseDetail>(`${BASE_PATH}/courses/${id}/`, data),
};
```

**Key Pattern**: All methods return Axios promises with `.then((r) => r.data)` in loaders/hooks.

### Handling File Uploads
Use `uploadApi` from `src/services/upload.services.ts`. Sends FormData with proper headers.

---

## Component Conventions

### Page Components (`src/pages/*.tsx`)
- Receive loader data via `useLoaderData()`
- Use hooks for mutations (create/update/delete)
- Handle role-based conditional rendering
- All pages wrapped in `ProtectedRoute` with required role(s)

### Reusable Components
- Located in `src/components/reusable/` for shared UI
- Material-UI components via `@mui/material`
- Custom icons via `src/components/customIcons.tsx`
- Font Awesome for additional icons

---

## Build & Development Commands

```bash
npm run dev        # Start dev server (Vite at http://localhost:5173)
npm run build      # TypeScript check + Vite build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

**Important**: Backend must run at `http://127.0.0.1:8000` for proxy to work (configured in `vite.config.ts`).

---

## Git Workflow (Trunk-Based Development)

- **Never push to `main`** directly
- Create feature branches: `git checkout -b feature/your-feature`
- All merges via pull request + review
- Violation may result in access restrictions

---

## Role-Specific Development Patterns

Each role has distinct loader patterns. When adding features for a specific role:

### Learner Workflows
- **Focus**: Course enrollment, progress tracking, certificates
- **Key Loaders**: `learnerDashboardLoader`, `coursePlayerLoader`, `learnerCertificatesLoader`
- **Patterns**: Fetch enrollments + session progress, handle non-enrolled course access, manage completion milestones
- **Example**: New feature at learner level requires: `learnerLoaders.ts` entry + route + `ProtectedRoute role="learner"` + `useLearning()` hook

### Instructor Workflows
- **Focus**: Course creation, content management, grading, learner tracking
- **Key Loaders**: `instructorDashboardLoader`, `courseStructureLoader`, `instructorLearnersLoader`
- **Patterns**: Fetch only instructor's own courses, validate ownership before update, handle submissions/grading
- **Example**: Creating grading page requires: course ID validation in loader → fetch enrollments + submissions → mutations via `useCatalogue()` or new hook

### Manager Workflows
- **Focus**: Category management, course approvals, organization settings
- **Key Loaders**: `managerDashboardLoader`, `managerCategoriesLoader`
- **Patterns**: List all courses/categories for org context, approval workflow with status transitions
- **Mutations**: Category CRUD via `categoryApi`, approval status changes via `courseApprovalApi`

### Finance Workflows
- **Focus**: Invoices, transactions, subscriptions, revenue analytics
- **Key Loaders**: `financeDashboardLoader`, `financePaymentsLoader`
- **Patterns**: Time-range filters, pagination, transaction reconciliation, subscription management
- **Services**: `invoiceApi`, `transactionApi`, `subscriptionApi`, `userSubscriptionApi` (all from `payments.services.ts`)

### Superadmin Workflows
- **Focus**: System-wide management, audit logs, all organizations/users, security
- **Key Loaders**: `superadminDashboardLoader`, `auditLogsLoader`, `approvalQueueLoader`
- **Patterns**: Search/filter all entities, track changes via audit logs, approve/reject at system level
- **Danger Zone**: Superadmin mutations affect entire system; always validate with `if (err.status === 403) return redirect('/learner')`

---

## Testing & Code Quality

### Recommended Testing Setup
While the project has **no test infrastructure yet**, recommended approach for future expansion:

**Use Vitest** (not Jest) because:
- Native ESM support (matches Vite's use of ESM)
- Zero config with Vite integration
- Faster test execution than Jest
- Built-in coverage with `--coverage` flag

**Add to package.json**:
```json
{
  "devDependencies": {
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/user-event": "^14.x"
  },
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

**Test file convention**: Place tests alongside source files as `Component.test.tsx` or in `__tests__/` folder.

**Linting**: Project uses ESLint (see `eslint.config.js`) with React hooks plugin enabled. Run `npm run lint` before commits.

---

## GitHub Actions & Deployment

### Current Setup
- **CI/CD**: No GitHub Actions workflows currently configured (`.github/workflows/` is empty)
- **Build Environment**: Docker multi-stage build (Node → Nginx) in project root `Dockerfile`
- **Local Deployment**: `docker-compose.frontend.yml` runs on `127.0.0.1:9010` (proxied by host Nginx)

### Recommended GitHub Actions Workflow
When setting up CI/CD, create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build  # TypeScript check + Vite build
      # Add npm run test once testing is set up
      - name: Build Docker image
        run: docker build -t tasc-lms-frontend:latest .
```

### Deployment Strategy
1. Build passes → Docker image built and pushed to registry
2. Staging deployment via Docker Compose (with `docker-compose.frontend.yml`)
3. Host Nginx reverse-proxies container on `127.0.0.1:9010`
4. Production: Similar setup with environment-specific Dockerfile/compose

---

## Performance Optimization Patterns

The project uses several key strategies for optimal performance:

### 1. Route-Level Code Splitting
While library imports are not yet lazy-loaded, consider lazy loading role-specific sections:
```typescript
// In router.tsx - future optimization
const InstructorModule = lazy(() => import('../pages/InstructorDashboard'));
const FinanceModule = lazy(() => import('../pages/FinanceDashboard'));

// Wrapped with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <InstructorModule />
</Suspense>
```

### 2. Query Caching Strategy (Already Implemented)
- **Critical Hit**: Pre-fetch in loaders using `ensureQueryData()` before render
- **Staleness**: 5-10 min for user data, 15-30 min for public data
- **Real-time**: 2-3 min for session progress to balance freshness vs. server load
- **Invalidation**: Mutations immediately invalidate relevant queries

### 3. Component Memoization Opportunities
For frequently-rendered lists (enrollments, courses, transactions):
```typescript
const EnrollmentCard = memo(({ enrollment }) => /* ... */);
const CourseList = memo(({ courses }) => /* ... */);
```

### 4. Pagination
- **Loaders**: Fetch with `limit` param to reduce initial payload
- **Tables**: Use `page` query param to paginate finance/payment lists
- **Example**: `financePaymentsLoader` fetches transactions with pagination support

### 5. Image Optimization
- **Avatars**: Stored in `public/avatars/`
- **Course Images**: Stored in `public/course_images/`
- **Certificates**: Template-based in `public/certificate/`
- Recommendation: Use responsive image formats (WebP) in future

---

## Postman API Testing

### Collection Structure (To Be Created)
Since Postman collections don't exist yet, create the following structure in your Postman workspace:

**Folder Organization**:
```
TASC LMS API v1
├── Authentication
│   ├── Login (POST /api/v1/auth/login)
│   ├── Register (POST /api/v1/auth/register)
│   ├── Refresh Token (POST /api/v1/auth/refresh)
│   └── Logout (POST /api/v1/auth/logout)
├── Catalogue
│   ├── Courses (GET, POST, PATCH)
│   ├── Categories (GET, POST, PATCH)
│   ├── Sessions (GET, POST)
│   ├── Course Approvals (GET, PATCH /approve)
│   └── Quiz Management
├── Learning
│   ├── Enrollments (POST to enroll, GET)
│   ├── Progress (GET session progress)
│   ├── Certificates (GET, verify)
│   └── Discussions
├── Payments
│   ├── Invoices (GET list, GET detail)
│   ├── Transactions (GET, filter by status/date)
│   ├── Subscriptions (GET, POST create)
│   └── Payment Methods
├── Organizations
│   └── Users (GET, POST invite)
└── Superadmin
    ├── Audit Logs (GET with filters)
    └── All Courses (GET system-wide)
```

### Environment Variables
Create these Postman environments:

**Local Development Environment**:
```json
{
  "baseUrl": "http://localhost:5173",
  "apiUrl": "http://127.0.0.1:8000/api/v1",
  "token": "{{retrieved from login}}",
  "adminToken": "{{superadmin token}}"
}
```

**Staging Environment**:
```json
{
  "baseUrl": "https://staging.tasclms.com",
  "apiUrl": "https://api-staging.tasclms.com/api/v1",
  "token": "{{staging token}}",
  "adminToken": "{{staging admin}}"
}
```

### Pre-Request Script (for auto-token refresh)
```javascript
// Add to collection > Pre-request
if (pm.globals.get('tokenExpiry') < Date.now()) {
  pm.sendRequest({
    url: pm.environment.get('apiUrl') + '/auth/refresh',
    method: 'POST'
  }, (err, response) => {
    if (!err && response.code === 200) {
      pm.environment.set('token', response.json().access_token);
    }
  });
}
```

### Key Test Endpoints by Role
- **Learner**: `GET /enrollments`, `POST /enrollments`, `GET /session-progress`
- **Instructor**: `GET /courses?instructor_courses=true`, `POST /courses`, `PATCH /submissions/grade`
- **Manager**: `GET /categories`, `GET /courses/approvals`
- **Finance**: `GET /invoices`, `GET /transactions`, `GET /subscriptions`
- **Superadmin**: `GET /audit-logs`, `GET /courses` (all), `GET /users` (all)

---

## Common Task Workflows

### Adding a New Learner Feature
1. Create page in `src/pages/`
2. Create loader in `src/routes/loaders/learnerLoaders.ts`
3. Add route in `router.tsx` with `ProtectedRoute role="learner"`
4. Use `useLearning()` or `useCatalogue()` hooks for data
5. Create component folder in `src/components/learner/` if needed

### Adding API Endpoint
1. Create method in appropriate service file (catalogue.services.ts, etc.)
2. Add query key pattern to `src/hooks/queryKeys.ts`
3. Create hook wrapper if used across multiple pages
4. Use in loaders or component hooks with cache invalidation

### Handling Errors
- 401 errors: Redirect to `/login`
- 403 errors: Redirect to learner dashboard (insufficient permissions)
- Network errors: Show toast/snackbar using page component state
- Use `getErrorMessage(err)` from `main.api.ts` for user-friendly messages

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/routes/router.tsx` | Route definitions, loaders, role-based access |
| `src/routes/loaders/` | Data pre-fetching for each role |
| `src/hooks/queryKeys.ts` | Centralized query key definitions |
| `src/services/main.api.ts` | Consolidated API exports |
| `src/contexts/AuthContext.tsx` | Global auth state |
| `src/components/ProtectedRoute.tsx` | Role-based access control |
| `vite.config.ts` | Dev server proxy config |

---

## Type System
- All API types defined in `src/types/types.ts`
- Service files export their request/response types
- Use `as const` for query key tuple types for type safety
- Loaders return typed objects via `useLoaderData<T>()`

---

## Caching Strategy
- **Default staleTime**: 5-10 minutes for user-specific data (enrollments, progress)
- **Public data**: 15-30 minutes (courses, categories)
- **Real-time data** (progress): 2-3 minutes frequent refresh
- **Invalidate on mutation**: Always call `queryClient.invalidateQueries()` after create/update/delete
