# TASC LMS Frontend — Task Tracker

**Last updated:** 24 March 2026
**Repo:** `TASC-LMS-frontend`

---

## CRITICAL — Pages Using Hardcoded/Sample Data

### 2. Manager Analytics Page — Partially Done
- **File:** `src/pages/manager/ManagerAnalyticsPage.tsx`
- **Done:** KPIs and top courses wired to real API data.
- **Still pending:** Monthly enrollment chart and weekly engagement chart still use hardcoded placeholder data.
- **Backend dependency:** No dedicated analytics aggregation endpoints for time-series data.
- **Blocked?** Partially — charts need backend aggregation endpoints

### 3. Instructor Analytics Page — Partially Done
- **File:** `src/pages/instructor/InstructorAnalyticsPage.tsx`
- **Done:** KPIs wired (enrollments, completion rate, avg quiz scores, published courses). Course performance computed from real data.
- **Still pending:** Weekly engagement chart still uses `Math.random()` for fake hours.
- **Backend dependency:** No time-tracking/engagement aggregation endpoint.
- **Blocked?** Partially — engagement chart needs backend

### 4. Finance Analytics Page — Partially Done
- **File:** `src/pages/finance/FinanceAnalyticsPage.tsx`
- **Done:** KPIs, gateway breakdown, recent transactions, top courses by revenue — all wired to `transactionApi`, `invoiceApi`, `userSubscriptionApi`.
- **Still pending:** Course ratings use `Math.random()` (minor). Monthly revenue chart may still use placeholder data.
- **Backend dependency:** May need monthly revenue aggregation endpoint.
- **Blocked?** Partially

### 5. Superadmin Analytics Page
- **File:** `src/pages/superadmin/AnalyticsPage.tsx`
- **What's hardcoded:** `kpis[]`, `orgPerformance[]`, `topCourses[]`, `weeklyEngagement[]`, `contentTypes[]`, `categoryPerformance[]`, `assessmentMetrics[]`, `scoreDistribution[]` (lines 13-85)
- **What to do:** Aggregate platform-wide data across all organizations.
- **Backend dependency:** No cross-org analytics endpoints exist.
- **Blocked?** Yes — needs backend aggregation endpoints

### 8. Learner Certificates Page — Mock Fallback
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What's hardcoded:** `MOCK_CERTIFICATES[]` array. Falls back to mock data if API returns empty.
- **What to do:** Remove mock fallback once backend reliably returns certificate data with `pdf_url` populated.
- **Backend dependency:** Certificate API exists but `pdf_url` may not be populated (PDF generation logic incomplete on backend).
- **Blocked?** Partially — depends on backend PDF generation

### 10. CoursePlayerPage — Partially Done
- **File:** `src/pages/learner/CoursePlayerPage.tsx`
- **Done:** Q&A tab wired to `discussionApi.getAll()` and `discussionApi.create()`. Removed `sampleQuestions[]`.
- **Still pending:** Resources tab still uses `sampleResources[]` (no backend endpoint for session attachments). Discussion replies and upvoting not yet wired.

### 11. Instructor Messages Page
- **File:** `src/pages/InstructorMessagesPage.tsx`
- **What's hardcoded:** `conversations[]` array (6+ mock conversation objects)
- **What to do:** Wire to a messaging/inbox API if backend supports it, or mark as future feature.
- **Blocked?** Yes — no messaging API exists


### 20. Manager Bulk Enroll Page — Partially Done
- **File:** `src/pages/manager/ManagerBulkEnrollPage.tsx`
- **Done:** Course dropdown wired to `courseApi.getAll()`.
- **Still pending:** `mockHistory[]` remains (no bulk enrollment history API).

### 26. Superadmin Security Page
- **File:** `src/pages/superadmin/SecurityPage.tsx`
- **What's hardcoded:** `kpis[]` (4 security KPIs), `activeSessions[]` (8 mock sessions)
- **What to do:** Wire to real active sessions/audit data.
- **Blocked?** Partially — no dedicated security metrics endpoint

