# TASC LMS Frontend — Task Tracker

**Last updated:** 19 March 2026
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

### 9. Learner Subscription Page — Usage Stats
- **File:** `src/pages/learner/SubscriptionManagementPage.tsx`
- **What's hardcoded:** Usage stats (course access count, certificates, live sessions, downloads) and billing history.
- **What to do:** Compute usage from real enrollment/progress/certificate data.
- **Backend dependency:** Raw data APIs exist; no aggregated "usage summary" endpoint.
- **Blocked?** No — can compute client-side

### 10. CoursePlayerPage — Partially Done
- **File:** `src/pages/learner/CoursePlayerPage.tsx`
- **Done:** Q&A tab wired to `discussionApi.getAll()` and `discussionApi.create()`. Removed `sampleQuestions[]`.
- **Still pending:** Resources tab still uses `sampleResources[]` (no backend endpoint for session attachments). Discussion replies and upvoting not yet wired.

### 11. Instructor Messages Page
- **File:** `src/pages/InstructorMessagesPage.tsx`
- **What's hardcoded:** `conversations[]` array (6+ mock conversation objects)
- **What to do:** Wire to a messaging/inbox API if backend supports it, or mark as future feature.
- **Blocked?** Yes — no messaging API exists

### 19. Learner Checkout Payment Page
- **File:** `src/pages/learner/CheckoutPaymentPage.tsx`
- **What's hardcoded:** `paymentMethods[]`, `countryCodes[]`, `sampleCourse` object
- **What to do:** Wire to real payment methods API and course detail from route params.
- **Blocked?** No — APIs exist

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

### 28. Catalogue Featured Categories — Fake Course Counts
- **File:** `src/components/catalogue/FeaturedCategories.tsx` (lines 13-22)
- **What's hardcoded:** 8 categories with fake course counts (e.g., "Web Development: 142 courses")
- **What to do:** Fetch from `publicCategoryApi.getAll()` and use real course counts.
- **Blocked?** No — API exists

### 32. Landing Page Pricing — Hardcoded Price
- **File:** `src/components/landing/Pricing.tsx` (lines 137-170)
- **What's hardcoded:** "$99 / 6 months" price and 6 feature bullet points
- **What to do:** Fetch from subscription plans API.
- **Blocked?** No — subscription API exists

### 34. Business Page Pricing — Hardcoded Plans
- **File:** `src/components/business/PricingSection.tsx` (lines 20-76)
- **What's hardcoded:** 3 B2B pricing tiers (Team $15, Business $20, Enterprise $25) with feature lists
- **What to do:** Fetch from subscription plans API or a dedicated business pricing endpoint.
- **Blocked?** Partially — current subscription API is learner-focused

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

### 38. Course Details Page — Partially Done
- **File:** `src/pages/public/CourseLandingPage.tsx`
- **Done:** Route changed to `/course-details/:slug`. Page fetches via `publicCourseApi.getBySlug(slug)`. Created `CourseDetailContext`. Content sections (Curriculum, Objectives, Instructor) are wired up.
- **Still pending:** Remaining child components (CourseHero, CoursePricingCard, RelatedCourses) still render hardcoded data. Each needs to consume `useCourseDetail()` context.

### 39. Catalogue Filters Sidebar — Partially Done
- **File:** `src/components/catalogue/FiltersSidebar.tsx`
- **Done:** Categories fetched from `publicCategoryApi.getAll()`.
- **Still pending:** `levels[]` counts (Beginner/Intermediate/Advanced with `count: 0`), price range slider.

### 41. Catalogue Pagination — Hardcoded Page Count
- **File:** `src/components/catalogue/Pagination.tsx` (line 8)
- **What's hardcoded:** `count={24}` (fixed 24 pages)
- **What to do:** Compute from total results count in paginated API response.
- **Blocked?** No

---

## HIGH — Service Layer Stubs & TODOs

### 43. Manager Bulk Import — Backend Blocked
- **File:** `src/pages/manager/ManagerBulkImportPage.tsx`
- **Issue:** Currently uses `/api/v1/superadmin/users/bulk_import/` which throws 403 Forbidden for LMS Managers.
- **What to do:** Wait for backend to implement `POST /api/v1/manager/users/bulk_import/` then update `manager.services.ts`.
- **Blocked?** Yes — backend dependency.

### 44. Missing Query Parameter Support
- **Files:** Multiple service files have TODO comments about missing backend filter support:
  - `learning.services.ts`: Enrollment filters (`search`, `dateRange`, `courseId`), session progress `course` filter
  - `payments.services.ts`: Invoice/transaction filters (`limit`, `page`, `date_from`, `date_to`)
  - `catalogue.services.ts`: Course/session filters
- **What to do:** Confirm which filters backend supports and wire them up.
- **Blocked?** Needs backend confirmation

### 45. QuizPlayer — Partially Done
- **File:** `src/components/learner/quiz-player/QuizPlayer.tsx`
- **Done:** Added `quizSubmissionApi.submit()` on quiz completion. Answers POSTed to server.
- **Still pending:** Display server-returned scores instead of client-computed ones. Wire `GET /api/v1/learning/quiz-submissions/?quiz={id}` for past attempts.

### 46. Report Download — Partially Done
- **Files:** `src/pages/manager/ManagerReportsPage.tsx`
- **Done:** Fixed status comparison bug. Download button calls `reportsApi.download()`.
- **Still pending:** FinanceExportPage not yet updated. No polling/refetch for report status during generation. No progress indicator.

---

## MEDIUM — Incomplete UI Features

