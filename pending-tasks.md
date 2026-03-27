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
- ✅ ManagerBulkEnrollPage — courseApi + enrollmentApi.bulkEnroll() + user selection UI
- ✅ Superadmin PaymentsPage — transactionApi
- ✅ Superadmin AllOrganizationsPage — organizationApi
- ✅ Superadmin AllUsersPage — usersApi
- ✅ FinanceAnalyticsPage — transactionApi + invoiceApi + userSubscriptionApi
- ✅ CourseReviews — courseReviewApi
- ✅ CourseCurriculum, WhatYouLearn, CourseRequirements, CourseInstructor
- ✅ CoursePlayerPage Resources tab — sessionAttachmentApi (mock data removed)

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

#### ~~4. Landing Page Categories~~ ✅ DONE

**File:** `src/components/landing/Categories.tsx`

**Problem:** Hardcoded 8 categories with fake counts.

**Status:** ✅ API exists (`publicCategoryApi.getAll()`)

**Fix:** ✅ Already wired to `publicCategoryApi.getAll()` + `publicCourseApi.getAll()` with real `courses_count` computation via `useMemo`.

---

#### ~~5. Landing Page Featured Courses~~ ✅ DONE

**File:** `src/components/landing/Courses.tsx`

**Problem:** Hardcoded 3 featured courses.

**Status:** ✅ API exists (`publicCourseApi.getAll({ featured: true })`)

**Fix:** ✅ Already wired to `publicCourseApi.getAll()` via `useQuery`.

---

#### ~~6. Landing Page Pricing~~ ✅ DONE

**File:** `src/components/landing/Pricing.tsx`

**Problem:** Hardcoded "$99 / 6 months" price.

**Status:** ✅ Wired to `publicSubscriptionPlansApi.getAll()` via `useQuery`.

**Fix:** ✅ Already fetching real subscription plans.

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
| ~~Categories~~ | `components/landing/Categories.tsx` | ✅ DONE |
| ~~Featured Courses~~ | `components/landing/Courses.tsx` | ✅ DONE |
| ~~Pricing~~ | `components/landing/Pricing.tsx` | ✅ DONE |
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
| Page | File | Status / Unwired Elements |
|------|------|---------------------------|
| Superadmin Analytics | `pages/superadmin/AnalyticsPage.tsx` | Partially wired; uses many fallback/mock metrics |
| Welcome Banner | `components/superadmin/WelcomeBanner.tsx` | "Export Report", "System Settings" buttons unwired |
| Revenue Chart | `components/superadmin/RevenueChart.tsx` | "Export", "Filter" buttons unwired; uses mock data |
| Organizations Table | `components/superadmin/OrganizationsTable.tsx` | "Delete" icons unwired |
| System Health | `components/superadmin/SystemHealth.tsx` | "Refresh", "View Logs" buttons unwired; uses mock data |
| All Users | `pages/superadmin/AllUsersPage.tsx` | "Add User", "Bulk Import" buttons unwired; Edit/Delete icons unwired |
| Roles & Permissions | `pages/superadmin/RolesPermissionsPage.tsx` | **Entirely Mock Data**; All buttons unwired |
| Audit Logs | `pages/superadmin/AuditLogsPage.tsx` | "View" action icon unwired |
| All Organizations | `pages/superadmin/AllOrganizationsPage.tsx` | Action icons (View, Edit, Delete) unwired |
| Add Organization | `pages/superadmin/AddOrganizationPage.tsx` | Form submission unwired |
| Partnerships | `pages/superadmin/PartnershipsPage.tsx` | **Entirely Mock Data**; All buttons unwired |
| All Courses | `pages/superadmin/AllCoursesPage.tsx` | **Entirely Mock Data**; Action buttons unwired |
| Instructors | `pages/superadmin/InstructorsPage.tsx` | **Entirely Mock Data**; Action buttons unwired |
| Certifications | `pages/superadmin/CertificationsPage.tsx` | **Entirely Mock Data**; Action buttons unwired |
| Assessments | `pages/superadmin/AssessmentsPage.tsx` | **Entirely Mock Data**; Action buttons unwired |
| Payments | `pages/superadmin/PaymentsPage.tsx` | "View" action icon unwired |
| Revenue Reports | `pages/superadmin/RevenuePage.tsx` | **Entirely Mock Data**; Export buttons unwired |
| Invoices | `pages/superadmin/InvoicesPage.tsx` | **Entirely Mock Data**; Search, Date, Action icons unwired |
| Gateway Settings | `pages/superadmin/GatewaySettingsPage.tsx` | **Static Placeholders**; Configure, Save, Test buttons unwired |
| System Settings | `pages/superadmin/SystemSettingsPage.tsx` | **Static Placeholders**; Save, Activate buttons unwired |
| Integrations | `pages/superadmin/IntegrationsPage.tsx` | **Entirely Mock Data**; All action buttons/switches unwired |
| Data Migration | `pages/superadmin/DataMigrationPage.tsx` | **Entirely Mock Data**; Retry, Run, Test, Save buttons unwired |
| Security | `pages/superadmin/SecurityPage.tsx` | **Entirely Mock Data**; Save, Terminate, Delete buttons unwired |
| Superadmin Profile | `pages/superadmin/SuperadminProfilePage.tsx` | ✅ Fully wired (Profile + Password) |
| Invite User | `pages/superadmin/InviteUserPage.tsx` | ✅ Fully wired |
| Course Approvals | `pages/manager/CourseApprovalPage.tsx` | ✅ Fully wired |

