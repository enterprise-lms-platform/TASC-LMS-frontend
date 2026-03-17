# TASC LMS Frontend — Pending Tasks

**Last updated:** 17 March 2026 (evening — wired CatalogueHero, StorageQuota, Sidebar badge, auth-aware Header)
**Repo:** `TASC-LMS-frontend`


---

## How to Use This File

This file tracks all known incomplete work in the frontend codebase. Each item includes the affected files, what's done, what's missing, and whether it's blocked by the backend. When you pick up a task, move it to the current sprint plan and mark it in progress.

---

## CRITICAL — Pages Using Hardcoded/Sample Data

These pages render but show fake data instead of real API responses. Each needs to be wired to the corresponding backend API.

### 1. Instructor Gradebook Page
- **File:** `src/pages/instructor/GradebookPage.tsx`
- **What's hardcoded:** `sampleStudents[]` (10 mock students), `sampleItems[]` (mock graded items), `sampleGrades[]` (mock grade entries for all students — ~90 lines of fake data)
- **What to do:** Replace with real data from `submissionApi` and enrollment data. Join submissions with enrolled students to build the grade matrix.
- **Backend status:** `GET /api/v1/learning/submissions/statistics/?course={id}` now exists and returns grade distribution, averages, and counts. `POST /api/v1/learning/submissions/bulk_grade/` also available. The `managerGradesApi` stubs in `learning.services.ts` (lines 309-326) can now be wired to these real endpoints.
- **Blocked?** No — backend endpoints now exist

### 2. Manager Analytics Page
- **File:** `src/pages/manager/ManagerAnalyticsPage.tsx`
- **What's hardcoded:** `monthlyEnrollments[]`, `topCourses[]`, `weeklyEngagement[]`, `instructorPerformance[]`, `learningMetrics[]` (lines 31-80). Also `categoryBreakdown` uses `Math.round((idx + 1) * 15)` for fake percentages.
- **What to do:** Replace with real queries — enrollment trends from `enrollmentApi`, course performance from course stats, engagement from session progress aggregation.
- **Backend dependency:** No dedicated analytics aggregation endpoints. Frontend must compute from raw data or backend must add analytics endpoints.
- **Blocked?** Partially — heavy computation client-side without backend aggregation

### 3. Instructor Analytics Page
- **File:** `src/pages/instructor/InstructorAnalyticsPage.tsx`
- **What's hardcoded:** `kpis[]` (4 dummy KPIs), `coursePerformance[]` (5 mock courses), `weeklyEngagement[]`, `topLearners[]` (lines 34-69)
- **What to do:** Query real enrollment counts, submission stats, and engagement metrics for the logged-in instructor's courses.
- **Backend dependency:** Same as Manager Analytics — no aggregation endpoints.
- **Blocked?** Partially

### 4. Finance Analytics Page
- **File:** `src/pages/finance/FinanceAnalyticsPage.tsx`
- **What's hardcoded:** `kpis[]` (4 financial KPIs), `monthlyRevenue[]`, `gatewayBreakdown[]`, `subscriptionMetrics[]`, `topCourses[]`, `recentTransactions[]` (lines 29-83)
- **What to do:** Query real transaction/invoice data and compute revenue metrics.
- **Backend dependency:** Invoice and transaction APIs exist. May need aggregation endpoints for monthly revenue trends.
- **Blocked?** Partially

### 5. Superadmin Analytics Page
- **File:** `src/pages/superadmin/AnalyticsPage.tsx`
- **What's hardcoded:** `kpis[]`, `orgPerformance[]`, `topCourses[]`, `weeklyEngagement[]`, `contentTypes[]`, `categoryPerformance[]`, `assessmentMetrics[]`, `scoreDistribution[]` (lines 13-85)
- **What to do:** Aggregate platform-wide data across all organizations.
- **Backend dependency:** No cross-org analytics endpoints exist.
- **Blocked?** Yes — needs backend aggregation endpoints

### 6. Manager Bulk Import Page
- **File:** `src/pages/manager/ManagerBulkImportPage.tsx`
- **What's hardcoded:** `columnMappings[]`, `importHistory[]` (lines 46-61)
- **What to do:** Implement CSV parsing (papaparse), validate schema, POST to backend import endpoint, display per-row success/failure.
- **Backend status:** `POST /api/v1/superadmin/users/bulk_import/` is now fully implemented with CSV validation, error tracking, and detailed response. Also `GET /api/v1/superadmin/users/csv_template/` returns a downloadable CSV template.
- **Note:** Backend CSV columns are `email,first_name,last_name,role,department,phone_number` — verify this matches the frontend's expected format (`full_name,email_address,user_role,department,manager_email`). May need alignment.
- **Blocked?** No — backend is ready. Frontend wiring needed.

