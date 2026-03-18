# TASC LMS Frontend — Pending Tasks

**Last updated:** 17 March 2026
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
- **Backend dependency:** `managerGradesApi.getGradeDistribution()` and `managerGradesApi.getStudentGrades()` in `learning.services.ts` are **stubs that return empty arrays** (lines 309-326). Backend must implement grade aggregation endpoints, OR frontend can compute grades from raw submission data.
- **Blocked?** Partially — can compute from submissions if no dedicated endpoint

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
- **Backend dependency:** Backend `bulk_import()` endpoint is a **stub** — returns dummy data, no CSV parsing implemented.
- **Blocked?** Yes — backend must implement CSV parsing first

### 7. Content Upload Page — Storage Quota
- **File:** `src/pages/instructor/ContentUploadPage.tsx`
- **What's hardcoded:** Storage info shows `used={0} total={10}` (line ~483)
- **What to do:** Query real storage quota from backend.
- **Backend dependency:** No storage quota endpoint exists.
- **Blocked?** Yes — needs backend endpoint

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
- **Blocked?** Likely — no messaging API exists

### 12. Instructor Learners Page
- **File:** `src/pages/instructor/InstructorLearnersPage.tsx`
- **What's hardcoded:** `sampleLearners[]` (10 mock learner objects)
- **What to do:** Replace with real enrollment data filtered by instructor's courses.
- **Blocked?** No — enrollment API exists

### 13. Instructor Notifications Page
- **File:** `src/pages/instructor/InstructorNotificationsPage.tsx`
- **What's hardcoded:** `sampleNotifications[]` (10 mock notification objects)
- **What to do:** Wire to `notificationApi.getAll()` (same pattern as LearnerNotificationsPage).
- **Blocked?** No — endpoint exists

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

### ~~16. Instructor Course Preview Page~~ — DONE
- **File:** `src/pages/instructor/CoursePreviewPage.tsx`
- **Status:** Now fetches real modules from `useModules({ course: id })` and reviews from `courseReviewApi.getSummary()`. Sample data removed. Uses `useCourse` for course details. Completed 18 Mar 2026.

### ~~17. Learner Course Detail Page~~ — DONE
- **File:** `src/pages/learner/LearnerCourseDetailPage.tsx`
- **Status:** Now fetches from `useCourse(courseId)` hook, modules from sessions data, and reviews from `courseReviewApi.getSummary()`. All child components wired to real API data. Sample course data and sample imports removed. Completed 18 Mar 2026.

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
- **What to do:** Wire to `usersApi.getAll()` and compute KPIs from real data.
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

### 27. Catalogue Courses Grid — Hardcoded Course Listings
- **File:** `src/components/catalogue/CoursesGrid.tsx` (lines 13-23)
- **What's hardcoded:** 9 fake courses with titles, instructors, ratings, prices. Also hardcoded "713" total results count.
- **What to do:** Fetch from `publicCourseApi.getAll()` with pagination. The API exists.
- **Blocked?** No

### 28. Catalogue Featured Categories — Fake Course Counts
- **File:** `src/components/catalogue/FeaturedCategories.tsx` (lines 13-22)
- **What's hardcoded:** 8 categories with fake course counts (e.g., "Web Development: 142 courses")
- **What to do:** Fetch from `publicCategoryApi.getAll()` and use real course counts.
- **Blocked?** No — API exists

### 29. Landing Page Stats Banner — Fake Platform Metrics
- **File:** `src/components/landing/StatsBanner.tsx` (lines 8-13)
- **What's hardcoded:** "1,000+ Courses", "50,000+ Active Learners", "200+ Instructors", "25,000+ Certificates"
- **What to do:** Fetch real counts from a public stats endpoint or compute from existing APIs.
- **Blocked?** Partially — no dedicated `/api/v1/public/stats/` endpoint exists

### 30. Landing Page Categories — Fake Course Counts
- **File:
** `src/components/landing/Categories.tsx` (lines 8-17)
- **What's hardcoded:** 8 categories with fake counts (e.g., "42 courses")
- **What to do:** Fetch from `publicCategoryApi.getAll()`.
- **Blocked?** No

### 31. Landing Page Featured Courses — Fake Courses
- **File:** `src/components/landing/Courses.tsx` (lines 19-52)
- **What's hardcoded:** 3 featured courses with fake instructors, ratings, prices
- **What to do:** Fetch from `publicCourseApi.getAll()` with `featured=true` or similar filter.
- **Blocked?** No