---

### Manager Interface Audit (Comprehensive)

**Audit Date:** March 27, 2026
**Scope:** 30+ Manager-specific pages.

#### 1. Fully Wired & Functional (Verified)
- `ManagerCategoriesPage`: Functional CRUD for categories.
- `ManagerInviteUserPage`: Functional invite system.
- `ManagerReportsPage`: Functional data fetching.
- `ManagerUsersPage`: Functional user management.
- `ManagerProfilePage`: Functional profile updates.
- `ManagerCertificatesPage`: Functional certificate management.
- `ManagerGradebookPage`: Functional viewing.
- `ManagerNotificationsPage`: Functional notifications and status updates.
- `CourseApprovalPage`: Functional list and shared logic.
- `CourseApprovalDetailPage`: Functional detail viewing and actions.
- `QuizBuilderPage` (Shared): Fully functional quiz authoring.
- `AssignmentCreationPage` (Shared): Fully functional assignment authoring.

#### 2. Fully Mocked (Needs Backend Integration)
- `ManagerRolesPage`: Entire page is a static mock. Role management logic missing.
- `ManagerSettingsPage`: Entire page is a static mock. No backend persistence for configuration.
- `ManagerProgressPage`: Fully mocked data and UI.
- `ManagerQuizzesPage`: List view is fully mocked (though builder is wired).
- `ManagerAssignmentsPage`: List view is fully mocked (though creation is wired).
- `ManagerIntegrationsPage`: Entire page is a static mock.
- `ManagerActivityPage`: Activity feed and most interaction handlers are mocked.

#### 3. Partially Wired (Needs Cleanup/Wiring)
- `ManagerDashboard`: `KPIGrid` and `EnrollmentChart` use mock data.
- `ManagerCoursesPage`: Data fetching wired, but row-level actions (Archive, Delete) need verification.
- `ManagerInstructorsPage`: Data fetching wired, but actions need review.
- `ManagerEnrollmentsPage`: Data fetching wired, but actions need review.
- `ManagerBulkEnrollPage`: Course/User selection wired, but "Enroll" submission and History table are mocked.
- `ManagerSessionsPage`: Data fetching wired, but action handlers (Join, View) are missing.
- `ManagerRecordingsPage`: Data fetching wired, but actions (Download, Delete) are missing.
- `ManagerAnalyticsPage`: Engagement metrics and some charts are mocked.
- `ManagerBulkImportPage`: Upload logic wired, but template download and import history are mocked.
- `ManagerScheduleNewPage` (Shared): Primary flow wired but has hardcoded course/module defaults and attendee limits.
- `ManagerBillingPage`: History table wired, but Current Plan, Usage, and Payment Method are mocked.

#### 4. Critical Action Items
- [ ] Wire `KPIGrid` in `ManagerDashboard.tsx` to real statistics.
- [ ] Implement backend persistence for `ManagerSettingsPage.tsx`.
- [ ] Replace mock roles data in `ManagerRolesPage.tsx` with `rolesApi`.
- [ ] Connect "Enroll" button in `ManagerBulkEnrollPage.tsx` to `enrollmentApi.bulkEnroll`.
- [ ] Wire interaction handlers in `ManagerRecordingsPage.tsx` and `ManagerActivityPage.tsx`.
- [ ] Remove hardcoded IDs in `SessionSchedulingPage.tsx`.
- [ ] Mock out or implement Stripe/Payment gateway integration for `ManagerBillingPage.tsx`.


