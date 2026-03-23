# TASC LMS — Badge Definitions

**Purpose:** Completion badges to motivate learners (userStories.md line 55)
**Implementation:** Backend-powered (Badge + UserBadge models, auto-award via signals, API endpoints) — see backend pending-tasks.md #28
**UX:** Confetti animation + modal popup when a new badge is earned

---

## Badge Image Specs

- Format: PNG with transparent background
- Size: 200x200px (displayed at 80-120px, retina-ready)
- Style: Consistent design language across all badges
- Location: `/public/badges/{slug}.png`
- Locked state: Frontend applies grayscale + opacity CSS filter

---

## Category 1: Course Completion

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 1 | `first-course` | First Steps | Completed your first course | `certificates.length >= 1` | Footprint / rocket launch |
| 2 | `three-courses` | Knowledge Seeker | Completed 3 courses | `certificates.length >= 3` | Open book with sparkles |
| 3 | `five-courses` | Dedicated Learner | Completed 5 courses | `certificates.length >= 5` | Star with laurel wreath |
| 4 | `ten-courses` | Knowledge Master | Completed 10 courses | `certificates.length >= 10` | Crown / trophy |
| 5 | `twenty-courses` | Scholar | Completed 20 courses | `certificates.length >= 20` | Graduation cap |

---

## Category 2: Enrollment Milestones

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 6 | `first-enrollment` | Early Bird | Enrolled in your first course | `enrollments.length >= 1` | Baby bird / sunrise |
| 7 | `five-enrollments` | Curious Mind | Enrolled in 5 courses | `enrollments.length >= 5` | Magnifying glass |
| 8 | `ten-enrollments` | Course Explorer | Enrolled in 10 courses | `enrollments.length >= 10` | Compass |

---

## Category 3: Subscription Loyalty

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 9 | `first-subscription` | Supporter | Subscribed for the first time | `subscriptionCount >= 1` | Heart / handshake |
| 10 | `third-subscription` | Loyal Learner | Renewed subscription 3 times | `subscriptionCount >= 3` | Shield with checkmark |
| 11 | `fifth-subscription` | Platinum Member | Renewed subscription 5 times | `subscriptionCount >= 5` | Diamond / platinum badge |

> **How to count:** Each `UserSubscription` record with `status = 'active' | 'expired' | 'cancelled'` counts as one subscription period. Fetch via `userSubscriptionApi` or `invoiceApi` (subscription-type invoices).

---

## Category 4: Assessment Excellence

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 12 | `first-quiz` | Quiz Taker | Completed your first quiz | `quizSubmissions.length >= 1` | Question mark bubble |
| 13 | `perfect-score` | Perfect Score | Scored 100% on any quiz | `anyQuiz.score === 100` | Bullseye / target |
| 14 | `quiz-streak` | Quiz Streak | Passed 5 quizzes in a row | `consecutivePasses >= 5` | Lightning bolt |
| 15 | `assignment-ace` | Assignment Ace | Received full marks on an assignment | `anySubmission.score === maxPoints` | A+ ribbon |

---

## Category 5: Engagement

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 16 | `first-discussion` | Conversation Starter | Posted in a course discussion | `discussions.length >= 1` | Speech bubble |
| 17 | `ten-discussions` | Community Voice | Made 10 discussion posts | `discussions.length >= 10` | Megaphone |
| 18 | `first-review` | Reviewer | Left your first course review | `reviews.length >= 1` | Star with pen |

---

## Category 6: Milestones

| # | Slug | Title | Description | Criteria | Icon Suggestion |
|---|------|-------|-------------|----------|-----------------|
| 19 | `profile-complete` | Identity | Completed your profile (name, avatar, bio, phone) | All profile fields filled | Person with checkmark |
| 20 | `seven-day-streak` | Week Warrior | Active for 7 consecutive days | `loginStreak >= 7` (needs localStorage tracking) | Calendar with flame |
| 21 | `first-certificate` | Certified | Earned your first certificate | `certificates.length >= 1` | Certificate ribbon |
| 22 | `three-certificates` | Certificate Collector | Earned 3 certificates | `certificates.length >= 3` | Stack of certificates |

---

## Data Sources (Existing APIs)

| Data | API | Hook |
|------|-----|------|
| Enrollments | `enrollmentApi.getAll()` | `useEnrollments()` |
| Certificates | `certificateApi.getAll()` | `useCertificates()` |
| Quiz submissions | `quizSubmissionApi.getAll()` | — |
| Discussions | `discussionApi.getAll()` | — |
| Course reviews | `courseReviewApi.getAll()` | — |
| Subscriptions | `userSubscriptionApi.getMyStatus()` | — |
| Profile data | `useAuth()` → `user` object | `useAuth()` |

---

## Earned Badge Modal

When a badge is newly earned (not seen before), show:

```
+---------------------------------------+
|          [Confetti Animation]         |
|                                       |
|        [Badge Image - 120px]          |
|                                       |
|     "Badge Unlocked!"                |
|     "{Badge Title}"                   |
|     "{Badge Description}"             |
|                                       |
|     [ View All Badges ]  [ Close ]    |
+---------------------------------------+
```

- Confetti: use `canvas-confetti` npm package (lightweight, ~6KB)
- Track seen badges in `localStorage` key: `tasc_seen_badges`
- On page load, compute earned badges → diff against seen → show modal for new ones
- Modal shows one badge at a time, queue if multiple earned simultaneously

---

## Badge Card (on Badges Page)

### Earned State
```
+------------------+
|   [Badge PNG]    |
|    80x80px       |
|                  |
|  "First Steps"   |
|  "Completed your |
|   first course"  |
|                  |
|  Earned: 15 Mar  |
+------------------+
```

### Locked State
```
+------------------+
|   [Badge PNG]    |  <- CSS: grayscale(100%) opacity(0.4)
|    80x80px       |
|                  |
|  "Quiz Streak"   |
|  "Pass 5 quizzes |
|   in a row"      |
|                  |
|  [Progress: 2/5] |  <- only if progress is trackable
+------------------+
```

---

## File Checklist

When badge PNGs are ready, place them at:

```
public/badges/
  first-course.png
  three-courses.png
  five-courses.png
  ten-courses.png
  twenty-courses.png
  first-enrollment.png
  five-enrollments.png
  ten-enrollments.png
  first-subscription.png
  third-subscription.png
  fifth-subscription.png
  first-quiz.png
  perfect-score.png
  quiz-streak.png
  assignment-ace.png
  first-discussion.png
  ten-discussions.png
  first-review.png
  profile-complete.png
  seven-day-streak.png
  first-certificate.png
  three-certificates.png
```

Total: **22 badge PNGs needed**

---

## Implementation Order

1. Install `canvas-confetti`
2. Create badge definitions config (`src/config/badgeDefinitions.ts`)
3. Create `useBadges()` hook — fetches all data, evaluates rules, returns earned/locked/new
4. Create `BadgeEarnedModal` component (confetti + modal)
5. Create `LearnerBadgesPage` with grid of badge cards
6. Add `/learner/badges` route + sidebar link
7. Mount `BadgeEarnedModal` in learner layout (triggers on any page)