### 32. Landing Page Pricing — Hardcoded Price
- **File:** `src/components/landing/Pricing.tsx` (lines 137-170)
- **What's hardcoded:** "$99 / 6 months" price and 6 feature bullet points
- **What to do:** Fetch from subscription plans API.
- **Blocked?** No — subscription API exists

### 33. Landing Page Trusted By — Fake Company Names
- **File:** `src/components/landing/TrustedBy.tsx` (lines 8-14)
- **What's hardcoded:** 5 fake companies ("Acme Corp", "Global Tech", etc.)
- **What to do:** Replace with real client logos/names from CMS or API.
- **Blocked?** Yes — no clients/partners API exists

### 34. Business Page Pricing — Hardcoded Plans
- **File:** `src/components/business/PricingSection.tsx` (lines 20-76)
- **What's hardcoded:** 3 B2B pricing tiers (Team $15, Business $20, Enterprise $25) with feature lists
- **What to do:** Fetch from subscription plans API or a dedicated business pricing endpoint.
- **Blocked?** Partially — current subscription API is learner-focused

### 35. Business Page Stats — Fake Metrics
- **File:** `src/components/business/BusinessStatsSection.tsx` (lines 8-13)
- **What's hardcoded:** "500+ Enterprise Customers", "250K+ Learners", "89% Completion Rate", "4.8 Satisfaction"
- **What to do:** Fetch real metrics from backend.
- **Blocked?** Yes — no public business stats endpoint

### ~~36. Course Reviews Component — Fake Reviews~~ — DONE
- **File:** `src/components/learner/course/CourseReviews.tsx` (lines 8-36)
- **Status:** Component now accepts props for reviews and rating distribution. Sample data exports removed. Real data is passed from parent components via `courseReviewApi.getSummary()`. Completed 18 Mar 2026.

### 37. Business Page FAQ — Static Content
- **File:** `src/components/business/FaqSection.tsx` (lines 6-31)
- **What's hardcoded:** 6 FAQ items
- **What to do:** Move to CMS or API for easy updates without code changes.
- **Blocked?** Low priority — acceptable as static for now

### ~~38. Course Details Page — Entire Page Hardcoded (`/course-details`)~~ — PARTIALLY DONE
- **File:** `src/pages/public/CourseLandingPage.tsx`
- **Status (Public page):** Route changed from `/course-details` to `/course-details/:slug`. Page now fetches via `publicCourseApi.getBySlug(slug)` with loading/error states. Created `CourseDetailContext` to share data with child components. Completed 17 Mar 2026.
- **Still pending (public page child components):** CourseHero, CoursePricingCard, CourseCurriculum, CourseObjectives, CourseInstructor, RelatedCourses still render hardcoded data. Need to consume context.
- **Note:** LearnerCourseDetailPage (`/learner/course/:courseId`) is now fully wired - see #17.

### 39. Catalogue Filters Sidebar — Hardcoded Filter Options
- **File:** `src/components/catalogue/FiltersSidebar.tsx` (lines 46-59)
- **What's hardcoded:** `categories[]` (6 items with fake counts), `levels[]` (3 items with fake counts), price range slider
- **What to do:** Fetch categories from `publicCategoryApi.getAll()`, compute level counts from course data.
- **Blocked?** No

### 40. Catalogue Hero — Hardcoded Stats
- **File:** `src/components/catalogue/CatalogueHero.tsx` (lines 22-27)
- **What's hardcoded:** `stats[]` with "1,000+ Courses", "200+ Expert Instructors", "50K+ Happy Learners", "4.8 Average Rating"
- **What to do:** Fetch from public stats endpoint.
- **Blocked?** Partially — no `/api/v1/public/stats/` endpoint

### 41. Catalogue Pagination — Hardcoded Page Count
- **File:** `src/components/catalogue/Pagination.tsx` (line 8)
- **What's hardcoded:** `count={24}` (fixed 24 pages)
- **What to do:** Compute from total results count in paginated API response.
- **Blocked?** No

### 42. Public Header — No Auth-Aware State
- **Files:** `src/components/landing/Header.tsx`, `src/components/landing/MobileDrawer.tsx`
- **Issue:** Header always shows "Log In" / "Start Free Trial" buttons regardless of whether the user is authenticated. When a logged-in user visits `/`, `/courses`, `/course-details`, or `/for-business`, they see login/register buttons instead of their profile avatar, dashboard link, and role-appropriate navigation.
- **What to do:**
  - Import `useAuth()` in Header and MobileDrawer
  - If `isAuthenticated`: show profile avatar/name, "My Dashboard" link (route based on `user.role`), and "Log Out" button
  - If not authenticated: show current "Log In" / "Start Free Trial" buttons
  - Also consider showing "My Courses" link for logged-in learners