---

## Implementation Plan

### Sprint 1: Critical Fixes
1. ~~Fix CSV format mismatch in bulk import~~ ✅
2. ~~Wire marketing pages to existing APIs~~ ✅ (Categories, Courses, Pricing all wired)

### Sprint 2: Data Completeness
3. ~~Fetch real categories, featured courses, pricing~~ ✅ DONE
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
| Bulk Enrollment | ✅ Working | `/api/v1/learning/enrollments/bulk/` |
| Session Attachments | ✅ Working | `/api/v1/catalogue/session-attachments/` |

---

## Completed Items (Reference)

| Date | Item |
|------|------|
| 27 Mar 2026 | ManagerMessagesPage & LearnerMessagesPage wired |
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
| 27 Mar 2026 | ManagerBulkEnrollPage wired to `enrollmentApi.bulkEnroll()` — real user selection with checkboxes |
| 27 Mar 2026 | CoursePlayerPage Resources tab wired to `sessionAttachmentApi.getBySession()` — mock data removed |
| 27 Mar 2026 | LearnerCertificatesPage mock data removed — relies on auto-created certificates via signals |

---

## Finance Interface Audit (27 Mar 2026)

### 1. Dashboard & Core Components
- `FinanceDashboard`: Overview statistics (Transactions, Invoices, Subscriptions) are wired via `FinancialOverview`.
- `FinancialOverview`: Fetches count and trend data from real API hooks.
- `TransactionsTable` & `RecentInvoices`: Wired to `useTransactions` and `useInvoices` respectively.
- `RevenueChart`: **Mocked**. Re-calculates hardcoded `revenueData` locally.
- `PaymentMethodsChart`: **Mocked**. Uses static `paymentData` array.
- `QuickActions`: Buttons are unwired or use default window alerts.
- **Navigation Issues**: Row buttons in `TransactionsTable` point to non-existent `/finance/transactions` (should be `/finance/revenue-reports` or `/finance/payments`).

### 2. Revenue & Subscriptions Sub-pages
- `FinancePaymentsPage`: **Fully Mocked**. Uses static `payments` array despite `transactionApi` being available.
- `FinanceInvoicesPage`: **Fully Mocked**. Uses static `invoices` array despite `invoiceApi` being available.
- `FinanceSubscriptionsPage`: **Fully Mocked**. Uses static `subscriptions` array despite `subscriptionApi` being available.
- `FinanceRevenueReportsPage`: **Fully Mocked**. Data is hardcoded in `stats` and `revenueData` arrays.
- `FinanceSubscriptionHistoryPage`: **Fully Mocked**. Uses hardcoded `history` array.
- `FinanceChurnPage`: **Fully Mocked**. KPIs and charts use static `churnKpis`, `monthlyChurn`, and `churnReasons`.
- `FinancePricingPage`: **Fully Mocked**. Plans and pricing are static `individualPlan` and `orgPlans` objects.
- `FinanceAlertsPage`: **Fully Mocked**. Uses hardcoded `events` array.

### 3. Reports & Gateways
- `FinanceExportPage`: **Wired**. Correctly uses `reportsApi` for fetching types and generating/downloading exports.
- `FinanceStatementsPage`: **Fully Mocked**. Income statement, Balance sheet, and Cash flow data are all static.
- `FinanceCustomReportsPage`: **Fully Mocked**. Reports list uses hardcoded `reports` array.
- `GatewayMpesaPage`, `GatewayMtnPage`, `GatewayAirtelPage`, `GatewayPesapalPage`: **Fully Mocked**. Health metrics and transaction lists are static.

### 4. Account & Global Components
- `FinanceProfilePage`: **Wired**. Uses `useAuth`, `useUpdateProfile`, and `uploadApi`.
- `Sidebar`: "Today's Revenue" stat at the bottom is hardcoded (`$8,425`).
- `TopBar`: Settings menu item points to a **broken link** (`/finance/settings` does not exist in router).

