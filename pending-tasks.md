

# TASC LMS Frontend — Pending Tasks (Final Specification)

> **For Claude Code:** Tasks are organized by priority with exact file paths, component names, API service methods, hook names, query keys, and TypeScript interfaces from the actual codebase. Each task tells you exactly what to import, what to call, and what response shape to expect. Work top-down.

---

## Reference: Frontend Patterns

### Data Flow
```
Page Component
  → useQuery/useMutation hook (src/hooks/)
    → service function (src/services/*.services.ts)
      → apiClient (src/utils/config.ts) with auth interceptor
        → Backend API
```

### Adding a New API Integration
1. **Service method** exists in `src/services/*.services.ts`? If not, add it.
2. **Query key** exists in `src/hooks/queryKeys.ts`? If not, add it.
3. **Hook** exists in `src/hooks/use*.ts`? If not, add it.
4. **Page** calls the hook, destructures `{ data, isLoading, error }`, replaces hardcoded arrays.

### Response Pattern
```typescript
// All list endpoints return PaginatedResponse<T>
const { data } = useQuery({ queryKey: [...], queryFn: () => api.getAll().then(r => r.data) });
const items = data?.results ?? [];
const total = data?.count ?? 0;
```

### Key Service Objects (from `src/services/main.api.ts`)
```typescript
api.catalogue.course     // courseApi
api.catalogue.session    // sessionApi
api.catalogue.category   // categoryApi
api.learning.enrollment  // enrollmentApi
api.learning.certificate // certificateApi
api.learning.discussion  // discussionApi
api.payments.invoice     // invoiceApi
api.payments.transaction // transactionApi
api.payments.subscription // subscriptionApi
api.payments.userSubscription // userSubscriptionApi
api.payments.paymentMethod // paymentMethodApi
api.notifications        // notificationApi
api.reports              // reportsApi
api.users                // usersApi
api.upload               // uploadApi
api.livestream.session   // livestreamApi
api.messaging            // messagingApi
```

---

## Quick Summary — Open Tasks

