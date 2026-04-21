# Graph Report - .  (2026-04-21)

## Corpus Check
- 485 files · ~1,328,968 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1337 nodes · 2059 edges · 49 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `saveCourse()` - 6 edges
2. `handleUserMenuClose()` - 5 edges
3. `fmtStatus()` - 5 edges
4. `handleChange()` - 4 edges
5. `showToast()` - 4 edges
6. `handleSubmit()` - 3 edges
7. `buildCoursePath()` - 3 edges
8. `handleSaveAndBuildCurriculum()` - 3 edges
9. `formatDuration()` - 3 edges
10. `sessionToLessonData()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `handleProfile()` --calls--> `handleUserMenuClose()`  [EXTRACTED]
  src\components\manager\TopBar.tsx → src\components\superadmin\TopBar.tsx
- `handleSettings()` --calls--> `handleUserMenuClose()`  [EXTRACTED]
  src\components\manager\TopBar.tsx → src\components\superadmin\TopBar.tsx
- `handleLogout()` --calls--> `handleUserMenuClose()`  [EXTRACTED]
  src\components\learner\TopBar.tsx → src\components\superadmin\TopBar.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (7): handleSubmit(), validateForm(), handleLogout(), handleProfile(), handleSettings(), handleUserMenuClose(), onLogoutClick()

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (7): handlePayment(), showToast(), closeMenu(), handleRequestDeletion(), handleSubmitForApproval(), handleSubmit(), validateForm()

### Community 2 - "Community 2"
Cohesion: 0.03
Nodes (3): buildPayload(), handleSubmit(), validate()

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (9): handleComplete(), validateExternalUrl(), handleSubmit(), isValidEmail(), handleSubmit(), nextStep(), validateStep1(), validateStep2() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (2): handleSubmit(), validate()

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.03
Nodes (2): closeDialog(), handleSave()

### Community 7 - "Community 7"
Cohesion: 0.03
Nodes (3): daysSince(), isAtRiskEnrollment(), toProgressNumber()

### Community 8 - "Community 8"
Cohesion: 0.04
Nodes (6): cancelSubscriptionError(), cap(), fmtStatus(), payInvoiceError(), renewSubscriptionError(), updateInvoiceError()

### Community 9 - "Community 9"
Cohesion: 0.04
Nodes (8): buildModulesFromBackend(), deriveContentBadge(), formatDuration(), handleAddLesson(), handleQuickAdd(), sessionToLessonData(), findModuleForLesson(), handleDragEnd()

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (5): handleClose(), handleSelectType(), buildSaveErrorMessage(), buildSettingsPayload(), saveDraft()

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (10): buildCoursePath(), buildPayload(), handlePreview(), handleSave(), handleSaveAndBuildCurriculum(), handleSaveDraft(), saveCourse(), uploadMediaFiles() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (2): handleAddCategoryClose(), handleAddCategorySubmit()

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (6): buildGradebookData(), mapSubmissionStatus(), handleAddCategory(), handleCategoryChange(), handleChange(), handleDeleteCategory()

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.12
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (2): handleContinue(), startEmailResendTimer()

### Community 21 - "Community 21"
Cohesion: 0.24
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (2): handleSubmit(), validateForm()

### Community 25 - "Community 25"
Cohesion: 0.36
Nodes (4): handleDownloadReceipt(), handleDownloadStatement(), handleExportCsv(), showToast()

### Community 26 - "Community 26"
Cohesion: 0.4
Nodes (2): handleEmail(), showToast()

### Community 27 - "Community 27"
Cohesion: 0.4
Nodes (2): formatDate(), getRelativeTime()

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 29`** (2 nodes): `TagsInput.tsx`, `handleKeyDown()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `Loginbtn.tsx`, `Loginbtn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `customIcons.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `FinancialCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `StatCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `ContentDetailsForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `DestinationSelector.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `UploadedFileItem.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `UploadTypeSelector.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `QuickActionsCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `DurationSelector.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `MeetingSettings.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `CatalogInstructorCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `RegisterPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `PrivacyPolicyPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `theme.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `icons.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._