---

## CRITICAL — Public/Marketing Pages with Hardcoded Data

### 34. Business Page Pricing — Hardcoded Plans
- **File:** `src/components/business/PricingSection.tsx` (lines 20-76)
- **What's hardcoded:** 3 B2B pricing tiers (Team $15, Business $20, Enterprise $25) with feature lists
- **What to do:** Fetch from subscription plans API or a dedicated business pricing endpoint.
- **Blocked?** Partially — current subscription API is learner-focused

### 35a. Business Demo Form — EmailJS Credentials Needed
- **File:** `src/components/business/BusinessCtaSection.tsx` (lines 18-20)
- **What's done:** EmailJS integration code is wired up (`@emailjs/browser` installed, `emailjs.send()` replaces fake setTimeout).
- **Still pending:**
  1. Create an EmailJS account at https://dashboard.emailjs.com
  2. Add an email service (e.g. Gmail) and get the **Service ID**
  3. Create an email template with variables: `{{first_name}}`, `{{last_name}}`, `{{email}}`, `{{company}}`, `{{team_size}}`, `{{phone}}`
  4. Copy the **Public Key** from Account > General
  5. Replace the 3 placeholder constants in `BusinessCtaSection.tsx` (`YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, `YOUR_PUBLIC_KEY`)
  6. Optionally move the IDs to `.env` as `VITE_EMAILJS_*` variables
- **Blocked?** Yes — needs EmailJS account setup (free tier: 200 emails/month)

### 35. Business Page Stats — Fake Metrics
- **File:** `src/components/business/BusinessStatsSection.tsx` (lines 8-13)
- **What's hardcoded:** "500+ Enterprise Customers", "250K+ Learners", "89% Completion Rate", "4.8 Satisfaction"
- **What to do:** Fetch real metrics from `GET /api/v1/public/stats/` (partial — covers learners/courses but not enterprise-specific stats).
- **Blocked?** Partially — public stats covers some metrics, not all

### 37. Business Page FAQ — Static Content
- **File:** `src/components/business/FaqSection.tsx` (lines 6-31)
- **What's hardcoded:** 6 FAQ items
- **What to do:** Move to CMS or API for easy updates without code changes.
- **Blocked?** Low priority — acceptable as static for now

---

## HIGH — Service Layer Stubs & TODOs

### 43. Manager Bulk Import — Backend Blocked
- **File:** `src/pages/manager/ManagerBulkImportPage.tsx`
- **Issue:** Currently uses `/api/v1/superadmin/users/bulk_import/` which throws 403 Forbidden for LMS Managers.
- **What to do:** Wait for backend to implement `POST /api/v1/manager/users/bulk_import/` then update `manager.services.ts`.
- **Blocked?** Yes — backend dependency.

### 44. Missing Query Parameter Support — DONE
- **Done:** Backend filters implemented for all 3 viewsets. Frontend TODO comments removed, param names aligned (`from_date`/`to_date`).
  - `EnrollmentViewSet`: added `search` filter (name/email/course title)
  - `SessionProgressViewSet`: implemented `enrollment`, `session`, `course` filters
  - `InvoiceViewSet`: added `from_date`/`to_date` date range filters
  - `TransactionViewSet`: already had `from_date`/`to_date` (confirmed working)
  - `CourseViewSet`/`SessionViewSet`: already had all filters (confirmed working)

---

## MEDIUM — Incomplete UI Features


### 50. Learner Certificates — Real Data
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What to do:** Remove `MOCK_CERTIFICATES` fallback, ensure download button works with real `pdf_url`.
- **Blocked?** Partially — backend PDF generation unclear

### 57. Landing Testimonials — Hardcoded
- **File:** `src/components/landing/Testimonials.tsx`
- **What's hardcoded:** 3 testimonial objects (names, roles, quotes)
- **What to do:** Fetch from testimonials API or CMS, or accept as static marketing content.
- **Blocked?** Yes — no testimonials API

### 58. Business Testimonials — Hardcoded
- **File:** `src/components/business/TestimonialsSection.tsx`
- **What's hardcoded:** 3 testimonial objects (names, roles, quotes)
- **Blocked?** Yes — no testimonials API


---

## LOW — Polish & Cleanup

### 51. Instructor Placeholder Page
- **File:** `src/pages/InstructorPlaceholderPage.tsx`
- **Issue:** Generic "under development" page used for incomplete features.
- **What to do:** Replace all references with actual implementations as features complete.

### 52. Console.log Cleanup — Toast Placeholders Remain
- **Toast notifications (temporary — replace with real functionality):**
  - `GradingPage` → `handleSaveDraft`: wire to submission grade API (`submissionApi`)
  - `GradingPage` → file `onView`/`onDownload`: wire to actual file URLs from submission data
  - `LearnerCourseDetailPage` → `onWriteReview`: open review submission form (backend `CourseReview` API exists at `/api/v1/catalogue/courses/{id}/reviews/`)
  - `LearnerCourseDetailPage` → `onViewProfile`: navigate to instructor profile page (page does not exist yet)
  - `LearnerCourseCatalogPage` → `handleInstructorProfile`: navigate to instructor profile page (page does not exist yet)
  - `GradebookPage` → `onExport`: wire to async report generation or client-side CSV export
  - `CoursePreviewPage` → `onEnroll`/`onAddToCart`/`handlePublish`: preview-only context, may stay as informational toasts

### 54. Type Safety — 1 Remaining
- **Remaining:** `CoursePlayerPage:385` — `ReactPlayer as any` is a React 19 compat workaround, left as-is with `@ts-ignore`

---

## Completed

| # | Item | Date | Commit |
|---|------|------|--------|
| 1 | GradebookPage: replaced all sample data with `submissionApi.getAll()` | 18 Mar 2026 | — |
| 2 | ManagerAnalyticsPage: KPIs/top courses wired (charts still need backend) | 18 Mar 2026 | — |
| 3 | InstructorAnalyticsPage: KPIs/course perf wired (engagement chart needs backend) | 18 Mar 2026 | — |
| 4 | FinanceAnalyticsPage: fully wired to `transactionApi`, `invoiceApi`, `userSubscriptionApi` | 18 Mar 2026 | — |
| 6 | Manager Bulk Import: UI wired up but currently blocked by 403 for actual managers | 18 Mar 2026 | — |
| 7 | ContentUploadPage: wired storage quota to `quotaApi.getQuota()` | 18 Mar 2026 | — |
| 9 | SubscriptionManagementPage: usage stats, billing, plan card wired to real APIs | 21 Mar 2026 | — |
| 10 | CoursePlayerPage Q&A: wired to `discussionApi`, removed sampleQuestions | 18 Mar 2026 | — |
| 12 | InstructorLearnersPage: replaced sampleLearners with `enrollmentApi.getAll()` + groupByLearner | 18 Mar 2026 | — |
| 13 | Instructor Notifications: already wired to `notificationApi.getAll()`, no hardcoded data | 18 Mar 2026 | — |
| 14 | Instructor WorkshopsPage wired to `livestreamApi.getAll()` | 18 Mar 2026 | — |
| 15 | WorkshopDetailsPage wired to `livestreamApi.getById()` + `livestreamAttendanceApi` | 18 Mar 2026 | — |
| 16 | CoursePreviewPage wired to real modules and reviews API | 18 Mar 2026 | — |
| 17 | LearnerCourseDetailPage fully wired to real API (course, modules, reviews) | 18 Mar 2026 | — |
| 18 | LearnerCourseCatalogPage wired to `publicCourseApi.getAll()` + `publicCategoryApi.getAll()` | 18 Mar 2026 | — |
| 20 | ManagerBulkEnrollPage course dropdown wired to `courseApi` | 18 Mar 2026 | — |
| 21 | ManagerRecordingsPage wired to `livestreamApi.getAll()` (sessions with recordings) | 18 Mar 2026 | — |
| 22 | ManagerScheduleNewPage wired to `courseApi` + `usersApi` for dropdowns | 18 Mar 2026 | — |
| 23 | Superadmin AllOrganizationsPage: removed unused mock data, KPIs from real API | 18 Mar 2026 | — |
| 24 | AllUsersPage: removed dead mockUsers, added `userStatsApi` for KPIs | 18 Mar 2026 | — |
| 25 | Superadmin PaymentsPage fully wired to `transactionApi` | 18 Mar 2026 | — |
| 27 | Catalogue CoursesGrid: fetches from `publicCourseApi.getAll()` with real ratings | 18 Mar 2026 | `d42ae05` |
| 28 | FeaturedCategories: backend returns `courses_count` via annotated `CategorySerializer` | 22 Mar 2026 | — |
| 29 | StatsBanner: fetches from `publicStatsApi.getStats()` | 18 Mar 2026 | `d42ae05` |
| 30 | Landing Categories: fetches from `publicCategoryApi.getAll()` with real `courses_count` | 18 Mar 2026 | `d42ae05` |
| 31 | Landing Featured Courses: fetches from `publicCourseApi.getAll({ featured: true })` | 18 Mar 2026 | `d42ae05` |
| 32 | Landing Pricing: fetches plan name, price, billing cycle from `subscriptionApi.getAll()` | 22 Mar 2026 | — |
| 33 | TrustedBy: fetches from `publicClientsApi.getClients()` | 18 Mar 2026 | `d42ae05` |
| 35a | BusinessCtaSection: wired demo form to EmailJS (`@emailjs/browser`), credentials pending | 21 Mar 2026 | — |
| 36 | CourseReviews: removed hardcoded fallback, accepts real props from parent | 18 Mar 2026 | — |
| 38 | Course details page: slug route, CourseDetailContext, reviews, pricing card, related courses | 22 Mar 2026 | — |
| 39 | Catalogue FiltersSidebar: fully wired category + level filters, sort dropdown, mobile drawer | 22 Mar 2026 | — |
| 40 | CatalogueHero: wired stats + categories to real APIs | 18 Mar 2026 | — |
| 41 | Catalogue Pagination: uses `count` prop from API, no hardcoded value | 22 Mar 2026 | — |
| 42 | Public Header + MobileDrawer: auth-aware (My Dashboard / Log Out) | 18 Mar 2026 | — |
| 45 | QuizPlayer: server scores override client-side, past attempts on pre-start screen | 22 Mar 2026 | — |
| 46 | FinanceExportPage: wired to `reportsApi` (types, generate, download, status indicators) | 22 Mar 2026 | — |
| 48 | Course Publish Flow: `handlePublish()` wired to `useSubmitCourseForApproval()` | 18 Mar 2026 | — |
| 49 | Learner assignments wired to `submissionApi.getAll()` | 18 Mar 2026 | — |
| 52 | Console.log cleanup: replaced all placeholder handlers with real actions or toasts | 22 Mar 2026 | — |
| 53 | All 5 Sidebars + TopBars: real unread badge via shared `useUnreadNotificationCount` hook + click-to-navigate | 24 Mar 2026 | — |
| 54 | Type safety: fixed `as any` casts in 3 files; added `currency` to `CourseDetail` type | 22 Mar 2026 | — |
| 55 | PaymentHistoryPage: wired to `transactionApi.getAll()`, removed 7 hardcoded transactions | 22 Mar 2026 | — |
| 56 | SubscriptionManagementPage: payment methods wired to `paymentMethodApi.getAll()` | 22 Mar 2026 | — |
| — | CourseCurriculum, WhatYouLearn, CourseRequirements, CourseInstructor: removed sample data | 18 Mar 2026 | — |
| — | Created `usePublicCourse` hook for course reviews API | 18 Mar 2026 | — |
| — | Fixed public service types (paginated responses for categories/courses) | 18 Mar 2026 | `d42ae05` |
| — | Dev auth bypass: skip 401→login redirects in all loaders + axios interceptor | 17 Mar 2026 | `87ae8b5` |
| — | Fix TypeScript build errors (3 files) | 18 Mar 2026 | `28b5fe7` |
| — | Drag-and-drop reordering (modules + lessons) | 16 Mar 2026 | `8ed0df3` |
| — | Quiz player (timer, attempts, grading, all 6 types) | 16 Mar 2026 | `8ed0df3` |
| — | Video resume (localStorage playback position) | 16 Mar 2026 | `8ed0df3` |
| — | QuizzesPage wired to real API | 16 Mar 2026 | `947ea56` |
| — | NotificationsPage wired to real API | 16 Mar 2026 | `947ea56` |
| — | Notes tab persisted to backend | 16 Mar 2026 | `947ea56` |
| — | Certificate/invoice download buttons | 15 Mar 2026 | `5e2d1c2` |
| — | Privacy policy + certificate validation pages | 14 Mar 2026 | `e3dc560` |
| — | Manager full course management (reuse instructor components, role-aware navigation) | 21 Mar 2026 | — |
| — | Removed thin ManagerCourseDetailPage + ManagerCourseEditPage | 21 Mar 2026 | — |
| — | Fixed hardcoded `/instructor/` paths in 5 shared components | 21 Mar 2026 | — |
| — | Added missing manager routes: `/manager/assignment/create`, `/manager/sessions/schedule` | 21 Mar 2026 | — |
| — | Shared pages render correct sidebar (manager vs instructor) | 21 Mar 2026 | — |
| — | ManagerCreateCoursePage: Quick Tools, tabbed course list, per-course action buttons | 21 Mar 2026 | — |
| — | Fixed ManagerCoursesPage build errors | 21 Mar 2026 | — |
| — | Landing page responsive fixes: Footer, Header, mobile menu | 22 Mar 2026 | — |
| — | All dashboard sidebars: `lg` → `md` breakpoint (960px) | 22 Mar 2026 | — |
| — | Removed decorative search bars from all dashboard TopBars | 22 Mar 2026 | — |
| — | Removed "New: AI-Powered Learning Paths" badge from Hero | 22 Mar 2026 | — |
| — | Catalogue sort dropdown wired to backend `ordering` param | 22 Mar 2026 | — |
| — | Catalogue MobileFilterDrawer passes filter state from parent | 22 Mar 2026 | — |
| — | Removed hardcoded popular search tags from CatalogueHero and CatalogFilterBar | 22 Mar 2026 | — |
| — | Learner CatalogFilterBar: search input + category dropdown + search button | 22 Mar 2026 | — |
| — | Backend: SearchFilter + OrderingFilter on PublicCourseViewSet | 22 Mar 2026 | — |
| — | CTA + Pricing buttons: auth-aware routing, Schedule Demo wired to /for-business | 22 Mar 2026 | — |
| 19 | Wire CheckoutPaymentPage to real APIs | 23 Mar 2026 | — |
| 44 | Query param support: backend filters + frontend TODO cleanup + param name alignment | 22 Mar 2026 | — |
| 47 | Implement Curriculum Builder bulk actions | 23 Mar 2026 | — |
| 49 | Add file upload modal to assignment submission | 23 Mar 2026 | — |
| 59 | Remove hardcoded course fallback in Courses.tsx | 23 Mar 2026 | — |
| 60 | Route-Level Lazy Loading: vite manualChunks by role + router React.lazy and Suspense | 23 Mar 2026 | — |
| 61 | Nginx cache headers for static assets | 23 Mar 2026 | — |
| 62 | Learner Badges Page + Earned Badge Modal + sidebar showcase icons | 23 Mar 2026 | — |
| 63 | Wire ALL dashboard overview widgets to real APIs (11 widgets across 5 roles) | 23 Mar 2026 | — |
| 64 | Wire all QuickActions navigation buttons across all dashboards | 23 Mar 2026 | — |
| 65 | Wire all View All / See All / View Calendar buttons on dashboard widgets | 23 Mar 2026 | — |
| — | MyCoursesPage: wired to `enrollmentApi`, removed 8 mock courses, real KPIs + sorting | 24 Mar 2026 | — |
| — | Learner Sidebar: overall progress bar wired to real enrollment data (avg progress_percentage) | 24 Mar 2026 | — |
| — | All 5 profile pages: wired Save to `updateProfile.mutateAsync()`, synced form from auth user | 24 Mar 2026 | — |
| — | Shared `ChangePasswordForm` component: wired to `authApi.changePassword()`, used across all 5 profiles | 24 Mar 2026 | — |
| — | Removed 2FA toggles, active sessions, and notification preferences from all 5 profile pages | 24 Mar 2026 | — |
| — | Learner profile: removed hardcoded "Emma Chen", replaced Website with Location, removed Headline | 24 Mar 2026 | — |
| — | Fixed DEV_BYPASS_AUTH 401 crash in route loaders (learner, instructor, shared) | 24 Mar 2026 | — |

---

## Backend Endpoints Now Available

| Endpoint | Method | Purpose | Unblocks |
|----------|--------|---------|----------|
| `/api/v1/learning/quiz-submissions/` | POST | Submit quiz answers, server-side grading | QuizPlayer (#45) |
| `/api/v1/learning/quiz-submissions/` | GET | List quiz attempts | QuizPlayer (#45) |
| `/api/v1/learning/submissions/statistics/?course={id}` | GET | Grade distribution & stats | GradebookPage (#1, #43) |
| `/api/v1/learning/submissions/bulk_grade/` | POST | Grade multiple submissions at once | GradebookPage (#1) |
| `/api/v1/learning/reports/` | POST | Async report generation (Celery) | ManagerReportsPage (#46) |
| `/api/v1/learning/reports/{id}/download/` | GET | Download generated report | ManagerReportsPage (#46) |
| `/api/v1/learning/reports/types/` | GET | List available report types | ManagerReportsPage (#46) |
| `/api/v1/uploads/quota/` | GET | Storage usage `{ used_bytes, total_bytes }` | ContentUploadPage (#7) |
| `/api/v1/public/stats/` | GET | Platform metrics `{ courses, learners, instructors, certificates }` | StatsBanner (#29), CatalogueHero (#40) |
| `/api/v1/public/clients/` | GET | Trusted-by logos `[{ name, logo_url }]` | TrustedBy (#33) |
| `/api/v1/catalogue/course-reviews/` | GET/POST | Course reviews & ratings | CourseReviews (#36), CoursePreviewPage (#16) |
| `/api/v1/superadmin/users/bulk_import/` | POST | CSV user import (fully implemented) | ManagerBulkImportPage (#6) |
| `/api/v1/superadmin/users/csv_template/` | GET | Download CSV template | ManagerBulkImportPage (#6) |
| `/api/v1/superadmin/users/stats/` | GET | User stats `{ total, active, new_this_month, suspended }` | AllUsersPage (#24) |
| `/api/v1/learner/my-courses/` | GET | Learner's enrolled courses (sort/filter) | Learner dashboard |
| `/api/v1/learner/courses/{slug}/enroll/` | POST | Enroll by slug (idempotent) | Course enrollment flow |

## MEDIUM — New Features

### 63–65. Dashboard Overview Widgets — DONE

All dashboard overview widgets across 5 roles have been wired to real APIs with loading skeletons, empty states, and navigation buttons:

**Instructor dashboard:**
- `UpcomingSessions.tsx` — `livestreamApi.getAll({ status: 'scheduled' })`, Edit/Join buttons wired
- `PendingTasks.tsx` — `submissionApi` + `courseApprovalApi` for pending counts, loading skeletons
- `CoursesSection.tsx` — `courseApi` + `enrollmentApi` for enrollment counts/progress

**Manager dashboard:**
- `TopCourses.tsx` — `courseApi` (uses `enrollment_count` from serializer, sorted client-side), View All → `/manager/courses`
- `InstructorPerformance.tsx` — `usersApi.getInstructors()`, View All → `/manager/users`
- `RecentActivity.tsx` — `notificationApi`, View All → `/manager/reports`
- `UpcomingSessions.tsx` — `livestreamApi` (uses `attendee_count` computed field), Schedule → `/manager/sessions`, Join/View wired
- `UsersCoursesTable.tsx` — `usersApi.getAll()`, Add User/View All → `/manager/users`

**Finance dashboard:**
- `TransactionsTable.tsx` — `transactionApi.getAll()`, Export → `/finance/reports`, Filter → `/finance/transactions`
- `RecentInvoices.tsx` — `invoiceApi.getAll()`, View All → `/finance/invoices`

**Superadmin dashboard:**
- `OrganizationsTable.tsx` — `organizationApi.getAll()`, View All/Add New → `/superadmin/organizations`
- `RecentActivity.tsx` — `notificationApi`, View All → `/superadmin/audit-logs`

**Learner dashboard** (wired in prior session):
- `CourseGrid.tsx` — `enrollmentApi`, View All → `/learner/my-courses`
- `UpcomingSessions.tsx` — `livestreamApi`, View Calendar → `/learner/schedule`
- `RecentActivity.tsx` — `notificationApi`, See All → `/learner/notifications`
- `Certificates.tsx` — `certificateApi`, View All → `/learner/certificates`

**Still hardcoded (charts — blocked on backend analytics endpoints):**
- `EnrollmentChart.tsx`, `LearningStatistics.tsx`, `CourseCategories.tsx` (Manager)
- `RevenueChart.tsx`, `PaymentMethodsChart.tsx`, `PaymentMethods.tsx` (Finance)
- `RevenueChart.tsx`, `UserGrowthChart.tsx`, `SystemHealth.tsx` (Superadmin)

---

### 62. Learner Badges Page + Earned Badge Modal — DONE

Frontend implementation complete (`LearnerBadgesPage.tsx`, `BadgeEarnedModal.tsx`, `useBadges.ts`, `badgeDefinitions.ts`, route + sidebar).

**Still needs:** Backend task #28 (Badge model + endpoints + auto-award signals) and badge PNG assets at `public/badges/{slug}.png`.

**Badge spec:** See `src/config/badges.md` for full definitions (22 badges, 6 categories)

---

## Backend Endpoints Still Missing

| Endpoint | Purpose | Blocking |
|----------|---------|----------|
| Analytics aggregation (enrollment trends, engagement metrics) | Time-series data for charts | Analytics pages (#2, #3, #4, #5) |
| Messaging/inbox API | Direct messaging between users | InstructorMessagesPage (#11) |
| Bulk enrollment endpoint (real implementation) | Enroll multiple users at once | ManagerBulkEnrollPage (#20) |
| Security metrics endpoint | Active sessions, login attempts | SecurityPage (#26) |
| Business-specific stats/pricing | Enterprise customer metrics, B2B plans | BusinessStatsSection (#35), PricingSection (#34) |
| Manager-scoped bulk import | `POST /api/v1/manager/users/bulk_import/` (No 403 for managers) | ManagerBulkImportPage (#6, #43) |
| Session attachments/resources | Files attached to lessons | CoursePlayerPage Resources (#10) |
| Certificate PDF generation | Populate `pdf_url` on Certificate model | LearnerCertificatesPage (#8, #50) |
| Discussion moderation | Pin and lock endpoints for existing API | Instructor/Manager discussions |
| Saved/Favorited courses API | `GET/POST/DELETE /api/v1/learning/saved-courses/` + toggle endpoint | SavedCoursesPage, CatalogCourseCard heart icon |