| Pri | # | Task | File(s) | What To Do |
|-----|---|------|---------|------------|
| ✅ | F1 | ~~Saved Courses page + toggle~~ | `SavedCoursesPage.tsx` | Done — `savedCourseApi` + `useSavedCourses` hook wired |
| ✅ | F2 | Finance pages — replace mock data | 8 finance page files | Done — wired all 8 pages to live hooks |
| ✅ | F3 | ~~Superadmin pages — wire KPIs to stats APIs~~ | 6 superadmin page files | Done — KPIs wired; table data still mock |
| ✅ | F4 | ~~Pesapal Subscription Checkout~~ | `CheckoutPaymentPage.tsx`, `PesapalReturnPage.tsx`, `usePayments.ts`, `payments.services.ts` | Done — Pesapal hosted checkout flow wired end-to-end (initiate → redirect → return page with status polling). `duration_days` now available on Subscription from backend migration 0005. |
| ~~REMOVED~~ | F5 | ~~Promo code validation~~ — removed from scope | — | Hardcoded SAVE20 logic removed from CheckoutPaymentPage |
| ✅ | F6 | ~~Learner Progress page overhaul~~ | `ProgressPage.tsx` | Done — fixed pagination bug, milestones derived from real stats |
| ✅ | F7 | ~~Instructor Grading page wiring~~ | `GradingPage.tsx` | Done — fixed pagination bug, added status filter, file download fixed [29 Mar] |
| ✅ | F8 | ~~Manager Settings persistence~~ | `ManagerSettingsPage.tsx` | Done — wired to `GET/PATCH /api/v1/accounts/manager/organization-settings/` |
| ✅ | F9 | ~~Manager Billing real data~~ | `ManagerBillingPage.tsx` | Done — wired to `/api/v1/auth/manager/billing/plan/` and `/usage/` |
| ✅ | F10 | ~~Review interactions~~ | `CourseReviews.tsx` | Done — wired to Helpful/Report buttons and rating filter |
| ✅ | F11 | ~~CourseViewSet ordering (TopCourses)~~ | `TopCourses.tsx` | Done — uses `ordering: '-enrollment_count'`, server-side |
| ✅ | F12 | ~~Catalog sorting~~ | `CoursesGrid.tsx` | Done — sort dropdown mapped to `ordering` param |
| ✅ | F13 | ~~Business page APIs~~ | `PricingSection.tsx`, `FaqSection.tsx` | Already wired with `useQuery` + fallback data |
| ✅ | F14 | ~~Invoice PDF/email~~ | `InvoiceReceiptPage.tsx` | Done — Download uses `window.print()`, Email shows toast |
| ✅ | F15 | ~~Payment history exports~~ | `PaymentHistoryPage.tsx` | Done — Export CSV + Statement wired to `/api/v1/payments/transactions/export-csv/` blob download |
| ✅ | F16 | ~~Subscription actions~~ | `SubscriptionManagementPage.tsx` | Done — Cancel wired to `useCancelUserSubscription`, Add Payment to `useCreatePaymentMethod`, Set Default to `useSetDefaultPaymentMethod` |
| ✅ | F17 | ~~Security page~~ | `SecurityPage.tsx` | Done — wired to `GET /api/v1/superadmin/security/stats/` |
| ✅ | F18 | ~~Dashboard mock cleanup~~ | various | Done — Instructor WelcomeBanner uses real submission count; Finance Sidebar revenue → `—` (backend Task 37 needed) |
| ✅ | F19 | ~~Instructor ProgressTrackingPage wiring~~ | `ProgressTrackingPage.tsx` | Done — replaced hardcoded course arrays + funnel with `useEnrollments()` + `useLearningStats()` [29 Mar] |
| ✅ | F20 | ~~Finance remaining mock cleanup~~ | 3 finance pages | Done — Subscriptions Growth/Churn, Revenue gateway breakdown, Churn page cleanup [29 Mar] |
| ✅ | F21 | ~~Responsive fixes across all roles~~ | ~58 page files | Done — KPI cards, layout splits, button sizing, tab layouts fixed across learner/instructor/manager/finance/superadmin [30 Mar] |
| ✅ | F22 | ~~Superadmin — wire table data to real APIs~~ | ~8 files | Done — AllCoursesPage, InstructorsPage, InvoicesPage, CertificationsPage wired; AssessmentsPage, RevenuePage, NotificationsPage, SecurityPage sessions → empty state (pending backend) [30 Mar] |
| ✅ | F23 | ~~Superadmin — strip mock-only pages~~ | ~5 files | Done — DataMigrationPage, PartnershipsPage → Coming Soon; RolesPermissionsPage fake user counts removed; GatewaySettingsPage → Pesapal-only [30 Mar] |
| ✅ | F24 | ~~Finance — strip gateway mock pages~~ | 4 gateway pages | Done — GatewayAirtelPage, GatewayMpesaPage, GatewayMtnPage → Coming Soon; GatewayPesapalPage → wired to real transactions API [30 Mar] |
| ✅ | F25 | ~~Finance — wire remaining mock pages~~ | 2 files | Done — FinanceAlertsPage fake alerts cleared → empty state; FinancePricingPage KPI/subscriber counts → '—' [30 Mar] |
| ✅ | F26 | ~~Finance — fix FinanceStatementsPage hardcoded percentages~~ | 1 file | Done — removed 75%/5%/15% splits; Income Statement → empty state; only Total Revenue (real API) shown [30 Mar] |
| ✅ | F27 | ~~Non-functional buttons audit~~ | ~15 files | Done — GatewayPesapalPage Export CSV wired to `/api/v1/payments/transactions/export-csv/`; FinanceInvoicesPage Send icon wired to `/api/v1/payments/invoices/{id}/email-receipt/`; remaining buttons documented in F29–F34 [30 Mar] |
| ✅ | F28 | ~~Export functionality (frontend)~~ | multiple files | Done — Wired Export CSV buttons on Superadmin Users, Courses, Organizations, Invoices [4 Apr] |
| ✅ | F29 | ~~Superadmin SystemSettingsPage — wire Save buttons~~ | 1 file | Done — Wired to the new system settings and SMTP backend API [4 Apr] |
| ✅ | F30 | ~~Superadmin SecurityPage — wire policy Save buttons~~ | 1 file | Done — Wired to new security policies API and terminate sessions [4 Apr] |
| ✅ | F31 | ~~GatewaySettingsPage — wire Save + Test Connection~~ | `GatewaySettingsPage.tsx` | Done — See F51 above [4 Apr] |
| ✅ | F32 | ~~InstructorsPage — wire Invite Instructor button~~ | `InstructorsPage.tsx`, `InviteInstructorModal.tsx`, `users.services.ts` | Done — `usersApi.invite` → `POST /api/v1/admin/users/invite/`; modal with email/first_name/last_name; role fixed to instructor; Snackbar success/error; query invalidation [4 Apr] |
| ✅ | F33 | ~~FinanceInvoicesPage — Create Invoice modal~~ | `FinanceInvoicesPage.tsx` | Done — full `Dialog` form wired to `invoiceApi.create()` with customer name/email, due date, line items, and mutation invalidating `['payments']` cache [4 Apr] |
| MED | F34 | FinancePricingPage — Edit Plans / Manage Plan buttons | 1 file | Needs backend Task 71 (subscription plan PATCH admin endpoint) |
| ✅ | F35 | ~~WorkshopsPage — wire to real workshops API~~ | `WorkshopsPage.tsx`, `learning.services.ts` | Done — `workshopApi` + `useWorkshops`/`useCreateWorkshop`/`useDeleteWorkshop` hooks; full CRUD; create dialog; KPI cards from real data [4 Apr] |
| ✅ | F36 | ~~Fix `VITE_API_URL` inconsistency in superadmin service~~ | `src/services/superadmin.services.ts` | Done — file already uses `VITE_API_BASE_URL` on line 39; was previously fixed |
| ✅ | F37 | ~~Deduplicate `DEV_BYPASS_AUTH` constant~~ | `src/utils/config.ts`, `ProtectedRoute.tsx` | Done — exported from `config.ts` (line 8) and imported in `ProtectedRoute.tsx` (line 16); no duplicate definitions |
| ✅ | F38 | ~~Add automated test suite (Vitest + RTL)~~ | `src/test/`, `vite.config.ts`, `package.json` | Done — Vitest + RTL + jest-dom installed; `setup.ts` patches jsdom; 25 tests across 3 suites: `getErrorMessage` (9), `ProtectedRoute` (7), `CertificateVerifyModal` (9); all passing; `npm test` / `npm run test:coverage` scripts added [4 Apr] |
| ✅ | F39 | ~~Split router.tsx by role~~ | `src/routes/router.tsx` + 5 new slice files | Done — router.tsx reduced from 925 → 37 lines; extracted `publicRoutes.tsx`, `learnerRoutes.tsx`, `instructorRoutes.tsx`, `managerRoutes.tsx`, `financeRoutes.tsx`, `superadminRoutes.tsx`; all routes and loaders preserved [4 Apr] |
| ✅ | F40 | ~~Review moderation — superadmin approve/reject queue~~ | `src/pages/superadmin/`, `src/components/course/CourseReviews.tsx`, `src/components/learner/course/CourseReviews.tsx` | Done — Full superadmin queue and approval logic wired [4 Apr] |
| ✅ | F41 | ~~Testimonials — pull featured reviews from API~~ | `src/components/landing/Testimonials.tsx`, `src/components/business/TestimonialsSection.tsx` | Done — Replaced hardcoded arrays with API fetch of superadmin-featured reviews [4 Apr] |
| ✅ | F42 | ~~Certificate verification — modal on landing + branded results page~~ | `CertificateVerifyModal.tsx` (new), `Hero.tsx`, `Footer.tsx`, `CertificateValidationPage.tsx` | Done — new `CertificateVerifyModal` in hero (API verify + navigate on success); "Verify a TASC Certificate" link in hero + footer; full branded redesign of results page (gradient header, colour-coded valid/expired/invalid states, detail grid, print action, trust bar) [4 Apr] |
| ✅ | F43 | ~~Demo form — send to superadmin via backend instead of EmailJS~~ | `src/components/business/BusinessCtaSection.tsx`, new superadmin page | Done — Wired BusinessCtaSection to submit demo requests to backend API [4 Apr] |
| ✅ | F44 | ~~CourseCurriculum — remove hardcoded fallback, add empty state~~ | `src/components/course/CourseCurriculum.tsx` | Done — no `defaultModules` exists; component fetches from `sessionApi`, groups by module, renders "Curriculum coming soon" empty state when sessions is empty [already done] |
| ✅ | F45 | ~~CourseObjectives — remove hardcoded fallback, add empty state~~ | `src/components/course/CourseObjectives.tsx` | Done — no `defaultObjectives` exists; component returns `null` when `objectives` is empty/undefined [already done] |
| ✅ | F46 | ~~CourseInstructor — wire bio and stats to real API~~ | `src/components/course/CourseInstructor.tsx` | Done — Replaced placeholder bio/stats with instructor profile data from public API [4 Apr] |
| ✅ | F47 | ~~Superadmin page cleanup — mechanical button/link fixes~~ | 9 files | Done — SuperadminLayout footer `href="#"` removed; RevenuePage/RevenueChart Export buttons wired; InvoicesPage Download wired; PaymentsPage/InstructorsPage View buttons disabled; OrganizationsTable Edit-only; AllOrganizationsPage plan placeholder; CertificationsPage Edit disabled [4 Apr] |
| ✅ | F48 | ~~Superadmin AllUsersPage — wire all action buttons~~ | `AllUsersPage.tsx` | Done — Add User → navigate; Bulk Import → file picker; Edit/Delete modals; Delete = soft-deactivate with confirm; CSV template generation client-side; toast feedback [4 Apr] |
| ✅ | F49 | ~~Superadmin IntegrationsPage — clean up + PesaPal-only~~ | `IntegrationsPage.tsx`, `QuickActions.tsx` | Done — Removed Flutterwave, Coursera, LinkedIn Learning, Odoo (dead code); replaced with PesaPal; 6 real integrations; Export Data button fixed → `/superadmin/analytics` [4 Apr] |
| ✅ | F50 | ~~Superadmin AddOrganizationPage — form submission + API~~ | `AddOrganizationPage.tsx`, `organization.services.ts` | Done — Added `organizationApi.create()`; full validation (name required, email format); mutation + snackbar feedback; navigate on success [4 Apr] |
| ✅ | F51 | ~~Superadmin GatewaySettingsPage — form + Save/Test buttons~~ | `GatewaySettingsPage.tsx`, `superadmin.services.ts` | Done — Added `GatewaySettings` interface + `gatewaySettingsApi`; fields converted to controlled; Save Configuration PATCH + Test Connection POST; both show loading + feedback [4 Apr] |
| ✅ | F52 | ~~Superadmin SystemSettingsPage — feature toggles + maintenance~~ | `SystemSettingsPage.tsx`, `superadmin.services.ts` | Done — Extended `SystemSettings` interface with feature_flags + maintenance fields; feature toggles controlled + saved; maintenance mode switch + message + "Activate/Deactivate Maintenance" button wired [4 Apr] |
| ✅ | F53 | ~~Superadmin AnalyticsPage — wire assessment metrics to real API~~ | `AnalyticsPage.tsx`, `hooks/useSuperadmin.ts` | Done — Uses `useSuperadminAssessmentStats()` for real metrics (total, quizzes, assignments, pass_rate); removed hardcoded fallbacks; categoryPerformance + scoreDistribution remain as empty state placeholders [4 Apr] |
| ✅ | F54 | ~~Remove dead Flutterwave code~~ | `src/lib/flutterwave/`, `hooks/useFlutterwavePayment.ts` | Done — Deleted 3 files; no remaining imports [4 Apr] |

---

## HIGH PRIORITY

---

### Task F1: Saved Courses — Full Stack Wiring ✅ DONE (27 Mar)

**Problem:** `SavedCoursesPage.tsx` at route `/learner/saved` shows 6 hardcoded courses. `CatalogCourseCard.tsx` heart icon uses React `useState` — lost on refresh.

**Backend dependency:** Task 29 (new `SavedCourse` model + endpoints)

**Step 1 — Add service methods** (`src/services/learning.services.ts`, append):

```typescript
export interface SavedCourseResponse {
  id: number;
  course: CourseList;
  created_at: string;
}

export const savedCourseApi = {
  getAll: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<PaginatedResponse<SavedCourseResponse>>('/api/v1/learning/saved-courses/', { params }),

  save: (courseId: number) =>
    apiClient.post('/api/v1/learning/saved-courses/', { course: courseId }),

  unsave: (id: number) =>
    apiClient.delete(`/api/v1/learning/saved-courses/${id}/`),

  toggle: (courseId: number) =>
    apiClient.post<{ saved: boolean }>('/api/v1/learning/saved-courses/toggle/', { course: courseId }),
};
```

