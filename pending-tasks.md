# TASC LMS Frontend — Task Tracker

**Last updated:** 25 March 2026
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

### ~~11. Instructor Messages Page~~ — DONE
- **Moved to Completed table below**


### 20. Manager Bulk Enroll Page — Partially Done
- **File:** `src/pages/manager/ManagerBulkEnrollPage.tsx`
- **Done:** Course dropdown wired to `courseApi.getAll()`.
- **Still pending:** `mockHistory[]` remains (no bulk enrollment history API). "Enroll Learners" button has no onClick handler — needs bulk enrollment API wired.
- **Blocked?** Yes — needs backend #20 (bulk enrollment endpoint)

### 81. Manager Assignments Page — Entirely Static
- **File:** `src/pages/manager/ManagerAssignmentsPage.tsx`
- **What's hardcoded:** KPIs (64 total, 12 pending, 89% rate, 78% avg grade), `assignments[]` (8 mock objects), course filter list
- **Unwired buttons:** View and Edit icon buttons in table rows — no onClick handlers
- **What to do:** Wire to `submissionApi.getAll()` for assignment submissions, compute KPIs from real data.
- **Blocked?** No — backend submission API exists

### 82. Manager Quizzes Page — Entirely Static
- **File:** `src/pages/manager/ManagerQuizzesPage.tsx`
- **What's hardcoded:** KPIs (89 total, 76.3% pass rate, 4521 attempts), `quizzes[]` (8 mock objects), course filter list
- **Unwired buttons:** View and Edit icon buttons in table rows — no onClick handlers
- **What to do:** Wire to quiz/session API, compute stats from `quizSubmissionApi`.
- **Blocked?** No — backend quiz API exists

### 83. Manager Activity Page — Entirely Static (NOT BLOCKED)
- **File:** `src/pages/manager/ManagerActivityPage.tsx`
- **What's hardcoded:** `activityItems[]` (12 mock entries), summary stats (145 logins, 23 enrollments, etc.), peak hours data
- **Unwired buttons:** Date range filter (today/7days/30days/custom) doesn't trigger any API calls
- **What to do:** Wire to existing audit log API (`/api/v1/superadmin/audit-logs/` — managers have read access) with date/action/resource filters. Summary stats can be computed client-side.
- **Blocked?** No — existing `AuditLogListView` supports manager role + all needed filters

### 84. Manager Billing Page — Mostly Static
- **File:** `src/pages/manager/ManagerBillingPage.tsx`
- **What's hardcoded:** Current plan ("Enterprise $499/mo"), usage stats (347/500 users, 42GB/100GB), payment method ("Visa ****4242")
- **Unwired buttons:** "Upgrade Plan" button — no onClick. "Update" payment method button — no onClick.
- **Done:** Invoice list fetched from real API.
- **Blocked?** Yes — needs org subscription/plan endpoint from backend

### 85. Manager Settings Page — Entirely Static
- **File:** `src/pages/manager/ManagerSettingsPage.tsx`
- **What's hardcoded:** Org name ("Acme Corporation"), industry, website URL, theme settings, all toggle states, dropdown options
- **Unwired buttons:** "Save Changes" button — no onClick handler. "Export All Data" button — no onClick.
- **What to do:** Wire to org settings CRUD endpoint.
- **Blocked?** Yes — needs backend org settings endpoint

### 86. Manager Progress Page — Entirely Static
- **File:** `src/pages/manager/ManagerProgressPage.tsx`
- **What's hardcoded:** KPIs (4 metrics), `courseProgress[]` (6 courses with enrollment/completion data), `atRiskLearners[]` (6 learner records)
- **Unwired buttons:** "Send Reminder" button in at-risk table — no onClick handler
- **What to do:** Wire to enrollment API for progress data, add reminder endpoint.
- **Blocked?** Partially — enrollment API exists for data, reminder feature needs backend

### 87. Manager Roles Page — Entirely Static (NOT BLOCKED)
- **File:** `src/pages/manager/ManagerRolesPage.tsx`
- **What's hardcoded:** `roles[]` (3 roles with descriptions, user counts, permissions), `recentRoleChanges[]` (5 mock entries)
- **What to do:** Wire role user counts from `usersApi.getAll({ role })` per role. Role changes from audit log API (`/api/v1/superadmin/audit-logs/?resource=user&action=updated`).
- **Blocked?** No — existing user list + audit log APIs cover this

