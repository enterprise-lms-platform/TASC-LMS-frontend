# TASC LMS Frontend — Pending Tasks

**Last updated:** 18 March 2026 (late night — wired 7 more: GradebookPage, InstructorLearners, CourseReviews, QuizPlayer, Q&A tab, ReportsDownload, AllUsersKPIs)
**Repo:** `TASC-LMS-frontend`


---

## How to Use This File

This file tracks all known incomplete work in the frontend codebase. Each item includes the affected files, what's done, what's missing, and whether it's blocked by the backend. When you pick up a task, move it to the current sprint plan and mark it in progress.

---

## CRITICAL — Pages Using Hardcoded/Sample Data

These pages render but show fake data instead of real API responses. Each needs to be wired to the corresponding backend API.

### ~~1. Instructor Gradebook Page~~ — DONE
- **File:** `src/pages/instructor/GradebookPage.tsx`
- **Status:** Replaced all hardcoded `sampleStudents[]`, `sampleItems[]`, `sampleGrades[]` with real `submissionApi.getAll()` data. `buildGradebookData()` maps Submission objects to GradebookStudent/GradedItem/GradeEntry interfaces. Loading state, empty state added. Completed 18 Mar 2026.

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

### ~~6. Manager Bulk Import Page~~ — DONE
- **File:** `src/pages/manager/ManagerBulkImportPage.tsx`
- **Status:** Wired to `bulkImportApi.uploadCsv()` and `bulkImportApi.downloadTemplate()` in `superadmin.services.ts`. Drag-and-drop file upload, real CSV upload via `useMutation`, template download, success/error feedback with error details table. Column mappings updated to match backend (`email,first_name,last_name,role,department,phone_number`). Removed hardcoded import history. Completed 18 Mar 2026.

### ~~7. Content Upload Page — Storage Quota~~ — DONE
- **File:** `src/pages/instructor/ContentUploadPage.tsx`
- **Status:** Now fetches from `quotaApi.getQuota()` and converts `used_bytes`/`total_bytes` to GB for StorageInfoCard. Completed 18 Mar 2026.

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

### ~~10. CoursePlayerPage — Q&A Tab~~ — DONE
- **File:** `src/pages/learner/CoursePlayerPage.tsx`
- **Status:** Q&A tab now wired to `discussionApi.getAll()` (by session) and `discussionApi.create()` for posting new questions. Posts questions with session and course context. Resources tab still shows placeholder data (no attachments API). Completed 18 Mar 2026.

### 11. Instructor Messages Page
- **File:** `src/pages/InstructorMessagesPage.tsx`
- **What's hardcoded:** `conversations[]` array (6+ mock conversation objects)
- **What to do:** Wire to a messaging/inbox API if backend supports it, or mark as future feature.
- **Blocked?** Yes — no messaging API exists

### ~~12. Instructor Learners Page~~ — DONE
- **File:** `src/pages/instructor/InstructorLearnersPage.tsx`
- **Status:** Now fetches from `courseApi.getAll({ instructor_courses: true })`, `enrollmentApi.getAll()`, and `submissionApi.getAll()`. Computes learner stats (progress, avg score, status) from real enrollment data. Removed `sampleLearners[]`. KPI cards use real computed values. Completed 18 Mar 2026.

### ~~14. Instructor Workshops Page~~ — DONE
- **File:** `src/pages/instructor/WorkshopsPage.tsx`
- **Status:** Now fetches from `livestreamApi.getAll()` and maps sessions to workshops. Removed `sampleWorkshops` as initial state. KPI cards and tabs now use real computed values. Create form still works locally. Completed 18 Mar 2026.

### 15. Instructor Workshop Details Page
- **File:** `src/pages/instructor/WorkshopDetailsPage.tsx`
- **What's hardcoded:** `sampleParticipants[]` (10 mock participants), `workshopDetail` object
- **What to do:** Wire to livestream detail + attendance API.
- **Blocked?** No