**Step 2 — Add to consolidated export** (`src/services/main.api.ts`):

```typescript
import { savedCourseApi } from './learning.services';
// In the api object, under learning:
learning: {
  // ...existing...
  savedCourse: savedCourseApi,
},
```

**Step 3 — Add query key** (`src/hooks/queryKeys.ts`):

```typescript
savedCourses: {
  all: ['saved-courses'] as const,
},
```

**Step 4 — Add hooks** (`src/hooks/useLearning.ts`, append):

```typescript
export const useSavedCourses = () =>
  useQuery({
    queryKey: queryKeys.savedCourses.all,
    queryFn: () => savedCourseApi.getAll().then(r => r.data),
  });

export const useToggleSavedCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) => savedCourseApi.toggle(courseId).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedCourses.all });
    },
  });
};
```

**Step 5 — Wire `SavedCoursesPage.tsx`:**

Replace the hardcoded `const savedCourses = [...]` with:

```typescript
import { useSavedCourses } from '../../hooks/useLearning';

const SavedCoursesPage = () => {
  const { data, isLoading } = useSavedCourses();
  const courses = data?.results ?? [];

  // Replace the hardcoded grid with courses.map(sc => ...)
  // sc.course contains the full CourseList object
};
```

**Step 6 — Wire `CatalogCourseCard.tsx` or `LearnerCourseCatalogPage.tsx`:**

Replace `const [favorites, setFavorites] = useState<Set<number>>(new Set())` with:

```typescript
import { useSavedCourses, useToggleSavedCourse } from '../../hooks/useLearning';

const { data: savedData } = useSavedCourses();
const savedIds = new Set(savedData?.results?.map(sc => sc.course.id) ?? []);
const toggleMutation = useToggleSavedCourse();

// In the heart icon onClick:
const handleFavorite = (courseId: number) => {
  toggleMutation.mutate(courseId);
};

// For isFavorite:
const isFavorite = savedIds.has(course.id);
```

---

### Task F2: Finance Pages — Replace Mock Data ✅ DONE (27 Mar)

**Problem:** 8 finance pages had hardcoded `const data = [...]` arrays despite the API services and hooks already existing.

**Solution:** Wired all 8 pages to live hooks in `src/hooks/usePayments.ts` and `src/services/learning.services.ts`.