### ~~7. Content Upload Page — Storage Quota~~ — DONE
- **File:** `src/pages/instructor/ContentUploadPage.tsx`
- **Status:** Now fetches from `quotaApi.getQuota()` and converts `used_bytes`/`total_bytes` to GB for StorageInfoCard. Completed 17 Mar 2026.

### 8. Learner Certificates Page — Mock Fallback
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What's hardcoded:** `MOCK_CERTIFICATES[]` array (lines 25-68). Falls back to mock data if API returns empty (line 81-82).
- **What to do:** Remove mock fallback once backend reliably returns certificate data with `pdf_url` populated.
- **Backend dependency:** Certificate API exists but `pdf_url` may not be populated (PDF generation logic incomplete on backend).
- **Blocked?** Partially — depends on backend PDF generation

### 9. Learner Subscription Page — Usage Stats
- **File:** `src/pages/learner/SubscriptionManagementPage.tsx`
- **What's hardcoded:** Usage stats (course access count, certificates, live sessions, downloads — lines 91-96) and billing history.
- **What to do:** Compute usage from real enrollment/progress/certificate data.
- **Backend dependency:** Raw data APIs exist; no aggregated "usage summary" endpoint.
- **Blocked?** No — can compute client-side

### 10. CoursePlayerPage — Q&A Tab
- **File:** `src/pages/learner/CoursePlayerPage.tsx`
- **What's hardcoded:** `sampleQuestions[]` (line 38) and `sampleResources[]` (line 42)
- **What to do:** Wire Q&A tab to `discussionApi` (create, list, reply, upvote). Wire Resources tab to session attachments if backend supports it.
- **Backend dependency:** Discussion endpoints exist and work. No dedicated "session resources/attachments" endpoint.
- **Blocked?** No for Q&A. Partially for Resources.

### 11. Instructor Messages Page
- **File:** `src/pages/InstructorMessagesPage.tsx`
- **What's hardcoded:** `conversations[]` array (6+ mock conversation objects)
- **What to do:** Wire to a messaging/inbox API if backend supports it, or mark as future feature.
- **Blocked?** Yes — no messaging API exists

### 12. Instructor Learners Page
- **File:** `src/pages/instructor/InstructorLearnersPage.tsx`
- **What's hardcoded:** `sampleLearners[]` (10 mock learner objects)
- **What to do:** Replace with real enrollment data filtered by instructor's courses.
- **Blocked?** No — enrollment API exists

### ~~13. Instructor Notifications Page~~ — DONE
- **File:** `src/pages/instructor/InstructorNotificationsPage.tsx`
- **Status:** Already wired to `notificationApi.getAll()` with mark-read and mark-all-read mutations. No hardcoded data remaining.

### 14. Instructor Workshops Page
- **File:** `src/pages/instructor/WorkshopsPage.tsx`
- **What's hardcoded:** `sampleWorkshops[]` (6 mock workshop objects)
- **What to do:** Wire to livestream sessions API filtered by instructor.
- **Blocked?** No — livestream API exists

### 15. Instructor Workshop Details Page
- **File:** `src/pages/instructor/WorkshopDetailsPage.tsx`
- **What's hardcoded:** `sampleParticipants[]` (10 mock participants), `workshopDetail` object
- **What to do:** Wire to livestream detail + attendance API.
- **Blocked?** No

### 16. Instructor Course Preview Page
- **File:** `src/pages/instructor/CoursePreviewPage.tsx`
- **What's hardcoded:** `sampleModules[]` (2 modules + 6 lessons), `sampleReviews[]` (3 mock reviews)
- **What to do:** Replace with real course modules/sessions and reviews data.
- **Backend status:** Course reviews API now exists at `GET /api/v1/catalogue/course-reviews/?course={id}`.
- **Blocked?** No — all APIs now available

