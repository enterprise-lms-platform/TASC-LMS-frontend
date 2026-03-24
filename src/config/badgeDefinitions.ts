export interface BadgeCategory {
  id: string;
  name: string;
}

export interface BadgeDefinition {
  id: number;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  image_url: string;
}

export const BADGE_CATEGORIES: BadgeCategory[] = [
  { id: 'course_completion', name: 'Course Completion' },
  { id: 'enrollment_milestones', name: 'Enrollment Milestones' },
  { id: 'subscription_loyalty', name: 'Subscription Loyalty' },
  { id: 'assessment_excellence', name: 'Assessment Excellence' },
  { id: 'engagement', name: 'Engagement' },
  { id: 'milestones', name: 'Milestones' },
];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 1, slug: 'first-course', title: 'First Steps', description: 'Completed your first course', category_id: 'course_completion', image_url: '/badges/first-course.png' },
  { id: 2, slug: 'three-courses', title: 'Knowledge Seeker', description: 'Completed 3 courses', category_id: 'course_completion', image_url: '/badges/three-courses.png' },
  { id: 3, slug: 'five-courses', title: 'Dedicated Learner', description: 'Completed 5 courses', category_id: 'course_completion', image_url: '/badges/five-courses.png' },
  { id: 4, slug: 'ten-courses', title: 'Knowledge Master', description: 'Completed 10 courses', category_id: 'course_completion', image_url: '/badges/ten-courses.png' },
  { id: 5, slug: 'twenty-courses', title: 'Scholar', description: 'Completed 20 courses', category_id: 'course_completion', image_url: '/badges/twenty-courses.png' },
  
  { id: 6, slug: 'first-enrollment', title: 'Early Bird', description: 'Enrolled in your first course', category_id: 'enrollment_milestones', image_url: '/badges/first-enrollment.png' },
  { id: 7, slug: 'five-enrollments', title: 'Curious Mind', description: 'Enrolled in 5 courses', category_id: 'enrollment_milestones', image_url: '/badges/five-enrollments.png' },
  { id: 8, slug: 'ten-enrollments', title: 'Course Explorer', description: 'Enrolled in 10 courses', category_id: 'enrollment_milestones', image_url: '/badges/ten-enrollments.png' },
  
  { id: 9, slug: 'first-subscription', title: 'Supporter', description: 'Subscribed for the first time', category_id: 'subscription_loyalty', image_url: '/badges/first-subscription.png' },
  { id: 10, slug: 'third-subscription', title: 'Loyal Learner', description: 'Renewed subscription 3 times', category_id: 'subscription_loyalty', image_url: '/badges/third-subscription.png' },
  { id: 11, slug: 'fifth-subscription', title: 'Platinum Member', description: 'Renewed subscription 5 times', category_id: 'subscription_loyalty', image_url: '/badges/fifth-subscription.png' },
  
  { id: 12, slug: 'first-quiz', title: 'Quiz Taker', description: 'Completed your first quiz', category_id: 'assessment_excellence', image_url: '/badges/first-quiz.png' },
  { id: 13, slug: 'perfect-score', title: 'Perfect Score', description: 'Scored 100% on any quiz', category_id: 'assessment_excellence', image_url: '/badges/perfect-score.png' },
  { id: 14, slug: 'quiz-streak', title: 'Quiz Streak', description: 'Passed 5 quizzes in a row', category_id: 'assessment_excellence', image_url: '/badges/quiz-streak.png' },
  { id: 15, slug: 'assignment-ace', title: 'Assignment Ace', description: 'Received full marks on an assignment', category_id: 'assessment_excellence', image_url: '/badges/assignment-ace.png' },
  
  { id: 16, slug: 'first-discussion', title: 'Conversation Starter', description: 'Posted in a course discussion', category_id: 'engagement', image_url: '/badges/first-discussion.png' },
  { id: 17, slug: 'ten-discussions', title: 'Community Voice', description: 'Made 10 discussion posts', category_id: 'engagement', image_url: '/badges/ten-discussions.png' },
  { id: 18, slug: 'first-review', title: 'Reviewer', description: 'Left your first course review', category_id: 'engagement', image_url: '/badges/first-review.png' },
  
  { id: 19, slug: 'profile-complete', title: 'Identity', description: 'Completed your profile', category_id: 'milestones', image_url: '/badges/profile-complete.png' },
  { id: 20, slug: 'seven-day-streak', title: 'Week Warrior', description: 'Active for 7 consecutive days', category_id: 'milestones', image_url: '/badges/seven-day-streak.png' },
  { id: 21, slug: 'first-certificate', title: 'Certified', description: 'Earned your first certificate', category_id: 'milestones', image_url: '/badges/first-certificate.png' },
  { id: 22, slug: 'three-certificates', title: 'Certificate Collector', description: 'Earned 3 certificates', category_id: 'milestones', image_url: '/badges/three-certificates.png' },
];