### 5. Critical Action Items
- [ ] Refactor `FinancePaymentsPage`, `FinanceInvoicesPage`, and `FinanceSubscriptionsPage` to use existing CRUD services.
- [ ] Fix broken navigation in `TransactionsTable` and `TopBar` settings link.
- [ ] Implement backend endpoints for churn metrics, pricing management, and financial statements.
- [ ] Wire `RevenueChart` and `PaymentMethodsChart` in the dashboard to real analytics hooks.
- [ ] Implement "Gateway Health" API for real-time monitoring of payment integrations.

## Instructor Module Audit (Conducted March 2026)

| Page/Component | Status | Backend Integration Status | Mock Data / Placeholders | Unwired Buttons / Links |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | Mixed | KPIs and Courses wired. | `WelcomeBanner` stats are hardcoded. | `QuickActions`: Quiz Bank, Submissions, Reports links are broken. |
| **Courses List** | Mostly Wired | CRUD and filters wired to `useCourses`. | None. | Context Menu: "Duplicate" and "Delete Draft" have no action. |
| **Course Creation** | Wired | Multisave, Autosave, and Media Upload wired. | None. | `CourseTopBar`: "Publish" button only saves as draft. |
| **Course Structure** | Mostly Wired | Modules/Lessons CRUD and Reordering wired. | `ContentLibraryWidget` is 100% mocked. | None. |
| **Question Bank** | **Wired** | Fully wired to `useBankQuestions`. | None. | None. |
| **Assignments Hub** | **Wired** | Fully wired to `useSessions` and `useCourses`. | None. | None. |
| **Grading** | **Mocked** | **0% Integration**. | All submissions, files, and rubrics are sample data. | Full page requires wiring to `submissionApi`. |
| **Gradebook** | Mostly Wired | Table and Stats wired to `submissionApi`. | None (residuals cleaned). | "Export" button is a placeholder. |
| **Analytics** | Partially Wired | KPI cards wired to `useLearningStats`. | Weekly engagement and performance charts are placeholders. | "Export" button is a placeholder. |
| **Profile** | Mostly Wired | Core fields and Avatar upload wired. | Social links and Expertise are placeholders. | None. |

### Critical Instructor Action Items:
- [ ] **Wiring Grading Page**: Connect `GradingPage` and sub-components to `submissionApi` and `gradingApi`.
- [ ] **Fix Dashboard Navigation**: Update `QuickActions.tsx` with correct routes for Quiz Bank, Submissions, and Reports.
- [ ] **Dynamic Welcome Stats**: Connect `WelcomeBanner.tsx` to `useLearningStats` or dashboard data.
- [ ] **Content Library Integration**: Implement real content library fetching in `ContentLibraryWidget.tsx`.
- [ ] **Complete Context Menu**: Add handlers for "Duplicate" and "Delete Draft" in `InstructorCoursesPage.tsx`.
- [ ] **Functional Exports**: Implement export logic in Gradebook and Analytics.

## Learner Module Audit (Conducted March 2026)

| Page/Component | Status | Backend Integration Status | Mock Data / Placeholders | Unwired Buttons / Links |
| :--- | :--- | :--- | :--- | :--- |
| **Learner Dashboard** | Mixed | Course list, Activities, Certificates wired. | "Learning Hours" stat and some course card details are mocked. | "Resume Learning" button and "Upcoming Session" click unwired. |
| **Course Catalog** | Mostly Wired | Courses, Categories, Pagination wired. | KPI stats (Total Instructors/Learners) and Instructor cards are mocked. | Filter Bar search & Category click unwired in the parent page. |
| **Course Detail** | Mostly Wired | Enrollment, Subscription check, Curriculum, Reviews wired. | "Projects" count, Instructor Bio, and Sidebar progress metrics are mocked. | "Write Review" and "View Instructor Profile" show coming soon toasts. |
| **Course Player** | **Wired** | Video, Documents, Quizzes, Notes, Q&A, and Progress tracking fully wired. | SCORM playback is a temporary download-only fallback. | None. |
| **Assignments** | **Wired** | Submissions, Uploads, and Grades fully wired. | None. | "View" button for graded assignments is unwired. |
| **Progress** | **Mocked** | **0% Integration**. | All stats, course progress lists, and milestones are hardcoded. | Tabs work on local static data only. |
| **Quizzes** | Mostly Wired | Listing and Status wired. | "Avg. Score" KPI is mocked; "Failed" status logic missing (no score in progress type). | None. |
| **Subscription** | Mostly Wired | Sub status, Invoices, Usage stats, Payment methods fetched. | Actions (Cancel, Add Payment, Set Default) are placeholders. | Delete/Edit payment method, View All invoices. |
| **Certificates** | **Wired** | Fully wired to certificates API. | None (PDF generation is backend-stubbed). | None. |
| **Messaging** | **Wired** | Fully wired to messaging API via common component. | None. | None. |
| **Profile** | Mostly Wired | Core fields and Avatar upload wired. | Cover image edit and public profile edit are placeholders. | None. |

