/**
 * TASC LMS API Type Definitions. OpenAPI v3.0.3 compliant.
 * This file contains all TypeScript type definitions for the TASC LMS API.
 */

// ENUMS
// erasableSyntaxOnly was enabled so it's strictertly typed as const enums with string values, which is more type-safe and auto-completable in TypeScript.

export const UserRole = {
  LEARNER: 'learner',
  INSTRUCTOR: 'instructor',
  FINANCE: 'finance',
  TASC_ADMIN: 'tasc_admin',
  LMS_MANAGER: 'lms_manager',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const CourseLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ALL_LEVELS: 'all_levels',
} as const;
export type CourseLevel = typeof CourseLevel[keyof typeof CourseLevel];

export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export type CourseStatus = typeof CourseStatus[keyof typeof CourseStatus];

export const SessionType = {
  VIDEO: 'video',
  TEXT: 'text',
  LIVE: 'live',
  DOCUMENT: 'document',
  HTML: 'html',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  SCORM: 'scorm',
} as const;
export type SessionType = typeof SessionType[keyof typeof SessionType];

export const SessionStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;
export type SessionStatus = typeof SessionStatus[keyof typeof SessionStatus];

export const EnrollmentStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  EXPIRED: 'expired',
} as const;
export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus];

export const InvoiceType = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
  SUBSCRIPTION: 'subscription',
  COURSE: 'course',
} as const;
export type InvoiceType = typeof InvoiceType[keyof typeof InvoiceType];

export const InvoiceStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;
export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;
export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const PaymentMethodType = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_ACCOUNT: 'bank_account',
} as const;
export type PaymentMethodType = typeof PaymentMethodType[keyof typeof PaymentMethodType];

export const BillingCycle = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const;
export type BillingCycle = typeof BillingCycle[keyof typeof BillingCycle];

export const SubscriptionStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;
export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export const UserSubscriptionStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;
export type UserSubscriptionStatus = typeof UserSubscriptionStatus[keyof typeof UserSubscriptionStatus];


// AUTHENTICATION & USER TYPES

export interface UserMe {
  id: number;
  name: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  country?: string | null;
  timezone?: string | null;
  role: UserRole;
  google_picture?: string | null;
  marketing_opt_in?: boolean;
  terms_accepted_at?: string | null;
  email_verified: boolean;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: UserMe;
}

export interface MfaChallengeResponse {
  mfa_required: boolean;
  method: string;
  challenge_id: string;
  expires_in: number;
}

export interface VerifyOtpRequest {
  challenge_id: string;
  otp: string;
}

export interface ResendOtpRequest {
  challenge_id: string;
}

export interface ResendOtpResponse {
  detail: string;
  expires_in: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  country?: string;
  timezone?: string;
  accept_terms: boolean;
  marketing_opt_in?: boolean;
}

export interface RegisterResponse {
  message: string;
  user: UserMe;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  new_password: string;
  confirm_password: string;
}

export interface SetPasswordRequest {
  new_password: string;
  confirm_password: string;
}

export interface GoogleLoginRequest {
  id_token: string;
  access_token?: string;
}

export interface GoogleLoginResponse {
  refresh: string;
  access: string;
  user: UserMe;
  is_new_user: boolean;
}

export interface GoogleStatusResponse {
  is_linked: boolean;
  google_id: string | null;
  google_picture: string | null;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  country?: string | null;
  timezone?: string | null;
  date_of_birth?: string | null;
  avatar?: string | null;
  bio?: string;
  marketing_opt_in?: boolean;
}

export interface InviteUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