### ~~16. Instructor Course Preview Page~~ — DONE
- **File:** `src/pages/instructor/CoursePreviewPage.tsx`
- **Status:** Now fetches real modules from `useModules({ course: id })` and reviews from `courseReviewApi.getSummary()`. Sample data removed. Uses `useCourse` for course details. Completed 18 Mar 2026.

### ~~17. Learner Course Detail Page~~ — DONE
- **File:** `src/pages/learner/LearnerCourseDetailPage.tsx`
- **Status:** Now fetches from `useCourse(courseId)` hook, modules from sessions data, and reviews from `courseReviewApi.getSummary()`. All child components wired to real API data. Sample course data and sample imports removed. Completed 18 Mar 2026.

### ~~15. Instructor Workshop Details Page~~ — DONE
- **File:** `src/pages/instructor/WorkshopDetailsPage.tsx`
- **Status:** Now fetches session details from `livestreamApi.getById(id)` and attendance from `livestreamAttendanceApi.getAll()`. Removed hardcoded `workshopDetail` object and `sampleParticipants[]`. Participants table shows real attendance data. Completed 18 Mar 2026.

### ~~18. Learner Course Catalog Page~~ — DONE
- **File:** `src/pages/learner/LearnerCourseCatalogPage.tsx`
- **Status:** Now fetches from `publicCourseApi.getAll()` and `publicCategoryApi.getAll()`. Courses grid shows real courses with proper title/instructor/rating/level mapping. KPI cards use real course count. Pagination uses real total count. Falls back to `sampleCourses` if API returns empty. Completed 18 Mar 2026.

### 19. Learner Checkout Payment Page
- **File:** `src/pages/learner/CheckoutPaymentPage.tsx`
- **What's hardcoded:** `paymentMethods[]`, `countryCodes[]`, `sampleCourse` object
- **What to do:** Wire to real payment methods API and course detail from route params.
- **Blocked?** No — APIs exist

### ~~20. Manager Bulk Enroll Page~~ — PARTIALLY DONE
- **File:** `src/pages/manager/ManagerBulkEnrollPage.tsx`
- **Status:** Course dropdown now wired to `courseApi.getAll()`. `mockHistory[]` remains (no bulk enrollment history API). Completed 18 Mar 2026.

### ~~21. Manager Recordings Page~~ — DONE
- **File:** `src/pages/manager/ManagerRecordingsPage.tsx`
- **Status:** Now fetches from `livestreamApi.getAll()` and filters sessions with `recording_url` to show recordings. Course filter dynamically built from real session data. Removed `mockRecordings[]` and `courseOptions[]`. Completed 18 Mar 2026.

### ~~22. Manager Schedule New Page~~ — DONE
- **File:** `src/pages/manager/ManagerScheduleNewPage.tsx`
- **Status:** Course dropdown wired to `courseApi.getAll()`. Instructor dropdown wired to `usersApi.getAll({ role: 'instructor' })`. Removed `mockCourses[]` and `mockInstructors[]`. Completed 18 Mar 2026.

### ~~23. Superadmin All Organizations Page~~ — DONE
- **File:** `src/pages/superadmin/AllOrganizationsPage.tsx`
- **Status:** Already wired to `organizationApi.getAll()`. Removed unused `mockOrganizations[]`. KPI cards compute from real data. Completed 18 Mar 2026.

### ~~24. Superadmin All Users Page~~ — DONE
### ~~24. Superadmin All Users Page~~ — DONE
- **File:** `src/pages/superadmin/AllUsersPage.tsx`
- **Status:** Was already mostly wired to `usersApi.getAll()`. Removed dead outer `kpiStats[]` and `mockUsers[]` (shadowed by inner API-driven code). Added `userStatsApi.getStats()` for KPIs (total, active, new_this_month). Completed 18 Mar 2026.
- **Status:** Already wired to `usersApi.getAll()`. Removed unused `mockUsers[]` and duplicate `kpiStats[]` hardcoded values. KPIs now computed from real data. Completed 18 Mar 2026.

