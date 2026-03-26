# TASC LMS Frontend — Pending Tasks

**Last updated:** 27 March 2026
**Repo:** `TASC-LMS-frontend`

---

## Accurate Status Summary

### What's COMPLETE (recently wired to API):
- ✅ CoursePlayerPage Q&A — discussionApi
- ✅ Instructor WorkshopsPage — livestreamApi
- ✅ Instructor LearnersPage — enrollmentApi + courseApi + submissionApi
- ✅ Instructor CoursePreviewPage — useModules + courseReviewApi
- ✅ LearnerCourseDetailPage — course API + modules + reviews
- ✅ ManagerRecordingsPage — livestreamApi
- ✅ ManagerScheduleNewPage — courseApi + usersApi
- ✅ ManagerBulkEnrollPage — courseApi
- ✅ Superadmin PaymentsPage — transactionApi
- ✅ Superadmin AllOrganizationsPage — organizationApi
- ✅ Superadmin AllUsersPage — usersApi
- ✅ FinanceAnalyticsPage — transactionApi + invoiceApi + userSubscriptionApi
- ✅ CourseReviews — courseReviewApi
- ✅ CourseCurriculum, WhatYouLearn, CourseRequirements, CourseInstructor

---

## REAL Issues Remaining

### HIGH PRIORITY

#### ~~1. Bulk Import CSV Format Mismatch~~ ✅ DONE [26 Mar]

**File:** `src/pages/manager/ManagerBulkImportPage.tsx`

**Fix:** Backend updated to accept both frontend CSV format (`full_name`, `email_address`, `user_role`) and standard format. Manager-imported users auto-scoped to manager's organization.

---

#### 2. StatsBanner — Loading State

**File:** `src/components/landing/StatsBanner.tsx`

**Status:** ✅ Already wired to `publicStatsApi.getStats()`

**Note:** Works correctly when backend `/api/v1/public/stats/` returns real data. Shows "..." while loading.

---

### MEDIUM PRIORITY — Marketing/Landing Pages

#### 3. TrustedBy — Empty Logo URLs

**File:** `src/components/landing/TrustedBy.tsx`

**Problem:** Backend returns hardcoded names with empty `logo_url`.

**Frontend Status:** ✅ Wired to `publicClientsApi.getClients()`

**Fix Required:** Backend needs real TrustedClient model/data.

---

#### 4. Landing Page Categories

**File:** `src/components/landing/Categories.tsx`

**Problem:** Hardcoded 8 categories with fake counts.

**Status:** ✅ API exists (`publicCategoryApi.getAll()`)

**Fix:** Fetch real categories, compute real counts.

---

#### 5. Landing Page Featured Courses

**File:** `src/components/landing/Courses.tsx`

**Problem:** Hardcoded 3 featured courses.

**Status:** ✅ API exists (`publicCourseApi.getAll({ featured: true })`)

**Fix:** Fetch real featured courses.

---

#### 6. Landing Page Pricing

**File:** `src/components/landing/Pricing.tsx`

**Problem:** Hardcoded "$99 / 6 months" price.

**Status:** ⚠️ Subscription API exists but not wired here.

**Fix:** Fetch from `subscriptionApi.getAll()`.

---

#### 7. Business Page Components

**Files:** 
- `src/components/business/PricingSection.tsx`
- `src/components/business/BusinessStatsSection.tsx`
- `src/components/business/FaqSection.tsx`

**Problem:** Hardcoded B2B pricing, stats, and FAQ.

**Fix:** Fetch pricing plans, real business metrics, FAQ from API/CMS.

---

### MEDIUM PRIORITY — Analytics Pages

#### ~~8. Manager Analytics Page — Charts~~ ✅ DONE [26 Mar]

**File:** `src/pages/manager/ManagerAnalyticsPage.tsx`

**Status:** ✅ KPIs and charts wired to `useLearningStats`, `useEnrollmentTrends`, `useCoursesByCategory`, `useRevenueTrends` hooks.

---

#### ~~9. Instructor Analytics Page — Charts~~ ✅ DONE [26 Mar]