### Critical Learner Action Items:
- [ ] **Overhaul Progress Page**: Connect `ProgressPage.tsx` to `enrollmentApi` and `sessionProgressApi` to show real learning metrics.
- [ ] **Wire Subscription Actions**: Implement `cancelSubscription` and `addPaymentMethod` mutations in `SubscriptionManagementPage.tsx`.
- [ ] **Fix Catalog Integration**: Wire the Search button in `LearnerCourseCatalogPage.tsx` and fetch real platform-wide stats.
- [ ] **Cleanup Dashboard Mocks**: Connect "Learning Hours" to a real time-tracking metric and wire the "Resume" button.
- [ ] **Enhance Course Detail**: Connect Sidebar metrics (Progress, Total Hours) to the learner's actual enrollment data.

## Public & Shared Pages Audit (Conducted March 2026)

| Page/Component | Status | Backend Integration Status | Mock Data / Placeholders | Unwired Buttons / Links |
| :--- | :--- | :--- | :--- | :--- |
| **Landing Page** | **Wired** | Statistics (Active Learners, etc.) wired to `publicStatsApi`. | Marketing sections (Features/Testimonials) are static as intended. | None. |
| **For Business** | **Wired** | Pricing plans and Platform stats wired to `businessPricingApi` and `publicStatsApi`. | Testimonials and Use Cases are static. | None. |
| **Auth Pages** | **Wired** | Login, Registration, MFA, Email Verification, Password Reset, and Set Password are 100% wired. | None. | None. |
| **Public Catalog** | Mostly Wired | Course listing, Categories, and Stats wired. | Rating and Review count on grid are mocked (0). | `Sort By` filter is ignored by currently used API endpoint. |
| **Course Landing** | Mostly Wired | Course details and Reviews summary wired. | Average rating, Distribution, and Review text on some components are mocked; Curriculum fallback. | Review filters, "Helpful" buttons, and Search reviews are unwired. |
| **Checkout** | Mixed | Card payment (Flutterwave) fully wired via hook. | Mobile Money (M-Pesa/MTN/Airtel) and Promo codes (SAVE20) are mocked. | None. |
| **Invoice/Receipt** | Partially Wired | State-driven from checkout. | Fallback sample data (Emma Chen) used when state is missing. | "Download PDF" and "Email Invoice" are mock toasts/placeholders. |
| **Certificate Valid.**| **Wired** | Fully wired to `certificateApi.verify`. | None. | None. |
| **Payment History** | Mostly Wired | Transaction list and stats wired. | "Export CSV", "Download Statement", and "Email Receipt" are placeholders. | None. |
| **Privacy Policy** | **Wired** | Static content as intended. | None. | None. |

### Critical Public & Shared Action Items:
- [ ] **Real Mobile Money Payments**: Replace simulation in `CheckoutPaymentPage.tsx` with actual Flutterwave Mobile Money charge API.
- [ ] **Dynamic Promo Codes**: Implement `promoCodeApi` in `public.services.ts` and wire it to the checkout and subscription pages.
- [ ] **Functional Invoice Actions**: Implement real PDF generation/download and email sending in `InvoiceReceiptPage.tsx`.
- [ ] **Catalog Sorting**: Update `publicCourseApi` to support sorting and wire the `CourseCataloguePage` dropdown.
- [ ] **Curriculum Wiring**: Ensure `CourseCurriculum.tsx` fetches sessions for all courses without relying on React patterns default fallback.
- [ ] **Interactive Reviews**: Wire the "Helpful" buttons and star filters in `CourseReviews.tsx`.
- [ ] **Transaction Exports**: Implement CSV and Statement generation in `PaymentHistoryPage.tsx`.