### 17. Learner Course Detail Page
- **File:** `src/pages/learner/LearnerCourseDetailPage.tsx`
- **What's hardcoded:** `sampleCourse` object (full course details)
- **What to do:** Wire to `courseApi.getById()` with enrollment status.
- **Blocked?** No — API exists

### 18. Learner Course Catalog Page — KPIs
- **File:** `src/pages/learner/LearnerCourseCatalogPage.tsx`
- **What's hardcoded:** `catalogKpis[]` (4 KPI objects)
- **What to do:** Compute KPIs from real enrollment/course data.
- **Blocked?** No

### 19. Learner Checkout Payment Page
- **File:** `src/pages/learner/CheckoutPaymentPage.tsx`
- **What's hardcoded:** `paymentMethods[]`, `countryCodes[]`, `sampleCourse` object
- **What to do:** Wire to real payment methods API and course detail from route params.
- **Blocked?** No — APIs exist

### 20. Manager Bulk Enroll Page
- **File:** `src/pages/manager/ManagerBulkEnrollPage.tsx`
- **What's hardcoded:** `courseOptions[]`, `mockHistory[]`
- **What to do:** Wire to real course list and bulk enrollment history.
- **Blocked?** Partially — backend bulk enroll endpoint is a stub

### 21. Manager Recordings Page
- **File:** `src/pages/manager/ManagerRecordingsPage.tsx`
- **What's hardcoded:** `mockRecordings[]` (3+ mock recording objects)
- **What to do:** Wire to livestream recordings API.
- **Blocked?** No — API exists

### 22. Manager Schedule New Page
- **File:** `src/pages/manager/ManagerScheduleNewPage.tsx`
- **What's hardcoded:** `mockCourses[]`, `mockInstructors[]`, `durationOptions[]`, `frequencyOptions[]`
- **What to do:** Wire courses and instructors dropdowns to real APIs.
- **Blocked?** No

### 23. Superadmin All Organizations Page
- **File:** `src/pages/superadmin/AllOrganizationsPage.tsx`
- **What's hardcoded:** `mockOrganizations[]` (3+ mock orgs)
- **What to do:** Wire to `organizationApi.getAll()`.
- **Blocked?** No — API exists

### 24. Superadmin All Users Page
- **File:** `src/pages/superadmin/AllUsersPage.tsx`
- **What's hardcoded:** `kpiStats[]` (4 KPIs), `mockUsers[]`
- **What to do:** Wire to `usersApi.getAll()` and compute KPIs from real data. `GET /api/v1/superadmin/users/stats/` now returns `{ total, active, new_this_month, suspended }` for KPIs.
- **Blocked?** No — API exists

### 25. Superadmin Payments Page
- **File:** `src/pages/superadmin/PaymentsPage.tsx`
- **What's hardcoded:** `mockTransactions[]` (4+ mock transactions)
- **What to do:** Wire to `transactionApi.getAll()`.
- **Blocked?** No — API exists

### 26. Superadmin Security Page
- **File:** `src/pages/superadmin/SecurityPage.tsx`
- **What's hardcoded:** `kpis[]` (4 security KPIs), `activeSessions[]` (8 mock sessions)
- **What to do:** Wire to real active sessions/audit data.
- **Blocked?** Partially — no dedicated security metrics endpoint

---

## CRITICAL — Public/Marketing Pages with Hardcoded Data

These render on public-facing pages visible to all visitors. Hardcoded numbers and fake courses hurt credibility.

### ~~27. Catalogue Courses Grid~~ — DONE
- **File:** `src/components/catalogue/CoursesGrid.tsx`
- **Status:** Now fetches from `publicCourseApi.getAll()` with real ratings, rating counts, and paginated total. Completed in `d42ae05`.

### 28. Catalogue Featured Categories — Fake Course Counts
- **File:** `src/components/catalogue/FeaturedCategories.tsx` (lines 13-22)
- **What's hardcoded:** 8 categories with fake course counts (e.g., "Web Development: 142 courses")
- **What to do:** Fetch from `publicCategoryApi.getAll()` and use real course counts.
- **Blocked?** No — API exists

### ~~29. Landing Page Stats Banner~~ — DONE
- **File:** `src/components/landing/StatsBanner.tsx`
- **Status:** Now fetches from `publicStatsApi.getStats()` and displays real platform metrics. Completed in `d42ae05`.

### ~~30. Landing Page Categories~~ — DONE
- **File:** `src/components/landing/Categories.tsx`
- **Status:** Now fetches from `publicCategoryApi.getAll()` with real `courses_count`. Completed in `d42ae05`.