**File:** `src/pages/instructor/InstructorAnalyticsPage.tsx`

**Status:** ✅ KPIs wired to `useLearningStats` hook. Course performance computed from real enrollment data.

---

#### 10. Superadmin Analytics Page

**File:** `src/pages/superadmin/AnalyticsPage.tsx`

**Status:** Hardcoded platform-wide metrics.

**Fix:** Needs cross-org aggregation endpoints from backend.

---

### LOW PRIORITY

#### 11. Gradebook Page — Student Grades

**File:** `src/pages/instructor/GradebookPage.tsx`

**Status:** ✅ Wired to `submissionApi` and `gradeStatisticsApi`

**Note:** Uses client-side computation for student grade matrix.

---

#### 12. Content Upload Page — Storage Quota

**File:** `src/pages/instructor/ContentUploadPage.tsx`

**Status:** ✅ `StorageInfoCard` uses `quotaApi.getQuota()` (but may show 0 until real uploads)

**Backend:** ✅ `/api/v1/uploads/quota/` exists

---

#### ~~13. Manager Bulk Import Page~~ ✅ DONE [26 Mar]

**File:** `src/pages/manager/ManagerBulkImportPage.tsx`

**Status:** ✅ Upload wired to backend. Backend accepts both CSV formats. Hardcoded mock import history removed.

---

#### ~~14. Instructor Messages Page~~ ✅ DONE [25 Mar]

**File:** `src/pages/InstructorMessagesPage.tsx`

**Status:** ✅ Fully wired to `messagingApi` — real conversations, messages, send, mark_read, 5s polling.

---

#### 15. Superadmin Security Page

**File:** `src/pages/superadmin/SecurityPage.tsx`

**Status:** Hardcoded KPIs and active sessions.

**Fix:** Wire to audit log API and user session tracking.

---

#### 16. Learner Certificates Page

**File:** `src/pages/learner/LearnerCertificatesPage.tsx`

**Status:** ✅ API wired. Mock fallback exists if API returns empty.

**Note:** Backend creates certificate records but PDF generation is stubbed.

---

#### 17. Report Download

**Files:** 
- `src/pages/manager/ManagerReportsPage.tsx`
- `src/pages/finance/FinanceExportPage.tsx`

**Status:** Generate button exists. Download wired to backend `/download/` endpoint.

**Note:** Reports are async — requires Celery worker running.

---

## Components Still Showing Hardcoded Data

### Landing/Marketing Pages
| Component | File | Priority |
|-----------|------|----------|
| TrustedBy | `components/landing/TrustedBy.tsx` | HIGH (backend issue) |
| Categories | `components/landing/Categories.tsx` | MEDIUM |
| Featured Courses | `components/landing/Courses.tsx` | MEDIUM |
| Pricing | `components/landing/Pricing.tsx` | MEDIUM |
| Business Stats | `components/business/BusinessStatsSection.tsx` | MEDIUM |
| Business Pricing | `components/business/PricingSection.tsx` | MEDIUM |
| FAQ | `components/business/FaqSection.tsx` | LOW |

### Catalogue Pages
| Component | File | Priority |
|-----------|------|----------|
| CoursesGrid | `components/catalogue/CoursesGrid.tsx` | MEDIUM |
| FeaturedCategories | `components/catalogue/FeaturedCategories.tsx` | MEDIUM |
| FiltersSidebar | `components/catalogue/FiltersSidebar.tsx` | MEDIUM |
| CatalogueHero | `components/catalogue/CatalogueHero.tsx` | LOW |
| Pagination | `components/catalogue/Pagination.tsx` | LOW |

### Dashboard Pages
| Page | File | Priority |
|------|------|----------|
| ~~Manager Analytics~~ | `pages/manager/ManagerAnalyticsPage.tsx` | ✅ DONE |
| ~~Instructor Analytics~~ | `pages/instructor/InstructorAnalyticsPage.tsx` | ✅ DONE |
| Superadmin Analytics | `pages/superadmin/AnalyticsPage.tsx` | MEDIUM |

---

## Implementation Plan

### Sprint 1: Critical Fixes
1. ~~Fix CSV format mismatch in bulk import~~ ✅
2. Wire marketing pages to existing APIs