### 88. Manager Schedule Session — Partially Wired (NOT BLOCKED)
- **File:** `src/pages/manager/ManagerScheduleNewPage.tsx`
- **Done:** Course and instructor dropdowns wired to `courseApi` and `usersApi`.
- **Unwired buttons:** "Schedule Session" submit button — no form submission handler. "Cancel" button — no handler.
- **What to do:** Wire submit to `livestreamApi.create()` — endpoint already exists at `POST /api/v1/livestream/livestreams/` with full platform integration (Zoom, Meet, Teams). May need to verify manager permission on the ViewSet.
- **Blocked?** No — backend endpoint exists, frontend wiring only

### 89. Manager Sessions — "View Details" Unwired
- **File:** `src/pages/manager/ManagerSessionsPage.tsx`
- **Done:** Session list fetched from `sessionApi.getAll()`, filters work.
- **Unwired buttons:** "View Details" button in session cards — no onClick handler.
- **What to do:** Add navigation to session detail page.

### 90. Manager Dashboard Charts — Static Placeholders
- **Components:** `EnrollmentChart.tsx` (static stats + "Last 90 Days"/"Export" buttons unwired), `LearningStatistics.tsx` (4 hardcoded metrics), `CourseCategories.tsx` (4 hardcoded categories)
- **What to do:** Wire to analytics endpoints when backend provides them.
- **Blocked?** Yes — needs backend #18 (analytics aggregation endpoints)

### 91. Manager Sidebar — Hardcoded Org Name
- **Component:** `src/components/manager/Sidebar.tsx`
- **What's hardcoded:** Organization name "Acme Corporation" (line 362)
- **What to do:** Pull from auth user's organization data.

### 26. Superadmin Security Page
- **File:** `src/pages/superadmin/SecurityPage.tsx`
- **What's hardcoded:** `kpis[]` (4 security KPIs), `activeSessions[]` (8 mock sessions), password policy defaults, MFA settings
- **What to do:** Wire to real active sessions/audit data.
- **Blocked?** Yes — needs backend #22 (security metrics endpoint)