- `FinancePaymentsPage.tsx` → `useTransactions`
- `FinanceInvoicesPage.tsx` → `useInvoices`
- `FinanceSubscriptionsPage.tsx` → `useUserSubscriptions` (Growth + Churn Rate KPIs now computed from real data [29 Mar])
- `FinanceRevenueReportsPage.tsx` → `useRevenueStats` + `useTransactions` (Revenue by Gateway now grouped from real transactions, Avg Rev/User computed [29 Mar])
- `FinanceCustomReportsPage.tsx` → `useReports`
- `FinanceSubscriptionHistoryPage.tsx` → `useTransactions`
- `FinanceChurnPage.tsx` → KPIs from `useUserSubscriptions` + `useLearningStats`; fake change chips removed; churn reasons replaced with "not yet available" message (backend doesn't track cancellation reasons) [29 Mar]
- `FinanceStatementsPage.tsx` → Proportional calc from `useRevenueStats` + `useInvoiceStats` (expense ratios are estimates — no expense API)

**Build Verification:** `npx tsc --noEmit` passed (29 Mar).

---

### Task F3: Superadmin Pages — Wire KPIs to Stats APIs ✅ DONE (27 Mar)

**Problem:** Multiple superadmin pages are entirely mock data. Backend Tasks 32–37 create the stats endpoints.

**Pages and their backend dependencies:**

| Page File | Backend Task | Endpoint to Call | Service to Create |
|-----------|-------------|------------------|-------------------|
| `AllCoursesPage.tsx` | 32 | `GET /api/v1/catalogue/courses/stats/` | `courseApi.getStats()` |
| `AssessmentsPage.tsx` | 33 | `GET /api/v1/superadmin/assessments/stats/` | new `assessmentApi.getStats()` |
| `CertificationsPage.tsx` | 34 | `GET /api/v1/learning/certificates/stats/` | `certificateApi.getStats()` |
| `InstructorsPage.tsx` | 35 | `GET /api/v1/superadmin/users/instructor-stats/` | `usersApi.getInstructorStats()` |
| `InvoicesPage.tsx` | 36 | `GET /api/v1/payments/invoices/stats/` | `invoiceApi.getStats()` |
| `RevenuePage.tsx` | 37 | `GET /api/v1/payments/revenue/stats/` | new `revenueApi.getStats()` |
| `RolesPermissionsPage.tsx` | 40 | `GET /api/v1/superadmin/users/stats/` (enhanced) | `userStatsApi.getStats()` (already exists) |

**Example wiring for `AllCoursesPage.tsx`:**

**Step 1 — Add service method** (`src/services/catalogue.services.ts`):

```typescript
// Add to courseApi object:
getStats: () =>
  apiClient.get<{ total: number; published: number; draft: number; archived: number }>(
    '/api/v1/catalogue/courses/stats/'
  ),
```

**Step 2 — Add hook** (`src/hooks/useCatalogue.ts`):

```typescript
export const useCourseStats = () =>
  useQuery({
    queryKey: ['courses', 'stats'] as const,
    queryFn: () => courseApi.getStats().then(r => r.data),
  });
```

**Step 3 — Wire page** (`src/pages/superadmin/AllCoursesPage.tsx`):

Find the hardcoded KPI object and replace:
```typescript
import { useCourseStats, useCourses } from '../../hooks/useCatalogue';

const { data: stats, isLoading: statsLoading } = useCourseStats();
const { data: coursesData, isLoading: coursesLoading } = useCourses(tableParams);

// KPI cards:
const kpis = [
  { label: 'Total Courses', value: stats?.total ?? 0 },
  { label: 'Published', value: stats?.published ?? 0 },
  { label: 'Draft', value: stats?.draft ?? 0 },
  { label: 'Archived', value: stats?.archived ?? 0 },
];

// Table:
const courses = coursesData?.results ?? [];
```

**Repeat this pattern for each superadmin page.** The table data usually comes from existing list endpoints (`courseApi.getAll()`, `usersApi.getAll()`, `invoiceApi.getAll()`), and only the KPI stats need new endpoints.

**For `InstructorsPage.tsx`:**

`usersApi.getInstructorStats()` already exists (`users.services.ts:85`). It returns `Promise<InstructorStats>` with `{ total, active, avg_rating, total_courses }`. Just call it:

```typescript
import { usersApi, InstructorStats } from '../../services/users.services';

const { data: stats } = useQuery({
  queryKey: ['instructors', 'stats'],
  queryFn: () => usersApi.getInstructorStats(),
});
```

For the instructors table, use:
```typescript
const { data: instructorsData } = useQuery({
  queryKey: ['users', { role: 'instructor' }],
  queryFn: () => usersApi.getInstructors({ role: 'instructor' }).then(r => r.data),
});
```

---

### Task F4: Pesapal Subscription Checkout ✅ DONE (3 Apr)

**Files changed:**
- `src/pages/learner/CheckoutPaymentPage.tsx` — major refactor; now initiates Pesapal hosted checkout via `usePesapalInitiateSubscription()`. Redirects user to `response.redirect_url`. Hardcoded `setTimeout` simulation removed entirely.
- `src/pages/learner/PesapalReturnPage.tsx` — **new file**. Handles the return from Pesapal at `/payments/success`, `/payments/failed`, `/payments/pending`. Reads `pesapal_checkout_context` from localStorage, polls payment status via `usePesapalPaymentStatus()`, refreshes subscription truth via `useMySubscription()`.
- `src/services/payments.services.ts` — added `pesapalApi` with `initiate()`, `initiateRecurring()`, and `getStatus()`. Added typed request/response interfaces: `PesapalInitiateRequest`, `PesapalInitiateResponse`, `PesapalRecurringInitiateRequest`, `PesapalRecurringInitiateResponse`, `PesapalPaymentStatusResponse`.
- `src/hooks/usePayments.ts` — added `usePesapalInitiatePayment()`, `usePesapalInitiateSubscription()`, `usePesapalPaymentStatus()` hooks.
- `src/routes/router.tsx` — added routes for `/payments/success`, `/payments/failed`, `/payments/pending` all pointing to `PesapalReturnPage`.

**Backend dependency:** Task 60 ✅ DONE — `apps/payments/views_pesapal.py` ships initiate + recurring initiate + status endpoints. Migration `0005_subscription_duration_days` adds `duration_days` to `Subscription` model.

**Endpoints wired:**
- `POST /api/v1/payments/pesapal/initiate/` → one-time payment initiation
- `POST /api/v1/payments/pesapal/recurring/initiate/` → subscription initiation
- `GET /api/v1/payments/pesapal/{payment_id}/status/` → payment status polling

**Checkout context flow:**
1. User clicks Pay → `pesapalInitiate.mutateAsync({ subscription_id, currency })` called
2. Response `redirect_url` stored context `{ paymentId, subscriptionId, planName }` in `localStorage('pesapal_checkout_context')`
3. `window.location.assign(redirect_url)` sends user to Pesapal hosted page
4. Pesapal redirects back to `/payments/success|failed|pending?tracking_id=...`
5. `PesapalReturnPage` reads context, invalidates subscription cache, shows result + CTA

**Known remaining gaps:**
- Billing info fields (first name, last name, email collected in form) are NOT yet sent to Pesapal — they are UI-only for now pending backend support
- No IPN/webhook handling on frontend (backend handles webhook notifications)

---

### Task F4b: `duration_days` on Subscription — Update Type (minor)

**File:** `src/types/types.ts` — `Subscription` interface

**Backend migration `0005_subscription_duration_days`** added a `duration_days: int` field to the `Subscription` model. The frontend `Subscription` type should be updated:

```typescript
export interface Subscription {
  // ... existing fields ...
  duration_days?: number;  // Added by backend migration 0005 (Apr 2026)
}
```

This allows the frontend to show exact subscription duration without computing from `billing_cycle` string.

### Task F5: ~~Promo Code Validation~~ — REMOVED FROM SCOPE

**Files:**
- `src/pages/learner/CheckoutPaymentPage.tsx` — hardcoded "SAVE20" acceptance
- `src/pages/learner/SubscriptionManagementPage.tsx` — same

**Backend dependency:** Task 61 (PromoCode model + verify endpoint)

**Step 1 — Add service** (`src/services/public.services.ts`):

```typescript
export interface PromoCodeVerifyResponse {
  valid: boolean;
  code?: string;
  discount_percent?: number;
  discount_amount?: string;
  error?: string;
}

export const promoCodeApi = {
  verify: (code: string, courseId?: number) =>
    apiClient.get<PromoCodeVerifyResponse>('/api/v1/public/promo-codes/verify/', {
      params: { code, course: courseId },
    }),
};
```

**Step 2 — Wire in `CheckoutPaymentPage.tsx`:**

Find the promo code input handler (where it checks `code === 'SAVE20'`) and replace:

```typescript
const handleApplyPromo = async () => {
  try {
    const { data } = await promoCodeApi.verify(promoCode, courseId);
    if (data.valid) {
      setDiscount(data.discount_percent || 0);
      setDiscountAmount(data.discount_amount || '0');
      showToast('Promo code applied!', 'success');
    } else {
      showToast(data.error || 'Invalid promo code', 'error');
    }
  } catch {
    showToast('Invalid promo code', 'error');
  }
};
```

---

## MEDIUM PRIORITY

---

### Task F6: Learner Progress Page — Full Overhaul

**File:** `src/pages/learner/ProgressPage.tsx`

**Problem:** 0% backend integration. All stats, course progress lists, milestones are hardcoded.

**APIs that already exist for this:**
- `enrollmentApi.getAll()` → `useEnrollments()` — user's enrollments with `progress_percentage`, `status`
- `sessionProgressApi.getAll({ enrollment })` → `useSessionProgressList()` — per-session completion
- `analyticsApi.getLearningStats()` → from `learning.services.ts:303`

**Do this:**

```typescript
import { useEnrollments } from '../../hooks/useLearning';
import { useLearningStats } from '../../services/learning.services';

const ProgressPage = () => {
  const { data: enrollmentsData, isLoading } = useEnrollments();
  const enrollments = enrollmentsData?.results ?? [];
  const { data: stats } = useLearningStats(); // returns LearningStats

  // Compute from real data:
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const activeCourses = enrollments.filter(e => e.status === 'active').length;
  const avgProgress = enrollments.reduce((sum, e) => sum + e.progress_percentage, 0)
    / (enrollments.length || 1);

  // For per-course progress cards, map enrollments:
  const courseProgress = enrollments.map(e => ({
    courseTitle: e.course_title,
    thumbnail: e.course_thumbnail,
    progress: e.progress_percentage,
    status: e.status,
    lastAccessed: e.last_accessed_at,
  }));
};
```

**Enrollment interface fields available** (from `types.ts`):
- `progress_percentage: number`
- `status: EnrollmentStatus` (active, completed, dropped, expired)
- `course_title: string`
- `course_thumbnail: string`
- `last_accessed_at: string`
- `time_remaining_days: number`
- `certificate_issued: boolean`

---

### Task F7: Instructor Grading Page — Wire to Submissions API

**File:** `src/pages/instructor/GradingPage.tsx`

**Problem:** Uses `sampleSubmissions: SubmissionData[] = [...]` (line 25) and `sampleFiles: FileData[] = [...]` (line 73).

**APIs that already exist:**
- `submissionApi.getAll()` → `useSubmissions()` hook (`src/hooks/useSubmissions.ts:16`)
- `submissionApi.grade(id, data)` → `useGradeSubmission()` hook (`src/hooks/useSubmissions.ts:66`)

**Do this:**

```typescript
import { useSubmissions, useGradeSubmission } from '../../hooks/useSubmissions';

const GradingPage = () => {
  const { data: subsData, isLoading } = useSubmissions({
    status: 'submitted',  // Only show ungraded submissions
  });
  const submissions = subsData?.results ?? [];
  const gradeMutation = useGradeSubmission();

  const handleGrade = (submissionId: number, grade: number, feedback: string) => {
    gradeMutation.mutate(
      { id: submissionId, data: { grade, feedback } },
      {
        onSuccess: () => showToast('Graded successfully', 'success'),
      }
    );
  };
};
```

**Submission interface fields** (from `types.ts`):
- `id`, `assignment_title`, `session_title`, `user_name`, `user_email`
- `status: SubmissionStatus` (draft, submitted, graded, pending_review, rejected)
- `submitted_file_url`, `submitted_file_name`, `submitted_text`
- `grade`, `feedback`, `graded_at`, `graded_by_name`

Delete `sampleSubmissions` and `sampleFiles` arrays entirely.

---

### Task F8: Manager Settings — Wire to Backend

**File:** `src/pages/manager/ManagerSettingsPage.tsx`

**Problem:** Entire page is a static mock. No backend persistence.

**Backend dependency:** Task 43 (`GET/PUT /api/v1/manager/settings/`)

**Step 1 — Add service** (`src/services/organization.services.ts` or new file):

```typescript
export interface ManagerSettings {
  org_name: string;
  description: string;
  logo: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string;
  city: string;
  country: string;
}

export const managerSettingsApi = {
  get: () => apiClient.get<ManagerSettings>('/api/v1/manager/settings/'),
  update: (data: Partial<ManagerSettings>) =>
    apiClient.put<ManagerSettings>('/api/v1/manager/settings/', data),
};
```

**Step 2 — Wire page:**

```typescript
const { data: settings, isLoading } = useQuery({
  queryKey: ['manager', 'settings'],
  queryFn: () => managerSettingsApi.get().then(r => r.data),
});

const updateMutation = useMutation({
  mutationFn: (data: Partial<ManagerSettings>) =>
    managerSettingsApi.update(data).then(r => r.data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['manager', 'settings'] });
    showToast('Settings saved', 'success');
  },
});
```

---

### Task F9: Manager Billing — Wire Real Data

**File:** `src/pages/manager/ManagerBillingPage.tsx`

**Problem:** Plan info, usage stats, and payment method are mocked. Invoice table may be wired.

**Backend dependency:** Task 44 (`GET /api/v1/manager/billing/plan/` and `/usage/`)

**Step 1 — Add services:**

```typescript
export const managerBillingApi = {
  getPlan: () => apiClient.get('/api/v1/manager/billing/plan/'),
  getUsage: () => apiClient.get('/api/v1/manager/billing/usage/'),
};
```

**Step 2 — Wire page sections:**

```typescript
const { data: plan } = useQuery({
  queryKey: ['manager', 'billing', 'plan'],
  queryFn: () => managerBillingApi.getPlan().then(r => r.data),
});

const { data: usage } = useQuery({
  queryKey: ['manager', 'billing', 'usage'],
  queryFn: () => managerBillingApi.getUsage().then(r => r.data),
});
```

Replace hardcoded "Enterprise $499/mo" with `plan?.plan_name` and `plan?.price`.
Replace hardcoded "347 users" with `usage?.active_users`.

---

### Task F10: Course Review Interactions

**File:** `src/components/course/CourseReviews.tsx` (or similar in `components/learner/`)

**Problem:** "Helpful" and "Report" buttons are non-functional. Star filter dropdown is ignored.

**Backend dependency:** Task 62 (review `helpful` and `report` actions, `rating` filter)

**Step 1 — Add service methods** (`src/services/catalogue.services.ts`):

```typescript
// Add to courseReviewApi:
helpful: (reviewId: number) =>
  apiClient.post(`/api/v1/catalogue/reviews/${reviewId}/helpful/`),

report: (reviewId: number) =>
  apiClient.post(`/api/v1/catalogue/reviews/${reviewId}/report/`),
```

**Step 2 — Wire buttons:**

```typescript
const handleHelpful = async (reviewId: number) => {
  await courseReviewApi.helpful(reviewId);
  showToast('Marked as helpful', 'success');
};

const handleReport = async (reviewId: number) => {
  await courseReviewApi.report(reviewId);
  showToast('Review reported', 'info');
};
```

**Step 3 — Wire rating filter:**

The `courseReviewApi.getAll()` already accepts `{ rating?: number }` param (line 370). Just pass it:

```typescript
const [ratingFilter, setRatingFilter] = useState<number | undefined>();
const { data: reviewsData } = useQuery({
  queryKey: ['course-reviews', courseId, ratingFilter],
  queryFn: () => courseReviewApi.getAll({ course: courseId, rating: ratingFilter }).then(r => r.data),
});
```

---

### Task F11: Manager Dashboard — TopCourses Widget

**File:** `src/pages/manager/ManagerDashboard.tsx` (or a `TopCourses` component)

**Problem:** Fetches first 4 courses in default order instead of most-enrolled.

**Backend dependency:** Task 30 (add `OrderingFilter` to `CourseViewSet`)

**Once backend is ready, change the query:**

```typescript
const { data: topCoursesData } = useCourses({
  ordering: '-enrollment_count',
  page_size: 4,
});
```

**Note:** The `CourseListParams` interface already has no `ordering` field. Add it:

```typescript
// In catalogue.services.ts, CourseListParams:
export interface CourseListParams {
  // ...existing fields...
  ordering?: string;
}
```

---

### Task F12: Public Catalog — Sort Dropdown

**File:** `src/pages/public/CourseCataloguePage.tsx`

**Problem:** Sort dropdown exists but `publicCourseApi` doesn't pass `ordering` param.

**Backend status:** `PublicCourseViewSet` already has `OrderingFilter` configured.

**Fix:** The `PublicCourseParams` interface (`public.services.ts:52`) doesn't include `ordering`. Add it:

```typescript
export interface PublicCourseParams {
  // ...existing...
  ordering?: string;  // e.g., '-published_at', 'title', '-enrollment_count'
}
```

Then in the page, wire the dropdown:

```typescript
const [sortBy, setSortBy] = useState('-published_at');
const { data } = usePublicCourses({ ...filters, ordering: sortBy });
```

---

## LOW PRIORITY

---

### Task F13: Business Page Components

**Files:**
- `src/components/business/PricingSection.tsx` — `businessPricingApi.getPlans()` exists but may not be wired
- `src/components/business/FaqSection.tsx` — `faqApi.getAll()` exists in `public.services.ts:149`

**Services exist** (`public.services.ts`):
```typescript
businessPricingApi.getPlans()  // line 133
faqApi.getAll()                // line 149
```

**Wire PricingSection:**
```typescript
const { data: plans } = useQuery({
  queryKey: ['business-plans'],
  queryFn: () => businessPricingApi.getPlans().then(r => r.data),
});
```

**Wire FaqSection:**
```typescript
const { data: faqs } = useQuery({
  queryKey: ['faqs'],
  queryFn: () => faqApi.getAll().then(r => r.data),
});
```

---

### Task F14: Invoice PDF Download & Email

**File:** `src/pages/learner/InvoiceReceiptPage.tsx`

**Problem:** "Download PDF" and "Email Invoice" buttons show mock toasts.

**Backend dependency:** Task 63 (invoice download-pdf and email-receipt endpoints)

**Wire:**
```typescript
const handleDownloadPDF = async () => {
  try {
    const response = await invoiceApi.getById(invoiceId); // or a dedicated download endpoint
    // Use window.print() with the A4 CSS template already in CertificatePrint.css
    window.print();
  } catch {
    showToast('Failed to download', 'error');
  }
};

const handleEmailReceipt = async () => {
  try {
    await apiClient.post(`/api/v1/payments/invoices/${invoiceId}/email-receipt/`);
    showToast('Receipt emailed successfully', 'success');
  } catch {
    showToast('Failed to send email', 'error');
  }
};
```

---

### Task F15: Payment History Exports

**File:** `src/pages/learner/PaymentHistoryPage.tsx`

**Problem:** "Export CSV" and "Download Statement" buttons are placeholders.

**Backend dependency:** Task 63 (transaction export-csv endpoint)

**Wire:**
```typescript
const handleExportCSV = async () => {
  try {
    const response = await apiClient.get('/api/v1/payments/transactions/export-csv/', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    showToast('Export failed', 'error');
  }
};
```

---

### Task F16: Subscription Management Actions

**File:** `src/pages/learner/SubscriptionManagementPage.tsx`

**Problem:** Cancel subscription, add payment method, set default — all show placeholder toasts.

**Hooks exist:**
- `useCancelUserSubscription()` (`usePayments.ts:307`)
- `useCreatePaymentMethod()` (`usePayments.ts:139`)
- `useSetDefaultPaymentMethod()` (`usePayments.ts:204`)

**Wire:**
```typescript
const cancelMutation = useCancelUserSubscription();
const createPaymentMutation = useCreatePaymentMethod();
const setDefaultMutation = useSetDefaultPaymentMethod();

const handleCancelSubscription = () => {
  cancelMutation.mutate(subscriptionId, {
    onSuccess: () => showToast('Subscription cancelled', 'info'),
  });
};
```

---

### Task F17: Security Page

**File:** `src/pages/superadmin/SecurityPage.tsx`

**Backend dependency:** Task 22 (security stats endpoint)

**Once backend ready, add service and wire:**

```typescript
export const securityApi = {
  getStats: () => apiClient.get('/api/v1/superadmin/security/stats/'),
};

// In the page:
const { data: stats } = useQuery({
  queryKey: ['security', 'stats'],
  queryFn: () => securityApi.getStats().then(r => r.data),
});
```

Replace hardcoded "42 active sessions" with `stats?.active_sessions`, etc.

---

### Task F18: Dashboard Mock Cleanup

**Miscellaneous remaining hardcoded values across dashboards:**

| Component | File | Hardcoded Value | Replace With |
|-----------|------|-----------------|--------------|
| Learner Dashboard "Learning Hours" | `LearnerDashboard.tsx` | Static number | Sum `time_spent_seconds` from `sessionProgressApi` |
| Instructor WelcomeBanner stats | `components/instructor/WelcomeBanner.tsx` | Hardcoded counts | `useLearningStats()` data |
| Manager KPIGrid | `ManagerDashboard.tsx` | Some KPIs mocked | `useLearningStats()` + `useCourseStats()` |
| Finance Sidebar revenue | `components/finance/Sidebar.tsx` | `$8,425` | `useRevenueTrends()` current month |
| Superadmin RevenueChart | `components/superadmin/RevenueChart.tsx` | Mock chart data | `useRevenueTrends()` once backend Task 37 done |
| Superadmin SystemHealth | `components/superadmin/SystemHealth.tsx` | Mock health data | `securityApi.getHealth()` once backend Task 38 done |

For each, the fix is the same pattern: import the hook, call it, replace the hardcoded const.

---

## Gateway Pages — Keep as Mock (No Backend Yet)

These finance gateway pages have no backend support and are acceptable as static displays for now:

- `GatewayMpesaPage.tsx` — hardcoded M-Pesa transactions and health
- `GatewayMtnPage.tsx` — hardcoded MTN transactions and health
- `GatewayAirtelPage.tsx` — hardcoded Airtel transactions and health
- `GatewayPesapalPage.tsx` — hardcoded Pesapal transactions and health

**Action:** Add `{/* TODO: Wire to gateway health API when available */}` comment at top of each file.

---

## Pages That Need NO Frontend Work (Backend Only)

These pages are blocked purely on backend. Once the backend task is completed, the frontend wiring is trivial (1-2 line hook call):

| Page | Route | Blocked By Backend Task |
|------|-------|------------------------|
| `SuperadminNotificationsPage` | `/superadmin/notifications` | ❌ Not blocked — existing `notificationApi` works |
| `ManagerActivityPage` | `/manager/activity` | Task 45 (audit log summary — optional) |
| `ManagerRolesPage` | `/manager/roles` | Task 40 (user counts by role) |
| `PartnershipsPage` | `/superadmin/partnerships` | Task 41 (Phase 2) |
| `DataMigrationPage` | `/superadmin/data-migration` | Task 42 (Phase 2) |
| `GatewaySettingsPage` | `/superadmin/gateway-settings` | Task 42 (Phase 2) |
| `SystemSettingsPage` | `/superadmin/settings` | Task 38 (system settings CRUD) |
| `IntegrationsPage` | `/superadmin/integrations` | Task 41 (Phase 2) |

---

## Completed Items Archive

<details>
<summary>Click to expand — all completed items</summary>

| 28 Mar | Phase 5: Learner Submission Player (Quiz/Assignment) wired to `SessionViewSet.submit` |
| 28 Mar | Backend Task 6 implemented (Session quiz/assignment POST & Learner Submit) |
| 27 Mar | F1: SavedCoursesPage wired to `savedCourseApi` + `useSavedCourses`/`useToggleSavedCourse` hooks |
| 27 Mar | F3: Superadmin KPIs wired — AllCourses, Assessments, Certifications, Instructors, Invoices, Revenue |
| 27 Mar | Backend Tasks 29, 30, 32-37 all implemented (SavedCourse model + 6 stats endpoints) |
|------|------|
| 27 Mar | ManagerMessagesPage & LearnerMessagesPage wired to `messagingApi` |
| 27 Mar | ManagerBulkEnrollPage wired to `enrollmentApi.bulkEnroll()` |
| 27 Mar | CoursePlayerPage Resources tab wired to `sessionAttachmentApi` |
| 27 Mar | LearnerCertificatesPage mock data removed — uses auto-created certificates |
| 26 Mar | Manager/Instructor Analytics charts wired to analytics hooks |
| 26 Mar | Finance RevenueChart wired to `useRevenueTrends` |
| 26 Mar | Bulk Import CSV format mismatch fixed |
| 26 Mar | CoursePlayerPage Q&A Pin/Lock wired |
| 26 Mar | LearnerAssignmentsPage validation errors wired |
| 25 Mar | InstructorMessagesPage wired to messaging API |
| 18 Mar | CoursePlayerPage Q&A, WorkshopsPage, LearnersPage, CoursePreviewPage wired |
| 18 Mar | LearnerCourseDetailPage, ManagerRecordingsPage, ManagerScheduleNewPage wired |
| 18 Mar | SuperadminPaymentsPage, FinanceAnalyticsPage, CourseReviews wired |
| 17 Mar | Course publish flow, Learner assignments, Bulk import drag-drop |
| 16 Mar | Drag-and-drop reordering, Quiz player, Video resume, QuizzesPage |
| 16 Mar | NotificationsPage, Notes tab persistence |
| 15 Mar | Certificate/invoice download |
| 14 Mar | Privacy policy + certificate validation pages |
| 13 Mar | Initial manager pages wiring |
| — | Landing Categories wired to `publicCategoryApi` |
| — | Landing Featured Courses wired to `publicCourseApi` |
| — | Landing Pricing wired to `publicSubscriptionPlansApi` |
| — | Landing StatsBanner wired to `publicStatsApi` |
| — | TrustedBy wired to `publicClientsApi` |
| — | All auth pages (Login, Register, MFA, Email Verify, Password Reset) fully wired |
| — | CoursePlayerPage (Video, Documents, Quizzes, Notes, Q&A, Progress) fully wired |
| — | QuestionBankPage fully wired |
| — | AssignmentsHubPage fully wired |
| — | GradebookPage wired to `submissionApi` + `gradeStatisticsApi` |
| — | ContentUploadPage StorageInfoCard wired to `quotaApi` |
| — | ManagerCategoriesPage CRUD functional |
| — | CourseApprovalPage + Detail functional |
| — | ManagerReportsPage wired to `reportsApi` |
| — | FinanceExportPage wired to `reportsApi` |
| — | FinanceProfilePage wired |
| — | SuperadminProfilePage wired |
| — | InviteUserPage wired |
| — | CertificateValidationPage wired to `certificateApi.verify` |

</details>

---

## Backend Dependencies Summary

| Frontend Need | Backend Status | Endpoint | Backend Task |
|--------------|----------------|----------|-------------|
| Saved Courses API | ✅ Working | `/api/v1/learning/saved-courses/` | 29 |
| Course ordering | ✅ Working | `?ordering=-enrollment_count` on CourseViewSet | 30 |
| Org user/course count | ❌ Missing | annotations on OrganizationSerializer | 31 |
| Quiz/Assignment POST | ✅ Working | POST on `/api/v1/catalogue/sessions/{id}/quiz/` | 6 |
| Learner Submit | ✅ Working | POST on `/api/v1/catalogue/sessions/{id}/submit/` | 6 |
| Course stats | ✅ Working | `/api/v1/catalogue/courses/stats/` | 32 |
| Assessment stats | ✅ Working | `/api/v1/learning/submissions/stats/` | 33 |
| Certificate stats (admin) | ✅ Working | `/api/v1/learning/certificates/stats/` | 34 |
| Instructor stats | ✅ Working | `/api/v1/superadmin/users/instructor-stats/` | 35 |
| Invoice stats | ✅ Working | `/api/v1/payments/invoices/stats/` | 36 |
| Revenue breakdown | ✅ Working | `/api/v1/payments/transactions/revenue-stats/` | 37 |
| Mobile money charge | ❌ Missing | `/api/v1/payments/pesapal/initiate/` | 60 |
| ~~Promo code verify~~ | Removed | — | — |
| Review helpful/report | ❌ Missing | `/api/v1/catalogue/reviews/{id}/helpful/` | 62 |
| Transaction export CSV | ❌ Missing | `/api/v1/payments/transactions/export-csv/` | 63 |
| Manager settings | ❌ Missing | `/api/v1/manager/settings/` | 43 |
| Manager billing | ❌ Missing | `/api/v1/manager/billing/plan/` | 44 |
| Security stats | ❌ Missing | `/api/v1/superadmin/security/stats/` | 22 |
| System health | ❌ Missing | `/api/v1/superadmin/system/health/` | 38 |
| Public Stats | ✅ Working | `/api/v1/public/stats/` | — |
| Trusted Clients | ⚠️ Stubbed | `/api/v1/public/clients/` | — |
| Storage Quota | ✅ Working | `/api/v1/uploads/quota/` | — |
| Enrollment Trends | ✅ Working | `/api/v1/learning/analytics/enrollment-trends/` | — |
| Learning Stats | ✅ Working | `/api/v1/learning/analytics/learning-stats/` | — |
| Revenue Trends | ✅ Working | `/api/v1/payments/analytics/revenue/` | — |
| Courses by Category | ✅ Working | `/api/v1/catalogue/analytics/courses-by-category/` | — |
| Reports | ✅ Working | `/api/v1/learning/reports/` | — |
| Bulk Enrollment | ✅ Working | `/api/v1/learning/enrollments/bulk/` | — |
| Session Attachments | ✅ Working | `/api/v1/catalogue/session-attachments/` | — |
| Messaging | ✅ Working | `/api/v1/messaging/` | — |
| Badges | ✅ Working | `/api/v1/learning/badges/` | — |

---

## LOW PRIORITY — Code Quality & Infrastructure (from audit 1 Apr 2026)

### Task F36: Fix `VITE_API_URL` Inconsistency

**Problem:** `src/services/superadmin.services.ts` references `import.meta.env.VITE_API_URL` which is not declared in `.env.example` and not used anywhere else. The rest of the codebase uses `VITE_API_BASE_URL` (declared in `src/utils/config.ts`). If `VITE_API_URL` is unset it silently falls back to empty string, breaking superadmin API calls.

**Fix:**
1. In `src/services/superadmin.services.ts` — replace `import.meta.env.VITE_API_URL` with `import.meta.env.VITE_API_BASE_URL`
2. In `.env.example` — verify `VITE_API_BASE_URL` entry exists (it does); no new entry needed

---

### Task F37: Deduplicate `DEV_BYPASS_AUTH` Constant

**Problem:** `const DEV_BYPASS_AUTH = import.meta.env.VITE_AUTH_BYPASS === 'true' && import.meta.env.DEV;` is copy-pasted into 7 files:
- `src/utils/config.ts`
- `src/components/ProtectedRoute.tsx`
- `src/routes/loaders/learnerLoaders.ts`
- `src/routes/loaders/sharedLoaders.ts`
- `src/routes/loaders/instructorLoaders.ts`
- `src/routes/loaders/financeLoaders.ts`
- `src/routes/loaders/managerLoaders.ts`
- `src/routes/loaders/superadminLoaders.ts`

**Fix:**
1. In `src/utils/config.ts` — export the constant: `export const DEV_BYPASS_AUTH = ...`
2. In all other 6 files — remove the local declaration and import: `import { DEV_BYPASS_AUTH } from '../utils/config';` (adjust relative path per file)

**Note:** No behavioral change — purely a DRY refactor. Security posture unchanged (still gated by `import.meta.env.DEV`).

---

### Task F38: Add Automated Test Suite (Vitest + React Testing Library)

**Problem:** The codebase has zero automated tests. 421 files, 5 user roles, auth flows, and payment integrations — all untested at runtime.

**Setup:**
```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add to `vite.config.ts`:
```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts',
}
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

