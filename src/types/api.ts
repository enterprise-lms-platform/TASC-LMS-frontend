// API Types based on SYSTEM_CONTEXT.md backend contract

// User Roles from backend
export type UserRole = 'learner' | 'instructor' | 'org_admin' | 'lms_manager' | 'finance' | 'tasc_admin';

// User object returned from /api/v1/auth/me/
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name: string; // Full name
  username?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  phone_number?: string;
  country?: string;
  timezone?: string;
  profile_picture?: string;
  google_picture?: string | null;
  avatar?: string | null;
  date_joined?: string;
}

// Auth API Requests
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uidb64: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface InviteUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface SetPasswordFromInviteRequest {
  new_password: string;
  confirm_password: string;
}

// Auth API Responses
export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User; // Optional: included in Google OAuth response
  is_new_user?: boolean; // Optional: included in Google OAuth response
}

export interface RefreshTokenResponse {
  access: string;
}

export interface LogoutResponse {
  message: string;
}

export interface EmailVerificationResponse {
  message: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface InviteUserResponse {
  detail: string;
  email: string;
}

export interface SetPasswordFromInviteResponse {
  detail: string;
}

// API Error Response
export interface ApiErrorResponse {
  detail?: string;
  [key: string]: string[] | string | undefined;
}

// Pagination Response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ========================================
// Public Catalogue Types (unauthenticated endpoints)
// ========================================

// Category
export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  parent: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tag
export interface PublicTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

// Course Level
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

// Session Type
export type SessionType = 'video' | 'text' | 'live';

// Session (public - excludes video_url and content_text)
export interface PublicSession {
  id: number;
  title: string;
  description: string;
  session_type: SessionType;
  order: number;
  video_duration_seconds: number | null;
  duration_minutes: number;
  is_free_preview: boolean;
  is_mandatory: boolean;
}

// Instructor (public - minimal info)
export interface PublicInstructor {
  id: number;
  name: string;
  avatar: string | null;
}

// Course List Item (from CourseListSerializer)
export interface PublicCourse {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  thumbnail: string | null;
  category: PublicCategory;
  tags: PublicTag[];
  level: CourseLevel;
  price: string; // Decimal as string from backend
  discounted_price: number;
  discount_percentage: number;
  duration_hours: number;
  duration_weeks: number;
  total_sessions: number;
  instructor: number;
  instructor_name: string | null;
  enrollment_count: number;
  featured: boolean;
  status: 'published';
  published_at: string | null;
}

// Course Detail (from PublicCourseDetailSerializer)
export interface PublicCourseDetail extends Omit<PublicCourse, 'instructor'> {
  description: string; // Full HTML description
  prerequisites: string;
  learning_objectives: string;
  target_audience: string;
  trailer_video_url: string | null;
  sessions: PublicSession[];
  instructor: PublicInstructor | null; // Full instructor object in detail view
  created_at: string;
  updated_at: string;
}