### ~~31. Landing Page Featured Courses~~ — DONE
- **File:** `src/components/landing/Courses.tsx`
- **Status:** Now fetches from `publicCourseApi.getAll({ featured: true })` with real ratings and review counts. Completed in `d42ae05`.

### 32. Landing Page Pricing — Hardcoded Price
- **File:** `src/components/landing/Pricing.tsx` (lines 137-170)
- **What's hardcoded:** "$99 / 6 months" price and 6 feature bullet points
- **What to do:** Fetch from subscription plans API.
- **Blocked?** No — subscription API exists

### ~~33. Landing Page Trusted By~~ — DONE
- **File:** `src/components/landing/TrustedBy.tsx`
- **Status:** Now fetches from `publicClientsApi.getClients()`. Hardcoded fallback companies removed. Completed in `d42ae05`.

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

### 36. Course Reviews Component — Fake Reviews
- **File:** `src/components/course/CourseReviews.tsx` (lines 8-36)
- **What's hardcoded:** 3 fake reviews with rating distribution (78%, 15%, etc.), overall 4.8 rating
- **What to do:** Fetch from `GET /api/v1/catalogue/course-reviews/?course={id}`. Backend now has `CourseReviewViewSet` with list/create/retrieve.
- **Backend status:** Endpoint now exists. Also a summary endpoint may be available for aggregate stats.
- **Blocked?** No — backend is ready

### 37. Business Page FAQ — Static Content
- **File:** `src/components/business/FaqSection.tsx` (lines 6-31)
- **What's hardcoded:** 6 FAQ items
- **What to do:** Move to CMS or API for easy updates without code changes.
- **Blocked?** Low priority — acceptable as static for now