- **Blocked?** No — `useAuth()` hook and user context already exist

---

## HIGH — Service Layer Stubs & TODOs

### 43. Grade Distribution API — Stub
- **File:** `src/services/learning.services.ts` (lines 309-326)
- **Issue:** `managerGradesApi.getGradeDistribution()` returns empty hardcoded structure. `managerGradesApi.getStudentGrades()` returns `[]`.
- **Comment in code:** `// TODO: Replace with actual API call when backend endpoint exists`
- **What to do:** Wire to real backend endpoint when available.
- **Blocked?** Yes — backend endpoint does not exist

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

---

## MEDIUM — Incomplete UI Features

### 45. Curriculum Builder — Bulk Actions
- **File:** `src/components/instructor/course-structure/CurriculumBuilder.tsx` (line 264)
- **Issue:** "Bulk Actions" button is permanently disabled with no implementation.
- **What to do:** Implement bulk delete, bulk move, bulk status change for lessons.
- **Blocked?** No

### 46. Course Publish Flow
- **File:** `src/pages/instructor/CourseStructurePage.tsx` (line 631)
- **Comment:** `// TODO: implement publish flow`
- **What to do:** Implement status change from draft to submitted/published, trigger approval workflow.
- **Blocked?** No — approval API exists

### 47. Learner Assignment Submission UI
- **File:** `src/pages/learner/LearnerAssignmentsPage.tsx`
- **What to do:** Wire to real API, implement file upload modal for submissions using existing presign flow, wire Submit button to POST endpoint.
- **Backend dependency:** Submission endpoints exist.
- **Blocked?** No

### 48. Learner Certificates — Real Data
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What to do:** Remove `MOCK_CERTIFICATES` fallback, ensure download button works with real `pdf_url`.
- **Blocked?** Partially — backend PDF generation unclear

### 49. Report Download
- **Files:** `src/pages/manager/ManagerReportsPage.tsx`, `src/pages/finance/FinanceExportPage.tsx`
- **Issue:** Generate button exists but download not fully implemented. Status comparison bug ("Ready" vs "ready").
- **What to do:** Fix status comparison, wire download trigger when report status = ready.
- **Blocked?** Partially — backend report generation is synchronous stub

---

## LOW — Polish & Cleanup

### 50. Instructor Placeholder Page
- **File:** `src/pages/InstructorPlaceholderPage.tsx`
- **Issue:** Generic "under development" page used for incomplete features.
- **What to do:** Replace all references with actual implementations as features complete.

### 51. Remove Console Logs
- **File:** `src/pages/instructor/GradebookPage.tsx` (line 317)
- **Issue:** `onCellClick` handler logs "Grade cell clicked".
- **What to do:** Remove or replace with actual click handler.

### 52. Unread Count Badge in Sidebar
- **File:** Learner `Sidebar.tsx`
- **Issue:** No live unread notification count badge.
- **What to do:** Add `useQuery` for `notificationApi.getUnreadCount()` and display badge on Notifications nav item.
- **Blocked?** No — endpoint exists

---

## Recently Completed (for reference)

| Item | Date | Commit |
|------|------|--------|
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

## Backend Endpoints the Frontend Needs But Don't Exist Yet

| Endpoint | Purpose | Blocking |
|----------|---------|----------|
| `GET /api/v1/learning/grades/distribution/` | Grade histogram for gradebook analytics | GradebookPage, Analytics pages |
| `GET /api/v1/learning/grades/students/` | Student grade summary for manager view | GradebookPage |
| `POST /api/v1/learning/quiz-submissions/` | Submit quiz answers from learner | QuizPlayer (currently client-side grading) |
| `GET /api/v1/learning/analytics/enrollments/` | Enrollment trends over time | All analytics pages |
| `GET /api/v1/learning/analytics/engagement/` | Engagement metrics (time spent, DAU) | All analytics pages |
| `GET /api/v1/uploads/quota/` | Storage usage for instructor | ContentUploadPage |
| `POST /api/v1/accounts/users/bulk-import/` | CSV user import (currently stub) | ManagerBulkImportPage |
| Report generation (async) | Generate CSV/PDF reports | ManagerReportsPage |
| `GET /api/v1/public/stats/` | Platform metrics (course count, learner count, etc.) | StatsBanner.tsx, BusinessStatsSection.tsx |
| `GET /api/v1/catalogue/courses/{id}/reviews/` | Course reviews and ratings | CourseReviews.tsx, CoursePreviewPage.tsx |
| `GET /api/v1/public/clients/` | Trusted-by company logos/names | TrustedBy.tsx |