### 47. Curriculum Builder — Bulk Actions
- **File:** `src/components/instructor/course-structure/CurriculumBuilder.tsx` (line 264)
- **Issue:** "Bulk Actions" button is permanently disabled with no implementation.
- **What to do:** Implement bulk delete, bulk move, bulk status change for lessons.
- **Blocked?** No

### 49. Learner Assignment Submission — Partially Done
- **File:** `src/pages/learner/LearnerAssignmentsPage.tsx`
- **Done:** Replaced all hardcoded data with real `submissionApi.getAll()` fetch. KPIs computed from live data.
- **Still pending:** Submit/Late Submit buttons don't yet open a file upload modal — need file picker + presign upload flow via `useCreateSubmission()`.

### 50. Learner Certificates — Real Data
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What to do:** Remove `MOCK_CERTIFICATES` fallback, ensure download button works with real `pdf_url`.
- **Blocked?** Partially — backend PDF generation unclear

---

## LOW — Polish & Cleanup

### 51. Instructor Placeholder Page
- **File:** `src/pages/InstructorPlaceholderPage.tsx`
- **Issue:** Generic "under development" page used for incomplete features.
- **What to do:** Replace all references with actual implementations as features complete.

### 52. Console.log Cleanup (widespread)
Multiple pages have `console.log` statements acting as placeholder click handlers:
- `src/pages/instructor/GradebookPage.tsx` — `onExport` logs "Exporting:"
- `src/pages/instructor/CoursePreviewPage.tsx:95` — "Publishing course..." (publish flow stub)
- `src/pages/instructor/CoursePreviewPage.tsx:183-197` — `onEnroll`, `onAddToCart` log stubs
- `src/pages/instructor/GradingPage.tsx:177` — "Draft saved" (no actual save)
- `src/pages/instructor/GradingPage.tsx:314-315` — file view/download stubs
- `src/pages/instructor/QuizBuilderPage.tsx:561-562` — Preview/Settings button stubs
- `src/pages/learner/LearnerCourseDetailPage.tsx:94` — "Starting preview" stub
- `src/pages/learner/LearnerCourseDetailPage.tsx:166` — "View instructor profile" stub
- `src/pages/learner/LearnerCourseDetailPage.tsx:174` — "Write review" stub
- `src/pages/learner/LearnerCourseCatalogPage.tsx:46,54,58` — enroll/browse/view stubs
- **What to do:** Replace each with real functionality or remove.

### 54. Type Safety — `as any` Casts
Several files use `as any` to work around type mismatches:
- `src/pages/instructor/CourseCreationPage.tsx:158,172` — casting course fields
- `src/pages/learner/QuizzesPage.tsx:68,108-109` — casting progress/enrollment data
- `src/pages/learner/CoursePlayerPage.tsx:385` — casting ReactPlayer
- `src/components/instructor/course-creation/BasicInfoSection.tsx:41,45` — casting categories/tags response
- **What to do:** Fix underlying type definitions so casts aren't needed.

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
| 29 | StatsBanner: fetches from `publicStatsApi.getStats()` | 18 Mar 2026 | `d42ae05` |
| 30 | Landing Categories: fetches from `publicCategoryApi.getAll()` with real `courses_count` | 18 Mar 2026 | `d42ae05` |
| 31 | Landing Featured Courses: fetches from `publicCourseApi.getAll({ featured: true })` | 18 Mar 2026 | `d42ae05` |
| 33 | TrustedBy: fetches from `publicClientsApi.getClients()` | 18 Mar 2026 | `d42ae05` |
| 36 | CourseReviews: removed hardcoded fallback, accepts real props from parent | 18 Mar 2026 | — |
| 38 | Course details page: slug route, `publicCourseApi.getBySlug()`, CourseDetailContext | 18 Mar 2026 | — |
| 40 | CatalogueHero: wired stats + categories to real APIs | 18 Mar 2026 | — |
| 42 | Public Header + MobileDrawer: auth-aware (My Dashboard / Log Out) | 18 Mar 2026 | — |
| 45 | QuizPlayer: added server-side submission via `quizSubmissionApi.submit()` | 18 Mar 2026 | — |
| 46 | ManagerReportsPage: fixed status bug + wired download handler | 18 Mar 2026 | — |
| 48 | Course Publish Flow: `handlePublish()` wired to `useSubmitCourseForApproval()` | 18 Mar 2026 | — |
| 49 | Learner assignments wired to `submissionApi.getAll()` | 18 Mar 2026 | — |
| 53 | Instructor Sidebar: real unread badge via `notificationApi.getUnreadCount()` | 18 Mar 2026 | — |
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
| — | Manager pages wired to real API | 13 Mar 2026 | `3fca5c3` |

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

## Backend Endpoints Still Missing

| Endpoint | Purpose | Blocking |
|----------|---------|----------|
| Analytics aggregation (enrollment trends, engagement metrics) | Time-series data for charts | Analytics pages (#2, #3, #4, #5) |
| Messaging/inbox API | Direct messaging between users | InstructorMessagesPage (#11) |
| Bulk enrollment endpoint (real implementation) | Enroll multiple users at once | ManagerBulkEnrollPage (#20) |
| Security metrics endpoint | Active sessions, login attempts | SecurityPage (#26) |
| Business-specific stats/pricing | Enterprise customer metrics, B2B plans | BusinessStatsSection (#35), PricingSection (#34) |
| Manager-scoped bulk import | `POST /api/v1/manager/users/bulk_import/` (No 403 for managers) | ManagerBulkImportPage (#6, #43) |
| Public course search | `?search=` filter support on `PublicCourseViewSet` | Catalogue search bar |
| Discussion moderation | Pin and lock endpoints for existing API | Instructor/Manager discussions |