### 38. Course Details Page — Entire Page Hardcoded (`/course-details`)
The `CourseLandingPage` at `/course-details` is entirely static. Every child component has fake data:
- **CourseHero.tsx** — Hardcoded title ("Advanced React Patterns"), subtitle, badges ("Bestseller", "Updated Jan 2026"), category, rating (4.8), enrollment count (28,542), instructor name
- **CoursePricingCard.tsx** — Hardcoded price ($149.99 / $199.99), includes list, "30-Day Money-Back Guarantee", preview image from Unsplash
- **CourseCurriculum.tsx** — 4 hardcoded modules with fake lessons, durations, types
- **CourseObjectives.tsx** — 8 hardcoded learning objectives
- **CourseInstructor.tsx** — Hardcoded instructor "Michael Rodriguez" with fake stats (4.8 rating, 2,847 reviews, 28,542 students, 5 courses)
- **CourseReviews.tsx** — Now unblocked (see #36)
- **RelatedCourses.tsx** — 3 hardcoded courses with Unsplash/Pexels images and fake prices
- **What to do:** This page needs a `courseId` or `slug` URL param. Fetch course detail from `publicCourseApi.getById(slug)` (supports slug lookup) and pass data down to all child components. Currently takes no props or params at all.
- **Blocked?** No — course detail API exists, reviews API exists. Page needs restructuring to accept a course ID/slug.

### 39. Catalogue Filters Sidebar — Partially Done
- **File:** `src/components/catalogue/FiltersSidebar.tsx`
- **Status:** Categories now fetched from `publicCategoryApi.getAll()` (completed in `d42ae05`).
- **Still hardcoded:** `levels[]` counts (Beginner/Intermediate/Advanced with `count: 0`), price range slider.
- **What to do:** Compute level counts from course data or backend filter aggregation.

### ~~40. Catalogue Hero — Hardcoded Stats~~ — DONE
- **File:** `src/components/catalogue/CatalogueHero.tsx`
- **Status:** Now fetches from `publicStatsApi.getStats()` for stats bar + badge chip, and `publicCategoryApi.getAll()` for category dropdown. Removed `console.log` debug. Completed 17 Mar 2026.

### 41. Catalogue Pagination — Hardcoded Page Count
- **File:** `src/components/catalogue/Pagination.tsx` (line 8)
- **What's hardcoded:** `count={24}` (fixed 24 pages)
- **What to do:** Compute from total results count in paginated API response.
- **Blocked?** No

### ~~42. Public Header — No Auth-Aware State~~ — DONE
- **Files:** `src/components/landing/Header.tsx`, `src/components/landing/MobileDrawer.tsx`
- **Status:** Both now use `useAuth()`. Authenticated users see "My Dashboard" (role-based routing) + "Log Out". Unauthenticated users see original "Log In" / "Start Free Trial". Completed 17 Mar 2026.

---

## HIGH — Service Layer Stubs & TODOs

### 43. Grade Distribution API — Wire to Real Endpoints
- **File:** `src/services/learning.services.ts` (lines 309-326)
- **Issue:** `managerGradesApi.getGradeDistribution()` returns empty hardcoded structure. `managerGradesApi.getStudentGrades()` returns `[]`.
- **Comment in code:** `// TODO: Replace with actual API call when backend endpoint exists`
- **Backend status:** `GET /api/v1/learning/submissions/statistics/?course={id}` now returns `{ total_submissions, graded, pending, average_grade, distribution: [{ range, label, count, percentage }] }`.
- **What to do:** Wire `getGradeDistribution()` to the statistics endpoint. Wire `getStudentGrades()` to submissions list filtered by course.
- **Blocked?** No — backend endpoints now exist

### 44. Missing Query Parameter Support
- **Files:** Multiple service files have TODO comments about missing backend filter support:
  - `learning.services.ts` line 27: Enrollment filters (`search`, `dateRange`, `courseId`)
  - `learning.services.ts` line 62: Session progress `course` filter
  - `payments.services.ts` line 24: Invoice filters (`limit`, `page`, `date_from`, `date_to`)
  - `payments.services.ts` line 73: Transaction filters (same)
  - `catalogue.services.ts` line 41: Course filters
  - `catalogue.services.ts` line 98: Session filters
- **What to do:** Confirm which filters backend supports and wire them up.
- **Blocked?** Needs backend confirmation

### 45. QuizPlayer — Wire to Server-Side Grading
- **File:** `src/pages/learner/CoursePlayerPage.tsx` (QuizPlayer component)
- **Issue:** Quiz grading is currently done client-side. Backend now supports server-side grading.
- **Backend status:** `POST /api/v1/learning/quiz-submissions/` accepts `{ enrollment, quiz, time_spent_seconds, answers: [{ question, selected_answer }] }` and returns graded results with scores.
- **What to do:** After quiz completion, POST answers to backend and display server-returned scores instead of client-computed ones. Also wire `GET /api/v1/learning/quiz-submissions/?quiz={id}` to show past attempts.
- **Blocked?** No — backend is ready

### 46. Report Download — Wire to Async Reports
- **Files:** `src/pages/manager/ManagerReportsPage.tsx`, `src/pages/finance/FinanceExportPage.tsx`
- **Issue:** Generate button exists but download not fully implemented. Status comparison bug ("Ready" vs "ready").
- **Backend status:** Reports now generate asynchronously via Celery. `POST /api/v1/learning/reports/` triggers generation, `GET /api/v1/learning/reports/{id}/` shows status, `GET /api/v1/learning/reports/{id}/download/` returns `{ download_url, file_size }` when ready. Also `GET /api/v1/learning/reports/types/` lists available report types.
- **What to do:** Fix status comparison, implement polling or refetch for report status, wire download trigger when status = ready.
- **Blocked?** No — backend is ready

---

## MEDIUM — Incomplete UI Features

### 47. Curriculum Builder — Bulk Actions
- **File:** `src/components/instructor/course-structure/CurriculumBuilder.tsx` (line 264)
- **Issue:** "Bulk Actions" button is permanently disabled with no implementation.
- **What to do:** Implement bulk delete, bulk move, bulk status change for lessons.
- **Blocked?** No

### 48. Course Publish Flow
- **File:** `src/pages/instructor/CourseStructurePage.tsx` (line 631)
- **Comment:** `// TODO: implement publish flow`
- **What to do:** Implement status change from draft to submitted/published, trigger approval workflow.
- **Blocked?** No — approval API exists

### 49. Learner Assignment Submission UI
- **File:** `src/pages/learner/LearnerAssignmentsPage.tsx`
- **What to do:** Wire to real API, implement file upload modal for submissions using existing presign flow, wire Submit button to POST endpoint.
- **Backend dependency:** Submission endpoints exist.
- **Blocked?** No

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
Multiple pages have `console.log` statements acting as placeholder click handlers — not just debug logging. These indicate unimplemented functionality:
- `src/pages/instructor/GradebookPage.tsx:317` — `onCellClick` logs "Grade cell clicked"
- `src/pages/instructor/GradebookPage.tsx:347` — `onExport` logs "Exporting:"
- `src/pages/instructor/CoursePreviewPage.tsx:95` — "Publishing course..." (publish flow stub)
- `src/pages/instructor/CoursePreviewPage.tsx:183-197` — `onEnroll`, `onAddToCart` log stubs
- `src/pages/instructor/GradingPage.tsx:177` — "Draft saved" (no actual save)
- `src/pages/instructor/GradingPage.tsx:314-315` — file view/download stubs
- `src/pages/instructor/QuizBuilderPage.tsx:561-562` — Preview/Settings button stubs
- `src/pages/learner/LearnerCourseDetailPage.tsx:94` — "Starting preview" stub
- `src/pages/learner/LearnerCourseDetailPage.tsx:166` — "View instructor profile" stub
- `src/pages/learner/LearnerCourseDetailPage.tsx:174` — "Write review" stub
- `src/pages/learner/LearnerCourseCatalogPage.tsx:46,54,58` — enroll/browse/view stubs
- ~~`src/components/catalogue/CatalogueHero.tsx:106` — "Typing:" on search input (debug log)~~ — removed
- **What to do:** Replace each with real functionality or remove. The `onEnroll`, `onExport`, `onView` stubs are user-facing dead buttons.

### ~~53. Unread Count Badge in Sidebar~~ — DONE
- **File:** `src/components/instructor/Sidebar.tsx`
- **Status:** Instructor sidebar now fetches real unread count via `notificationApi.getUnreadCount()` (polls every 60s). Badge shows actual count instead of hardcoded `5`. Completed 17 Mar 2026.

### 54. Type Safety — `as any` Casts
Several files use `as any` to work around type mismatches. These should be fixed with proper typing:
- `src/pages/instructor/CourseCreationPage.tsx:158,172` — casting course fields for currency/duration
- `src/pages/learner/QuizzesPage.tsx:68,108-109` — casting progress/enrollment data
- `src/pages/learner/CoursePlayerPage.tsx:385` — casting ReactPlayer invocation
- `src/components/instructor/course-creation/BasicInfoSection.tsx:41,45` — casting categories/tags response
- **What to do:** Fix underlying type definitions so casts aren't needed. Most of these stem from paginated vs non-paginated response type mismatches in the service layer.

---

## Recently Completed (for reference)

| Item | Date | Commit |
|------|------|--------|
| CatalogueHero: wired stats + categories to real APIs, removed console.log | 17 Mar 2026 | — |
| ContentUploadPage: wired storage quota to `quotaApi.getQuota()` | 17 Mar 2026 | — |
| Instructor Sidebar: real unread badge via `notificationApi.getUnreadCount()` | 17 Mar 2026 | — |
| Header + MobileDrawer: auth-aware (My Dashboard / Log Out for logged-in users) | 17 Mar 2026 | — |
| Wired 6 public/landing components to real APIs (CoursesGrid, StatsBanner, Categories, Courses, TrustedBy, FiltersSidebar) | 17 Mar 2026 | `d42ae05` |
| Fixed public service types (paginated responses for categories/courses) | 17 Mar 2026 | `d42ae05` |
| Fix TypeScript build errors (3 files) | 17 Mar 2026 | `28b5fe7` |
| Drag-and-drop reordering (modules + lessons) | 16 Mar 2026 | `8ed0df3` |
| Quiz player (timer, attempts, grading, all 6 types) | 16 Mar 2026 | `8ed0df3` |
| Video resume (localStorage playback position) | 16 Mar 2026 | `8ed0df3` |
| QuizzesPage wired to real API | 16 Mar 2026 | `947ea56` |
| NotificationsPage wired to real API | 16 Mar 2026 | `947ea56` |
| Notes tab persisted to backend | 16 Mar 2026 | `947ea56` |
| Certificate/invoice download buttons | 15 Mar 2026 | `5e2d1c2` |
| Privacy policy + certificate validation pages | 14 Mar 2026 | `e3dc560` |
| Manager pages wired to real API | 13 Mar 2026 | `3fca5c3` |

---

## Backend Endpoints Now Available (previously missing)

These endpoints were added in the latest backend update and unblock frontend work:

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
