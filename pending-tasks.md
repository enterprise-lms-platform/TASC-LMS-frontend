# TASC LMS Frontend — Pending Tasks

**Last updated:** 16 March 2026
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

---

## HIGH — Service Layer Stubs & TODOs

### 11. Grade Distribution API — Stub
- **File:** `src/services/learning.services.ts` (lines 309-326)
- **Issue:** `managerGradesApi.getGradeDistribution()` returns empty hardcoded structure. `managerGradesApi.getStudentGrades()` returns `[]`.
- **Comment in code:** `// TODO: Replace with actual API call when backend endpoint exists`
- **What to do:** Wire to real backend endpoint when available.
- **Blocked?** Yes — backend endpoint does not exist

### 12. Missing Query Parameter Support
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

### 13. Curriculum Builder — Bulk Actions
- **File:** `src/components/instructor/course-structure/CurriculumBuilder.tsx` (line 264)
- **Issue:** "Bulk Actions" button is permanently disabled with no implementation.
- **What to do:** Implement bulk delete, bulk move, bulk status change for lessons.
- **Blocked?** No

### 14. Course Publish Flow
- **File:** `src/pages/instructor/CourseStructurePage.tsx` (line 631)
- **Comment:** `// TODO: implement publish flow`
- **What to do:** Implement status change from draft to submitted/published, trigger approval workflow.
- **Blocked?** No — approval API exists

### 15. Learner Assignment Submission UI
- **File:** `src/pages/learner/LearnerAssignmentsPage.tsx`
- **What to do:** Wire to real API, implement file upload modal for submissions using existing presign flow, wire Submit button to POST endpoint.
- **Backend dependency:** Submission endpoints exist.
- **Blocked?** No

### 16. Learner Certificates — Real Data
- **File:** `src/pages/learner/LearnerCertificatesPage.tsx`
- **What to do:** Remove `MOCK_CERTIFICATES` fallback, ensure download button works with real `pdf_url`.
- **Blocked?** Partially — backend PDF generation unclear

### 17. Report Download
- **Files:** `src/pages/manager/ManagerReportsPage.tsx`, `src/pages/finance/FinanceExportPage.tsx`
- **Issue:** Generate button exists but download not fully implemented. Status comparison bug ("Ready" vs "ready").
- **What to do:** Fix status comparison, wire download trigger when report status = ready.
- **Blocked?** Partially — backend report generation is synchronous stub

---

## LOW — Polish & Cleanup

### 18. Instructor Placeholder Page
- **File:** `src/pages/InstructorPlaceholderPage.tsx`
- **Issue:** Generic "under development" page used for incomplete features.
- **What to do:** Replace all references with actual implementations as features complete.

### 19. Remove Console Logs
- **File:** `src/pages/instructor/GradebookPage.tsx` (line 317)
- **Issue:** `onCellClick` handler logs "Grade cell clicked".
- **What to do:** Remove or replace with actual click handler.

### 20. Unread Count Badge in Sidebar
- **File:** Learner `Sidebar.tsx`
- **Issue:** No live unread notification count badge.
- **What to do:** Add `useQuery` for `notificationApi.getUnreadCount()` and display badge on Notifications nav item.
- **Blocked?** No — endpoint exists

---

## Recently Completed (for reference)

| Item | Date | Commit |
|------|------|--------|
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