### ~~25. Superadmin Payments Page~~ — DONE
- **File:** `src/pages/superadmin/PaymentsPage.tsx`
- **Status:** Now fetches from `transactionApi.getAll()`. KPI cards computed from real transaction data (total count, completed revenue, pending revenue, failed count). Table shows real transactions with proper status/method formatting. Filters work on real data. Removed `mockTransactions[]`. Completed 18 Mar 2026.

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

### ~~36. Course Reviews Component~~ — DONE
- **File:** `src/components/course/CourseReviews.tsx`
- **Status:** Already fetched from `courseReviewApi.getSummary()`. Removed hardcoded fallback reviews (3 fake reviews). Now shows empty state when no reviews. Completed 18 Mar 2026.
### ~~36. Course Reviews Component — Fake Reviews~~ — DONE
- **File:** `src/components/learner/course/CourseReviews.tsx` (lines 8-36)
- **Status:** Component now accepts props for reviews and rating distribution. Sample data exports removed. Real data is passed from parent components via `courseReviewApi.getSummary()`. Completed 18 Mar 2026.

### 37. Business Page FAQ — Static Content
- **File:** `src/components/business/FaqSection.tsx` (lines 6-31)
- **What's hardcoded:** 6 FAQ items
- **What to do:** Move to CMS or API for easy updates without code changes.
- **Blocked?** Low priority — acceptable as static for now

### 38. Course Details Page — Partially Done (page-level wiring complete)
- **File:** `src/pages/public/CourseLandingPage.tsx`
- **Status:** Route changed from `/course-details` to `/course-details/:slug`. Page now fetches via `publicCourseApi.getBySlug(slug)` with loading/error states. Created `CourseDetailContext` to share data with child components. Updated CourseCard and Courses.tsx links to use slug-based URLs. `courseId` prop now passed to CourseReviews. Completed 18 Mar 2026.
- **Still pending:** Child components (CourseHero, CoursePricingCard, CourseCurriculum, CourseObjectives, CourseInstructor, RelatedCourses) still render hardcoded data. Each needs to consume `useCourseDetail()` context and display real data. This is a separate task per component.
### ~~38. Course Details Page — Entire Page Hardcoded (`/course-details`)~~ — PARTIALLY DONE
- **File:** `src/pages/public/CourseLandingPage.tsx`
- **Status (Public page):** Route changed from `/course-details` to `/course-details/:slug`. Page now fetches via `publicCourseApi.getBySlug(slug)` with loading/error states. Created `CourseDetailContext` to share data with child components. Completed 17 Mar 2026.
- **Still pending (public page child components):** CourseHero, CoursePricingCard, CourseCurriculum, CourseObjectives, CourseInstructor, RelatedCourses still render hardcoded data. Need to consume context.
- **Note:** LearnerCourseDetailPage (`/learner/course/:courseId`) is now fully wired - see #17.

### 39. Catalogue Filters Sidebar — Partially Done
- **File:** `src/components/catalogue/FiltersSidebar.tsx`
- **Status:** Categories now fetched from `publicCategoryApi.getAll()` (completed in `d42ae05`).
- **Still hardcoded:** `levels[]` counts (Beginner/Intermediate/Advanced with `count: 0`), price range slider.
- **What to do:** Compute level counts from course data or backend filter aggregation.

### ~~40. Catalogue Hero — Hardcoded Stats~~ — DONE
- **File:** `src/components/catalogue/CatalogueHero.tsx`
- **Status:** Now fetches from `publicStatsApi.getStats()` for stats bar + badge chip, and `publicCategoryApi.getAll()` for category dropdown. Removed `console.log` debug. Completed 18 Mar 2026.

### 41. Catalogue Pagination — Hardcoded Page Count
- **File:** `src/components/catalogue/Pagination.tsx` (line 8)
- **What's hardcoded:** `count={24}` (fixed 24 pages)
- **What to do:** Compute from total results count in paginated API response.
- **Blocked?** No