### Sprint 2: Data Completeness
3. Fetch real categories, featured courses, pricing
4. Remove remaining mock fallbacks

### Sprint 3: Polish
5. ~~Analytics charts — backend endpoints~~ ✅ (Manager + Instructor done; Superadmin remaining)
6. Security page wiring
7. Remove all console.log statements

---

## Backend Dependencies Summary

| Frontend Need | Backend Status | Endpoint |
|--------------|----------------|----------|
| Public Stats | ✅ Working | `/api/v1/public/stats/` |
| Trusted Clients | ⚠️ Stubbed | `/api/v1/public/clients/` |
| Storage Quota | ✅ Working | `/api/v1/uploads/quota/` |
| Grade Statistics | ✅ Working | `/api/v1/learning/submissions/statistics/` |
| Bulk Import | ✅ Working (both formats) | `/api/v1/admin/users/bulk_import/` |
| CSV Template | ✅ Working | `/api/v1/admin/users/csv_template/` |
| Enrollment Trends | ✅ Working | `/api/v1/learning/analytics/enrollment-trends/` |
| Learning Stats | ✅ Working | `/api/v1/learning/analytics/learning-stats/` |
| Revenue Trends | ✅ Working | `/api/v1/payments/analytics/revenue/` |
| Courses by Category | ✅ Working | `/api/v1/catalogue/analytics/courses-by-category/` |
| Reports | ✅ Working (async) | `/api/v1/learning/reports/` |

---

## Completed Items (Reference)

| Date | Item |
|------|------|
| 18 Mar 2026 | CoursePlayerPage Q&A wired |
| 18 Mar 2026 | Instructor WorkshopsPage wired |
| 18 Mar 2026 | Instructor LearnersPage wired |
| 18 Mar 2026 | Instructor CoursePreviewPage wired |
| 18 Mar 2026 | LearnerCourseDetailPage wired |
| 18 Mar 2026 | ManagerRecordingsPage wired |
| 18 Mar 2026 | ManagerScheduleNewPage wired |
| 18 Mar 2026 | ManagerBulkEnrollPage wired |
| 18 Mar 2026 | Superadmin PaymentsPage wired |
| 18 Mar 2026 | FinanceAnalyticsPage wired |
| 18 Mar 2026 | CourseReviews wired |
| 17 Mar 2026 | Course publish flow wired |
| 17 Mar 2026 | Learner assignments wired |
| 17 Mar 2026 | Bulk import drag-drop wired |
| 16 Mar 2026 | Drag-and-drop reordering |
| 16 Mar 2026 | Quiz player (timer, attempts, grading) |
| 16 Mar 2026 | Video resume |
| 16 Mar 2026 | QuizzesPage wired |
| 16 Mar 2026 | NotificationsPage wired |
| 16 Mar 2026 | Notes tab persisted |
| 15 Mar 2026 | Certificate/invoice download |
| 14 Mar 2026 | Privacy policy + cert validation |
| 13 Mar 2026 | Manager pages wired |
| 25 Mar 2026 | InstructorMessagesPage wired to real messaging API |
| 26 Mar 2026 | CoursePlayerPage Q&A: Pin/Lock badges + moderator action buttons wired to `discussionApi.pin()`/`lock()` |
| 26 Mar 2026 | LearnerAssignmentsPage: Backend validation errors (max attempts, file types) parsed and shown as toast messages |
| 26 Mar 2026 | `DiscussionParams` search param added, `SubmissionSerializer` `attempt_number` field exposed |
| 26 Mar 2026 | Bulk Import CSV format mismatch fixed — backend accepts both frontend and standard CSV formats |
| 26 Mar 2026 | Manager Analytics charts wired to `useEnrollmentTrends`, `useLearningStats`, `useCoursesByCategory`, `useRevenueTrends` |
| 26 Mar 2026 | Instructor Analytics KPIs wired to `useLearningStats`; course performance from real enrollments |
| 26 Mar 2026 | Finance `RevenueChart` wired to `useRevenueTrends` — replaces hardcoded bar chart data |