**Baseline tests to write first (highest value):**
1. `src/components/ProtectedRoute.test.tsx` — verify each role is granted/denied correct routes; verify `DEV_BYPASS_AUTH` behavior
2. `src/hooks/useAuthQueries.test.ts` — mock `authApi`, verify login mutation calls correct endpoint, stores tokens
3. `src/utils/config.test.ts` — verify Axios interceptor attaches Bearer token, verify 401 triggers refresh

**Do NOT** add tests for pure MUI display components — TypeScript already catches most prop/type errors at compile time.

---

### Task F39: Split `router.tsx` by Role (Trigger: file exceeds ~1000 lines)

**Current state:** `src/routes/router.tsx` is 916 lines (as of 1 Apr 2026). Not urgent yet.

**When to act:** If route count grows and file crosses ~1000 lines.

**Plan:**
1. Create `src/routes/learnerRoutes.tsx`, `instructorRoutes.tsx`, `managerRoutes.tsx`, `financeRoutes.tsx`, `superadminRoutes.tsx`
2. Each file exports a function `(queryClient: QueryClient) => RouteObject[]` containing that role's routes
3. In `router.tsx`, import and spread each: `...learnerRoutes(queryClient), ...instructorRoutes(queryClient)`
4. Keep public routes and the top-level router structure in `router.tsx`