### 66. Superadmin All Courses Page — Partially Unblocked
- **File:** `src/pages/superadmin/AllCoursesPage.tsx`
- **What's hardcoded:** KPIs (876 total, 654 published, 178 draft, 44 archived), `courses[]` array (10 mock courses)
- **What to do:** Wire table to `courseApi.getAll({ status, search, page_size })` — existing endpoint. KPIs need a stats action (backend #32, minor).
- **Blocked?** Partially — table can be wired now, KPIs need minor backend addition

### 67. Superadmin Assessments Page — Entirely Static
- **File:** `src/pages/superadmin/AssessmentsPage.tsx`
- **What's hardcoded:** KPIs (892 total, 78.5% pass rate), `assessments[]` array (10 mock assessments)
- **What to do:** Wire to a combined quiz + assignment listing.
- **Blocked?** Yes — needs backend #33 (assessments stats & list)

### 68. Superadmin Certifications Page — Entirely Static
- **File:** `src/pages/superadmin/CertificationsPage.tsx`
- **What's hardcoded:** KPIs (4,567 issued, 4,123 valid), `certs[]` (8 mocks), `templates[]` (4 mock templates)
- **What to do:** Wire to `certificateApi` list + stats endpoint.
- **Blocked?** Yes — needs backend #34 (certification stats)

### 69. Superadmin Instructors Page — Entirely Static
- **File:** `src/pages/superadmin/InstructorsPage.tsx`
- **What's hardcoded:** KPIs (156 total, 142 active, 4.6 avg rating), `instructors[]` (8 mock objects)
- **What to do:** Wire to `usersApi.getAll({ role: 'instructor' })` + annotated fields.
- **Blocked?** Partially — user list works, but needs annotated `courses_count`, `students_count`, `avg_rating` from backend #35

### 70. Superadmin Invoices Page — Partially Unblocked
- **File:** `src/pages/superadmin/InvoicesPage.tsx`
- **What's hardcoded:** KPIs ($1.8M paid, $234K pending, $45K overdue), `invoices[]` (8 mock objects)
- **What to do:** Wire table to `invoiceApi.getAll({ status, page_size })` — existing endpoint. KPIs need a stats action (backend #36, minor).
- **Blocked?** Partially — table can be wired now, KPIs need minor backend addition

### 71. Superadmin Revenue Page — Entirely Static
- **File:** `src/pages/superadmin/RevenuePage.tsx`
- **What's hardcoded:** KPIs ($2.4M total, $186K monthly), `orgs[]` (6 mock orgs with revenue), revenue charts placeholder
- **What to do:** Wire to revenue stats + by-org breakdown endpoints.
- **Blocked?** Yes — needs backend #37 (revenue endpoints)

### 72. Superadmin Roles & Permissions Page — Entirely Static
- **File:** `src/pages/superadmin/RolesPermissionsPage.tsx`
- **What's hardcoded:** `roles[]` (5 roles with user counts), `permissions[]` (8 names), `permissionMatrix` (full matrix)
- **What to do:** Wire role user counts from backend; permission matrix can stay as frontend config.
- **Blocked?** Partially — needs backend #40 (roles with counts)

### 73. Superadmin System Settings Page — Entirely Static
- **File:** `src/pages/superadmin/SystemSettingsPage.tsx`
- **What's hardcoded:** General settings defaults (site name, URL, timezone), SMTP config, `featureToggles[]` (8 toggles), system info (version, deploy date, uptime)
- **What to do:** Wire to system settings CRUD + health endpoint.
- **Blocked?** Yes — needs backend #38 (system settings & health)

### 74. Superadmin Notifications Page — NOT BLOCKED
- **File:** `src/pages/superadmin/NotificationsPage.tsx`
- **What's hardcoded:** Stat cards (3 unread, 12 today, 47 this week), `notifications[]` (10 mock objects)
- **What to do:** Wire to existing `notificationApi.getAll()` for list + `notificationApi.getUnreadCount()` for unread stat. Compute "today" / "this week" counts client-side from `created_at` timestamps.
- **Blocked?** No — existing NotificationViewSet has list + is_read/type filters + unread_count action

### 75. Superadmin Partnerships Page — Entirely Static
- **File:** `src/pages/superadmin/PartnershipsPage.tsx`
- **What's hardcoded:** KPIs (12 partners, 9 active, $45.2K revenue), `partners[]` (6 mock objects)
- **Blocked?** Yes — Phase 2 feature, no backend models exist (backend #41)

### 76. Superadmin Integrations Page — Entirely Static
- **File:** `src/pages/superadmin/IntegrationsPage.tsx`
- **What's hardcoded:** `integrations[]` (10 mock integrations with status, categories, sync times)
- **Blocked?** Yes — Phase 2 feature, no backend models exist (backend #41)

### 77. Superadmin Data Migration Page — Entirely Static
- **File:** `src/pages/superadmin/DataMigrationPage.tsx`
- **What's hardcoded:** KPIs (156K records, 142K migrated), `modules[]` (10 mock migration modules), Odoo connection details, migration logs
- **Blocked?** Yes — specialized feature, no backend infrastructure (backend #42)

### 78. Superadmin Gateway Settings Page — Entirely Static
- **File:** `src/pages/superadmin/GatewaySettingsPage.tsx`
- **What's hardcoded:** `gateways[]` (4 payment gateways with status, transaction counts), Flutterwave config defaults
- **Blocked?** Yes — needs payment gateway management backend (backend #42)

### 79. Superadmin Dashboard Charts — Hardcoded
- **Components:** `RevenueChart.tsx` (6 months hardcoded data), `UserGrowthChart.tsx` (4 mock metrics + 5 acquisition channels), `SystemHealth.tsx` (5 hardcoded health items)
- **What to do:** Wire to analytics + health endpoints when available.
- **Blocked?** Yes — needs backend #18 (analytics), #38 (system health)

### 80. Superadmin AllOrganizations — Minor Hardcoded Defaults
- **File:** `src/pages/superadmin/AllOrganizationsPage.tsx`
- **What's hardcoded:** Plan defaults to "Standard", users to "0", revenue to "$0", pagination text "Showing 1-8 of 142"
- **What to do:** Wire plan/users/revenue from backend annotated fields (backend #31), fix pagination from API count.
- **Blocked?** Partially — needs `user_count` and `course_count` from backend #31

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
| 11 | InstructorMessagesPage: wired to `messagingApi` (conversations list, messages, send, mark_read), added route + sidebar link | 25 Mar 2026 | — |

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
| `/api/v1/messaging/conversations/` | GET/POST | Conversations + messages + send + mark_read | InstructorMessagesPage (#11) |

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

| Endpoint | Purpose | Blocking | Backend # |
|----------|---------|----------|-----------|
| Analytics aggregation (enrollment trends, engagement metrics) | Time-series data for charts | Analytics pages (#2, #3, #4, #5) | #18 |
| ~~Messaging/inbox API~~ | ~~Direct messaging between users~~ | ~~InstructorMessagesPage (#11)~~ | ~~#24~~ **DONE** |
| Bulk enrollment endpoint (real implementation) | Enroll multiple users at once | ManagerBulkEnrollPage (#20) | #20 |
| Security metrics endpoint | Active sessions, login attempts | SecurityPage (#26) | #22 |
| Business-specific stats/pricing | Enterprise customer metrics, B2B plans | BusinessStatsSection (#35), PricingSection (#34) | #23 |
| Manager-scoped bulk import | `POST /api/v1/manager/users/bulk_import/` (No 403 for managers) | ManagerBulkImportPage (#6, #43) | #0b |
| Session attachments/resources | Files attached to lessons | CoursePlayerPage Resources (#10) | #21 |
| Certificate PDF generation | Populate `pdf_url` on Certificate model | LearnerCertificatesPage (#8, #50) | #19 |
| Discussion moderation | Pin and lock endpoints for existing API | Instructor/Manager discussions | #4 |
| Saved/Favorited courses API | `GET/POST/DELETE /api/v1/learning/saved-courses/` + toggle endpoint | SavedCoursesPage, CatalogCourseCard heart icon | #29 |
| Superadmin courses stats action | `stats/` action on CourseViewSet (KPI counts) | AllCoursesPage (#66) KPIs only — table can be wired now | #32 (minor) |
| Superadmin assessments stats + list | Quiz/assignment counts, pass rates | AssessmentsPage (#67) | #33 |
| Superadmin certifications admin-scoped list + stats | All users' certs (current endpoint is user-scoped) | CertificationsPage (#68) | #34 |
| Superadmin instructors annotated fields | `courses_count`, `students_count`, `avg_rating` on user list | InstructorsPage (#69) | #35 |
| Superadmin invoice stats action | `stats/` action on InvoiceViewSet (KPI totals) | InvoicesPage (#70) KPIs only — table can be wired now | #36 (minor) |
| Superadmin revenue stats + by-org | Revenue KPIs, per-org breakdown | RevenuePage (#71) | #37 |
| Superadmin system settings + health | Settings CRUD, system health check | SystemSettingsPage (#73), SystemHealth widget (#79) | #38 |
| Superadmin user stats: add `by_role` | Per-role user counts in existing stats endpoint | RolesPermissionsPage (#72) | #40 (minor) |
| Org serializer: `user_count`, `course_count` | Annotated org fields | AllOrganizationsPage (#80) | #31 |
| Manager org settings CRUD | Read/save org settings (name, theme, toggles) | ManagerSettingsPage (#85) | #43 |
| Manager billing/plan info | Org subscription details + usage stats | ManagerBillingPage (#84) | #44 |
| Bulk enrollment endpoint | `POST /api/v1/manager/enrollments/bulk/` | ManagerBulkEnrollPage (#20) | #20 |

### Endpoints That Already Exist (frontend wiring only — no backend needed)

| Existing Endpoint | Frontend Page | Task # |
|-------------------|--------------|--------|
| `POST /api/v1/livestream/livestreams/` (full CRUD + platform integration) | ManagerScheduleNewPage — wire submit button | #88 |
| `GET /api/v1/notifications/` + `unread_count` action | SuperadminNotificationsPage — wire list + stats | #74 |
| `GET /api/v1/superadmin/audit-logs/` (managers have access, date/action/resource filters) | ManagerActivityPage — wire activity list | #83 |
| `GET /api/v1/catalogue/courses/` (status filter, search, ordering) | SuperadminAllCoursesPage — wire table | #66 |
| `GET /api/v1/payments/invoices/` (status filter, date range) | SuperadminInvoicesPage — wire table | #70 |
| `GET /api/v1/superadmin/users/?role=` (existing role filter) | ManagerRolesPage — compute role counts | #87 |
| `GET /api/v1/learning/submissions/` + `statistics/` action | ManagerAssignmentsPage — wire table + KPIs | #81 |
| `/api/v1/messaging/conversations/` (full CRUD + messages + send + mark_read) | InstructorMessagesPage — wire conversations list + chat | #11 |