### ~~42. Public Header — No Auth-Aware State~~ — DONE
- **Files:** `src/components/landing/Header.tsx`, `src/components/landing/MobileDrawer.tsx`
- **Status:** Both now use `useAuth()`. Authenticated users see "My Dashboard" (role-based routing) + "Log Out". Unauthenticated users see original "Log In" / "Start Free Trial". Completed 18 Mar 2026.

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

### ~~45. QuizPlayer — Wire to Server-Side Grading~~ — Partially Done
- **File:** `src/components/learner/quiz-player/QuizPlayer.tsx`
- **Status:** Added `quizSubmissionApi.submit()` call on quiz completion. Client-side grading still runs for immediate feedback, but answers are also POSTed to `POST /api/v1/learning/quiz-submissions/` for server-side record keeping. Added `quizSubmissionApi` to `learning.services.ts`. Completed 18 Mar 2026.
- **Still pending:** Display server-returned scores instead of client-computed ones. Wire `GET /api/v1/learning/quiz-submissions/?quiz={id}` for past attempts.

### ~~46. Report Download — Wire to Async Reports~~ — Partially Done
- **Files:** `src/pages/manager/ManagerReportsPage.tsx`
- **Status:** Fixed status comparison bug (`'Ready'` → `'ready'`). Download button now calls `reportsApi.download(report.id)` and opens `download_url` in new tab. Completed 18 Mar 2026.
- **Still pending:** FinanceExportPage not yet updated. No polling/refetch for report status during generation. No progress indicator while report generates.

---

## MEDIUM — Incomplete UI Features

### 47. Curriculum Builder — Bulk Actions
- **File:** `src/components/instructor/course-structure/CurriculumBuilder.tsx` (line 264)
- **Issue:** "Bulk Actions" button is permanently disabled with no implementation.
- **What to do:** Implement bulk delete, bulk move, bulk status change for lessons.
- **Blocked?** No

### ~~48. Course Publish Flow~~ — DONE
- **File:** `src/pages/instructor/CourseStructurePage.tsx`
- **Status:** `handlePublish()` now uses `useSubmitCourseForApproval()` hook with confirmation dialog, success snackbar, and error handling via `FeedbackSnackbar`. Completed 18 Mar 2026.

### ~~49. Learner Assignment Submission UI~~ — Partially Done
- **File:** `src/pages/learner/LearnerAssignmentsPage.tsx`
- **Status:** Replaced all hardcoded data (`kpis[]`, `assignments[]`) with real `submissionApi.getAll()` fetch. KPIs computed from live data. Status mapping, grade labels, loading state all wired. Completed 18 Mar 2026.
- **Still pending:** Submit/Late Submit buttons don't yet open a file upload modal — need file picker + presign upload flow for actual submission creation via `useCreateSubmission()`.

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
- ~~`src/components/catalogue/CatalogueHero.tsx:106` — "Typing:" on search input (debug log)~~ — removed
- **What to do:** Replace each with real functionality or remove. The `onEnroll`, `onExport`, `onView` stubs are user-facing dead buttons.