**No behavioral change** — pure structural refactor.

---

## HIGH PRIORITY — Senior Dev Directives (1 Apr 2026)

### Task F40: Review Moderation — Superadmin Approve/Reject Queue

**Context:** Reviews are currently submitted with an `is_approved` flag already in the `CourseReview` type, and the learner submission already shows "pending approval" messaging. The missing piece is the superadmin UI to action them, and ensuring course-side display filters to approved-only.

**Backend dependency:** Task 73 — add `GET /api/v1/superadmin/reviews/` (filterable by `status=pending|approved|rejected`), `POST /api/v1/superadmin/reviews/{id}/approve/`, `POST /api/v1/superadmin/reviews/{id}/reject/`. Also add `is_featured` boolean field to `CourseReview` model for Task F41.

**Step 1 — New superadmin service methods** (`src/services/superadmin.services.ts`):
```typescript
export const superadminReviewApi = {
  getAll: (params?: { status?: 'pending' | 'approved' | 'rejected'; page?: number }) =>
    apiClient.get<PaginatedResponse<CourseReview>>('/api/v1/superadmin/reviews/', { params }),
  approve: (id: number) =>
    apiClient.post(`/api/v1/superadmin/reviews/${id}/approve/`),
  reject: (id: number) =>
    apiClient.post(`/api/v1/superadmin/reviews/${id}/reject/`),
  feature: (id: number, featured: boolean) =>
    apiClient.patch(`/api/v1/superadmin/reviews/${id}/`, { is_featured: featured }),
};
```
Export from `src/services/main.api.ts` under `api.admin.reviews`.