// CATALOGUE TYPES

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string | null;
  parent?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryDetail extends Category {
  children: Category[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface CourseList {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  short_description?: string;
  thumbnail?: string | null;
  category: Category;
  tags: Tag[];
  level: CourseLevel;
  price: string;
  discounted_price: string;
  discount_percentage?: number;
  duration_hours?: number;
  duration_weeks?: number;
  total_sessions?: number;
  instructor?: number | null;
  instructor_name: string;
  enrollment_count: number;
  featured: boolean;
  status: CourseStatus;
  published_at?: string | null;
}

export interface Session {
  id: number;
  course: number;
  title: string;
  description?: string;
  session_type: SessionType;
  status: SessionStatus;
  order: number;
  video_duration_seconds?: number | null;
  duration_minutes: number;
  video_url?: string | null;
  content_text?: string;
  is_free_preview: boolean;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicSession {
  id: number;
  title: string;
  description: string;
  session_type: SessionType;
  order: number;
  video_duration_seconds?: number | null;
  duration_minutes: number;
  is_free_preview: boolean;
  is_mandatory: boolean;
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  short_description?: string;
  subcategory?: string;
  thumbnail?: string | null;
  banner?: string | null;
  category: Category;
  tags: Tag[];
  level: CourseLevel;
  price: string;
  discounted_price: string;
  discount_percentage?: number;
  duration_hours?: number;
  duration_minutes?: number;
  duration_weeks?: number;
  total_sessions?: number;
  instructor: number;
  instructor_name: string;
  enrollment_count: number;
  featured: boolean;
  status: CourseStatus;
  published_at?: string | null;
  description: string;
  prerequisites?: string;
  learning_objectives?: string;
  learning_objectives_list?: string[];
  target_audience?: string;
  trailer_video_url?: string | null;
  is_public?: boolean;
  allow_self_enrollment?: boolean;
  certificate_on_completion?: boolean;
  enable_discussions?: boolean;
  sequential_learning?: boolean;
  enrollment_limit?: number | null;
  access_duration?: string;
  start_date?: string | null;
  end_date?: string | null;
  grading_config?: Record<string, unknown>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_by: number;
  sessions: Session[];
  created_at: string;
  updated_at: string;
}

export interface PublicCourseDetail extends Omit<CourseDetail, 'sessions'> {
  sessions: PublicSession[];
}

export interface CourseCreateRequest {
  title: string;
  slug?: string;
  subtitle?: string;
  description: string;
  short_description?: string;
  subcategory?: string;
  category?: number | null;
  level?: CourseLevel;
  tags?: number[];
  price?: string;
  currency?: string;
  discount_percentage?: number;
  duration_hours?: number;
  duration_minutes?: number;
  duration_weeks?: number;
  total_sessions?: number;
  instructor?: number | null;
  thumbnail?: string | null;
  banner?: string | null;
  trailer_video_url?: string | null;
  prerequisites?: string;
  learning_objectives?: string;
  learning_objectives_list?: string[];
  target_audience?: string;
  status?: CourseStatus;
  featured?: boolean;
  is_public?: boolean;
  allow_self_enrollment?: boolean;
  certificate_on_completion?: boolean;
  enable_discussions?: boolean;
  sequential_learning?: boolean;
  enrollment_limit?: number | null;
  access_duration?: string;
  start_date?: string | null;
  end_date?: string | null;
  grading_config?: Record<string, unknown>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface SessionCreateRequest {
  course: number;
  title: string;
  description?: string;
  session_type?: SessionType;
  status?: SessionStatus;
  order?: number;
  video_duration_seconds?: number | null;
  video_url?: string | null;
  content_text?: string;
  is_free_preview?: boolean;
  is_mandatory?: boolean;
}

// LEARNING TYPES

export interface Enrollment {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  course: number;
  course_title: string;
  course_thumbnail: string;
  organization?: number | null;
  organization_name: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at?: string | null;
  expires_at?: string | null;
  progress_percentage: number;
  last_accessed_at: string;
  last_accessed_session?: number | null;
  paid_amount?: string;
  currency?: string;
  certificate_issued: boolean;
  certificate_issued_at?: string | null;
  time_remaining_days: number;
}

export interface EnrollmentCreateRequest {
  course: number;
  organization?: number | null;
  paid_amount?: string;
  currency?: string;
}

export interface SessionProgress {
  id: number;
  enrollment: number;
  session: number;
  session_title: string;
  session_type: string;
  is_started: boolean;
  started_at?: string | null;
  is_completed: boolean;
  completed_at?: string | null;
  time_spent_seconds: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  notes?: string;
  duration_minutes: number;
}

export interface SessionProgressUpdateRequest {
  is_completed?: boolean;
  time_spent_seconds?: number;
}

export interface Certificate {
  id: number;
  enrollment: number;
  user_name: string;
  user_email: string;
  course_title: string;
  certificate_number: string;
  issued_at: string;
  expiry_date?: string | null;
  is_valid: boolean;
  is_expired: boolean;
  pdf_url?: string | null;
  verification_url?: string | null;
}

export interface Discussion {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  user_avatar: string;
  course?: number | null;
  course_title: string;
  session?: number | null;
  session_title: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_deleted: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface DiscussionCreateRequest {
  course?: number | null;
  session?: number | null;
  title: string;
  content: string;
}

export interface DiscussionReply {
  id: number;
  discussion: number;
  user: number;
  user_name: string;
  user_email: string;
  user_avatar: string;
  parent?: number | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscussionReplyCreateRequest {
  discussion: number;
  parent?: number | null;
  content: string;
}

// PAYMENT TYPES

export interface PaymentMethod {
  id: number;
  user: number;
  user_email: string;
  organization?: number | null;
  organization_name: string;
  method_type: PaymentMethodType;
  is_default: boolean;
  is_active: boolean;
  display_name: string;
  is_expired: boolean;
  card_last_four?: string;
  card_brand?: string;
  card_expiry_month?: number | null;
  card_expiry_year?: number | null;
  paypal_email?: string | null;
  bank_name?: string;
  bank_account_last_four?: string;
  gateway_token?: string;
  payment_provider?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodCreateRequest {
  method_type: PaymentMethodType;
  is_default?: boolean;
  is_active?: boolean;
  card_last_four?: string;
  card_brand?: string;
  card_expiry_month?: number | null;
  card_expiry_year?: number | null;
  paypal_email?: string | null;
  bank_name?: string;
  bank_account_last_four?: string;
  gateway_token?: string;
  payment_provider?: string;
}

export interface InvoiceItem {
  id: number;
  invoice: number;
  item_type: 'course' | 'subscription' | 'other';
  item_id?: number | null;
  course?: number | null;
  description: string;
  quantity: number;
  unit_price: string;
  tax_rate: string;
  subtotal: string;
  tax_amount: string;
  total: string;
  enrollment?: number | null;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_type: InvoiceType;
  user?: number | null;
  user_name: string;
  organization?: number | null;
  organization_name: string;
  course?: number | null;
  course_title: string;
  payment?: string | null;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  issue_date: string;
  due_date?: string | null;
  status: InvoiceStatus;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  paid_amount: string;
  remaining_amount: string;
  is_paid: boolean;
  currency: string;
  notes?: string;
  internal_notes?: string;
  invoice_pdf_url?: string | null;
  created_at: string;
  updated_at: string;
  paid_at?: string | null;
  items: InvoiceItem[];
}

export interface InvoiceCreateRequest {
  user?: number | null;
  organization?: number | null;
  course?: number | null;
  payment?: string | null;
  invoice_type?: InvoiceType;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  issue_date?: string;
  due_date?: string | null;
  status?: InvoiceStatus;
  subtotal?: string;
  tax_amount?: string;
  total_amount?: string;
  paid_amount?: string;
  currency?: string;
  notes?: string;
  internal_notes?: string;
}

export interface Transaction {
  id: number;
  invoice?: number | null;
  invoice_number: string;
  user?: number | null;
  user_name: string;
  organization?: number | null;
  organization_name: string;
  course?: number | null;
  course_title: string;
  transaction_id: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  payment_method: PaymentMethodType;
  payment_provider?: string;
  gateway_transaction_id?: string | null;
  gateway_response?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  card_last4?: string;
  card_brand?: string;
  webhook_received: boolean;
}

export interface Subscription {
  id: number;
  name: string;
  description?: string;
  price: string;
  currency: string;
  billing_cycle: BillingCycle;
  features?: Record<string, unknown>;
  max_courses?: number | null;
  max_users?: number | null;
  trial_days: number;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: number;
  user: number;
  user_email: string;
  organization?: number | null;
  organization_name: string;
  subscription: number;
  subscription_name: string;
  status: UserSubscriptionStatus;
  start_date: string;
  end_date?: string | null;
  trial_end_date?: string | null;
  auto_renew: boolean;
  cancelled_at?: string | null;
  price: string;
  currency: string;
  is_trial: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscriptionCreateRequest {
  subscription: number;
  organization?: number | null;
  end_date?: string | null;
  trial_end_date?: string | null;
  auto_renew?: boolean;
}

// PAGINATION & COMMON TYPES(Kind of needed for consistent typing across all list endpoints)

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

// Superadmin – Audit Logs
export interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  email: string;
  action: 'Login' | 'Created' | 'Updated' | 'Deleted' | 'Logout';
  resource: 'User' | 'Course' | 'Organization' | 'Payment';
  details: string;
  ip: string;
}

export interface AuditLogFilters {
  search?: string;
  from?: string;
  to?: string;
  action?: string;
  resource?: string;
  page?: number;
  page_size?: number;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
}