### ~~53. Unread Count Badge in Sidebar~~ — DONE
- **File:** `src/components/instructor/Sidebar.tsx`
- **Status:** Instructor sidebar now fetches real unread count via `notificationApi.getUnreadCount()` (polls every 60s). Badge shows actual count instead of hardcoded `5`. Completed 18 Mar 2026.

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
| GradebookPage: replaced all sample data with `submissionApi.getAll()` | 18 Mar 2026 | — |
| InstructorLearnersPage: replaced sampleLearners with `enrollmentApi.getAll()` + groupByLearner | 18 Mar 2026 | — |
| CourseReviews: removed hardcoded fallback reviews, empty state added | 18 Mar 2026 | — |
| QuizPlayer: added server-side submission via `quizSubmissionApi.submit()` | 18 Mar 2026 | — |
| CoursePlayerPage Q&A: wired to `discussionApi`, removed sampleQuestions | 18 Mar 2026 | — |
| ManagerReportsPage: fixed status bug + wired download handler | 18 Mar 2026 | — |
| AllUsersPage: removed dead mockUsers, added `userStatsApi` for KPIs | 18 Mar 2026 | — |
| Course publish flow: `handlePublish()` wired to `useSubmitCourseForApproval()` | 18 Mar 2026 | — |
| Learner assignments: replaced hardcoded data with `submissionApi.getAll()` | 18 Mar 2026 | — |
| Bulk import: drag-drop CSV upload + template download via `bulkImportApi` | 18 Mar 2026 | — |
| Course details page: slug route, `publicCourseApi.getBySlug()`, CourseDetailContext | 18 Mar 2026 | — |
| CatalogueHero: wired stats + categories to real APIs, removed console.log | 18 Mar 2026 | — |
| ContentUploadPage: wired storage quota to `quotaApi.getQuota()` | 18 Mar 2026 | — |
| Instructor Sidebar: real unread badge via `notificationApi.getUnreadCount()` | 18 Mar 2026 | — |
| Header + MobileDrawer: auth-aware (My Dashboard / Log Out for logged-in users) | 18 Mar 2026 | — |
| Wired 6 public/landing components to real APIs (CoursesGrid, StatsBanner, Categories, Courses, TrustedBy, FiltersSidebar) | 18 Mar 2026 | `d42ae05` |
| Fixed public service types (paginated responses for categories/courses) | 18 Mar 2026 | `d42ae05` |
| Dev auth bypass: skip 401→login redirects in all loaders + axios interceptor | 17 Mar 2026 | `87ae8b5` |
| Fix TypeScript build errors (3 files) | 18 Mar 2026 | `28b5fe7` |
| LearnerCourseCatalogPage wired to `publicCourseApi.getAll()` + `publicCategoryApi.getAll()` | 18 Mar 2026 | — |
| CoursePlayerPage Q&A wired to `discussionApi` (list + create) | 18 Mar 2026 | — |
| WorkshopDetailsPage wired to `livestreamApi.getById()` + `livestreamAttendanceApi` | 18 Mar 2026 | — |
| ManagerRecordingsPage wired to `livestreamApi.getAll()` (sessions with recordings) | 18 Mar 2026 | — |
| ManagerScheduleNewPage wired to `courseApi` + `usersApi` for dropdowns | 18 Mar 2026 | — |
| ManagerBulkEnrollPage course dropdown wired to `courseApi` | 18 Mar 2026 | — |
| Superadmin PaymentsPage fully wired to `transactionApi` | 18 Mar 2026 | — |
| Superadmin AllOrganizationsPage: removed unused mock data, KPIs computed from real API | 18 Mar 2026 | — |
| Superadmin AllUsersPage: removed unused mock data, KPIs computed from real API | 18 Mar 2026 | — |
| Instructor WorkshopsPage wired to `livestreamApi.getAll()` | 18 Mar 2026 | — |
| Instructor LearnersPage wired to `enrollmentApi` + `courseApi` + `submissionApi` | 18 Mar 2026 | — |
| FinanceAnalyticsPage fully wired to `transactionApi`, `invoiceApi`, `userSubscriptionApi` | 18 Mar 2026 | — |
| ManagerAnalyticsPage: KPIs/top courses wired, charts need backend | 18 Mar 2026 | — |
| InstructorAnalyticsPage: KPIs/course perf wired, charts need backend | 18 Mar 2026 | — |
| LearnerCourseDetailPage fully wired to real API (course, modules, reviews) | 18 Mar 2026 | — |
| CoursePreviewPage wired to real modules and reviews API | 18 Mar 2026 | — |
| CourseReviews component: removed sample data, accepts real props | 18 Mar 2026 | — |
| CourseCurriculum, WhatYouLearn, CourseRequirements, CourseInstructor: removed sample data | 18 Mar 2026 | — |
| Created `usePublicCourse` hook for course reviews API | 18 Mar 2026 | — |
| Course publish flow wired to `useSubmitCourseForApproval()` | 17 Mar 2026 | — |
| Learner assignments wired to `submissionApi.getAll()` | 17 Mar 2026 | — |
| Bulk import wired to `bulkImportApi` with drag-drop upload | 17 Mar 2026 | — |
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