**Step 2 — Query key** (`src/hooks/queryKeys.ts`):
```typescript
superadminReviews: {
  all: (params?: object) => ['superadmin-reviews', 'list', params ?? {}] as const,
},
```

**Step 3 — Hook** (`src/hooks/useSuperadmin.ts`, add):
```typescript
export const useSuperadminReviews = (params?: { status?: string; page?: number }) =>
  useQuery({ queryKey: queryKeys.superadminReviews.all(params), queryFn: () => superadminReviewApi.getAll(params).then(r => r.data) });

export const useApproveReview = () => useMutation({
  mutationFn: (id: number) => superadminReviewApi.approve(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.superadminReviews.all() }),
});

export const useRejectReview = () => useMutation({
  mutationFn: (id: number) => superadminReviewApi.reject(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.superadminReviews.all() }),
});

export const useFeatureReview = () => useMutation({
  mutationFn: ({ id, featured }: { id: number; featured: boolean }) => superadminReviewApi.feature(id, featured),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.superadminReviews.all() }),
});
```

**Step 4 — New superadmin page** `src/pages/superadmin/SuperadminReviewsPage.tsx`:
- Tabs: **Pending** | **Approved** | **Rejected**
- Each tab shows a table/list: reviewer name, course name, rating (stars), review text (truncated), date submitted
- Pending tab: Approve button (green) + Reject button (red) per row
- Approved tab: Reject button + "Feature as Testimonial" toggle (star icon) per row — feature toggle calls `useFeatureReview`
- Rejected tab: Re-approve button per row
- Add route to `router.tsx` under superadmin group: `path: 'reviews'` → `<SuperadminReviewsPage />`
- Add nav link in superadmin sidebar

**Step 5 — Filter course-side display to approved only**:
- `src/components/course/CourseReviews.tsx` and `src/components/learner/course/CourseReviews.tsx` — verify `courseReviewApi.getAll` already passes `is_approved=true` or that the backend endpoint filters by default. If not, add `{ is_approved: true }` to the params in the `useQuery` call for public-facing review lists.
- The review submission success message ("pending approval") is already correct — keep it.

---

### Task F41: Testimonials — Pull Superadmin-Featured Reviews from API

**Context:** Both `Testimonials.tsx` (landing page) and `TestimonialsSection.tsx` (for-business page) use hardcoded arrays. Reviews marked `is_featured: true` by the superadmin (via Task F40) should populate these sections.

**Backend dependency:** Task 73 — add `GET /api/v1/public/testimonials/` returning featured reviews. Response shape should match or be mappable to the current testimonial card data (name, role/company, avatar/initials, text).

**Step 1 — Public service method** (`src/services/public.services.ts`):
```typescript
export const publicTestimonialApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<CourseReview>>('/api/v1/public/testimonials/'),
};
```
Export from `src/services/main.api.ts` under `api.public.testimonial`.

**Step 2 — Hook** (`src/hooks/usePublic.ts`, add):
```typescript
export const useTestimonials = () =>
  useQuery({
    queryKey: ['testimonials'],
    queryFn: () => publicTestimonialApi.getAll().then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
```

**Step 3 — Update `src/components/landing/Testimonials.tsx`**:
- Replace hardcoded `testimonials` array with `const { data } = useTestimonials()`
- Map `data?.results ?? []` — derive display fields from `CourseReview`:
  - `name` → reviewer's `user_name`
  - `role` → course title (e.g., "Learner — {course_title}")
  - `initials` → first two letters of `user_name`
  - `avatar` → reviewer avatar URL if available, else initials fallback
  - `text` → review `content`
- Keep the current card layout; just swap the data source
- Show a loading skeleton (3 placeholder cards) while fetching
- If API returns empty, fall back to existing hardcoded array so the landing page never looks bare

**Step 4 — Update `src/components/business/TestimonialsSection.tsx`**:
- Same changes as Step 3; the `company` field can be omitted or left blank if not in the API response

---

### Task F42: Certificate Verification — Inline Modal on Landing + Branded Results Page

**Context:** `CertificateValidationPage.tsx` is currently a standalone full page at `/certificate/validate`. The landing page should let users verify without leaving — via a modal. On success, navigate to a well-branded results page (redesigned `CertificateValidationPage.tsx`).

**API already exists:** `GET /api/v1/learning/certificates/verify/?certificate_number={n}` returns the `Certificate` type. No backend changes needed.

**Step 1 — New modal component** `src/components/landing/CertificateVerifyModal.tsx`:
- Triggered by a "Verify Certificate" button/link already present on the landing page (find and wire it)
- Modal contains: TASC logo, heading "Verify Certificate", single text input "Certificate Number", Submit button
- On submit: calls `certificateApi.verify(certificateNumber)` from `src/services/learning.services.ts`
- On success: close modal, navigate to `/certificate/result?cert={certificateNumber}` using `useNavigate`
- On failure (not found / invalid): show inline error inside the modal — "Certificate not found. Please check the number and try again."
- Loading state: disable button + show spinner on input row

**Step 2 — New branded results page** `src/pages/public/CertificateResultPage.tsx`:
- Route: `/certificate/result` (add to public routes in `router.tsx`, no auth required)
- Reads `?cert=` query param on mount, calls `certificateApi.verify()` automatically
- **Branded layout:**
  - Full-page centered layout with TASC logo at top
  - Large green checkmark icon (or red X for invalid/expired)
  - Certificate number displayed prominently
  - Details card: Holder Name, Course Title, Date Awarded, Expiry Date (if set)
  - "This certificate was issued by TASC Learning Management System" footer line
  - Download PDF button if `pdf_url` is present on the response
  - "Verify Another" button → reopens the modal (navigate back to `/` with a flag, or just link to `/`)
- For invalid/expired: red X, "This certificate is not valid" heading, brief explanation

**Step 3 — Wire modal into landing page**:
- In `src/pages/public/LandingPage.tsx` or whichever component holds the "Verify Certificate" CTA — import `CertificateVerifyModal`, add `open` state, wire the button to open the modal
- The existing `CertificateValidationPage.tsx` can remain as a direct-link fallback (keep route `/certificate/validate`); the new `/certificate/result` is for the branded display

---

### Task F43: Demo Form — Send to Superadmin via Backend

**Context:** `src/components/business/BusinessCtaSection.tsx` uses EmailJS with placeholder credentials (`YOUR_SERVICE_ID` etc.), so it is currently non-functional. The senior dev wants demo requests to go to the superadmin dashboard instead.

**Backend dependency:** Task 74 — `POST /api/v1/public/demo-requests/` (no auth, public endpoint) accepting `{ first_name, last_name, email, company, team_size, phone? }`. New `DemoRequest` model. Superadmin endpoint `GET /api/v1/superadmin/demo-requests/` with status management (new/contacted/closed).

**Step 1 — Public service method** (`src/services/public.services.ts`):
```typescript
export interface DemoRequestPayload {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  team_size: string;
  phone?: string;
}

export const demoRequestApi = {
  submit: (data: DemoRequestPayload) =>
    apiClient.post('/api/v1/public/demo-requests/', data),
};
```
Export from `src/services/main.api.ts` under `api.public.demoRequest`.

**Step 2 — Hook** (`src/hooks/usePublic.ts`, add):
```typescript
export const useSubmitDemoRequest = () => useMutation({
  mutationFn: (data: DemoRequestPayload) => demoRequestApi.submit(data),
});
```

**Step 3 — Update `src/components/business/BusinessCtaSection.tsx`**:
- Remove all EmailJS imports and the three `EMAILJS_*` constants (Lines 20-23)
- Replace the `emailjs.send(...)` call in the submit handler with `useSubmitDemoRequest().mutateAsync(payload)`
- Keep the existing form fields, success message, and error message — only swap the submission mechanism
- Error message: change generic text to "Failed to submit. Please try again or email us at admin@tasc.co.ug"

**Step 4 — New superadmin page** `src/pages/superadmin/SuperadminDemoRequestsPage.tsx`:
- Table columns: Name, Company, Email, Team Size, Phone, Date Submitted, Status
- Status dropdown per row: **New** | **Contacted** | **Closed** (calls `PATCH /api/v1/superadmin/demo-requests/{id}/`)
- Filter bar: status filter + date range
- Add route to `router.tsx` under superadmin group: `path: 'demo-requests'`
- Add nav link in superadmin sidebar

---

## MED PRIORITY — Course Detail Page Gaps (from audit 1 Apr 2026)

### Task F44: CourseCurriculum — Remove Hardcoded Fallback, Add Empty State

**Problem:** `src/components/course/CourseCurriculum.tsx` lines 14–50 define `defaultModules` — a hardcoded "Learn React" demo curriculum. Lines 63–89 render it whenever `sessions.length === 0`. Any real course with no sessions yet shows fake React content to visitors.

**Fix:**
1. Delete the `defaultModules` constant (lines 14–50)
2. Update the conditional at lines 63–89 — when `courseId` is set but sessions are empty, render an empty state:
   ```tsx
   <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
     <MenuBookIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
     <Typography variant="body2">Curriculum coming soon.</Typography>
   </Box>
   ```
3. When `courseId` is not provided (component used outside course detail context), keep current graceful handling
4. Keep the loading skeleton while `isLoading` is true

---

### Task F45: CourseObjectives — Remove Hardcoded Fallback, Hide Section When Empty

**Problem:** `src/components/course/CourseObjectives.tsx` lines 9–18 define `defaultObjectives` with demo bullet points. The component defaults to this array if the parent passes an empty `objectives` prop. Courses without a `learning_objectives_list` show fabricated learning goals.

**Fix:**
1. Delete the `defaultObjectives` constant (lines 9–18)
2. Change the prop default from `objectives = defaultObjectives` to `objectives = []`
3. In the render: if `objectives.length === 0`, return `null` — the section simply doesn't render rather than showing placeholder content
4. No empty state UI needed here — absence of objectives is a valid course state; the section should be invisible, not broken-looking

---

### Task F46: CourseInstructor — Wire Bio and Stats to Real API

**Problem:** `src/components/course/CourseInstructor.tsx` only receives the instructor's `name` prop. Lines 35–48 show hardcoded `"--"` for rating, reviews, students, and courses taught. Line 51–52 shows `"Instructor bio will appear here."`. Social links render but have no `href`.

**Backend dependency:** Task 75 — add `GET /api/v1/public/instructors/{userId}/` returning instructor public profile: `{ bio, rating, total_reviews, total_students, total_courses, social_links: { linkedin?, github?, twitter?, website? } }`. Alternatively extend the existing `PublicCourseDetail` response to embed the full instructor object instead of just `instructor_name`.

**Step 1 — New service method** (`src/services/public.services.ts`):
```typescript
export interface PublicInstructorProfile {
  id: number;
  name: string;
  bio: string;
  rating: number | null;
  total_reviews: number;
  total_students: number;
  total_courses: number;
  avatar_url?: string | null;
  social_links: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export const publicInstructorApi = {
  getById: (userId: number) =>
    apiClient.get<PublicInstructorProfile>(`/api/v1/public/instructors/${userId}/`),
};
```
Export from `src/services/main.api.ts` under `api.public.instructor`.

**Step 2 — Hook** (`src/hooks/usePublic.ts`, add):
```typescript
export const usePublicInstructor = (userId: number | undefined) =>
  useQuery({
    queryKey: ['public-instructor', userId],
    queryFn: () => publicInstructorApi.getById(userId!).then(r => r.data),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
```

**Step 3 — Update `CourseInstructor.tsx`**:
- Change props from `{ name: string }` to `{ instructorId: number; name: string }`
- Call `usePublicInstructor(instructorId)` inside the component
- Replace hardcoded `"--"` with real values from the profile response; show `"--"` only while loading
- Replace `"Instructor bio will appear here."` with `profile?.bio ?? ''`; hide the bio block entirely if `bio` is empty
- Wire social icon `href` attributes from `profile?.social_links`; hide icons with no URL

**Step 4 — Update `CourseLandingPage.tsx`**:
- Pass `instructorId={course.instructor_id}` (or whatever the field is on `PublicCourseDetail`) to `<CourseInstructor />`
- Verify `PublicCourseDetail` type in `src/types/types.ts` exposes `instructor_id` — add it if missing