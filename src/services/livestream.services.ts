/**
 * Livestream API Service
 * Handles livestream sessions, attendance, and recordings
 */

import { apiClient } from '../utils/config';

const BASE_PATH = '/api/v1/livestream';

// ── Types ──

export interface LivestreamSession {
  id: string;
  course: number;
  course_title?: string;
  instructor: number;
  instructor_name?: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  timezone: string;
  platform: 'zoom' | 'google_meet' | 'teams' | 'custom';
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  join_url: string;
  start_url: string;
  password: string;
  recording_url: string;
  is_recurring: boolean;
  recurrence_pattern: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  recurrence_end_date: string | null;
  auto_recording: boolean;
  waiting_room: boolean;
  mute_on_entry: boolean;
  allow_chat: boolean;
  allow_questions: boolean;
  max_attendees: number;
  zoom_meeting_id: string;
  calendar_event_id: string;
  teams_meeting_id: string;
  teams_join_url: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  question_count?: number;
  calendar_links?: {
    google: string;
    outlook: string;
    yahoo: string;
    ics: string;
  };
}

export interface LivestreamSessionCreateRequest {
  course: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  timezone?: string;
  platform: 'zoom' | 'google_meet' | 'teams' | 'custom';
  join_url?: string;       // for "custom" platform — paste URL
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string | null;
  auto_recording?: boolean;
  waiting_room?: boolean;
  mute_on_entry?: boolean;
  allow_chat?: boolean;
  allow_questions?: boolean;
  max_attendees?: number;
}

export interface LivestreamAttendance {
  id: string;
  session: string;
  learner: number;
  learner_name?: string;
  learner_email?: string;
  status: 'registered' | 'attended' | 'absent';
  joined_at: string | null;
  left_at: string | null;
  duration_seconds: number;
  attendance_percentage: number;
}

export interface LivestreamRecording {
  id: string;
  session: string;
  session_title?: string;
  recording_url: string;
  duration_seconds: number;
  file_size: number;
  recorded_at: string;
}

export interface LivestreamListParams {
  course?: number;
  status?: string;
  platform?: string;
  instructor?: number;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface LivestreamAttendanceParams {
  session?: string;
  learner?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface LivestreamActionRequest {
  action: 'start' | 'end' | 'cancel' | 'remind' | 'send_recording';
}

export interface PaginatedLivestreamResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── API ──

export const livestreamApi = {
  // List all livestream sessions
  getAll: (params?: LivestreamListParams) =>
    apiClient.get<PaginatedLivestreamResponse<LivestreamSession>>(
      `${BASE_PATH}/livestreams/`, { params }
    ),

  // Get session details by ID
  getById: (id: string) =>
    apiClient.get<LivestreamSession>(`${BASE_PATH}/livestreams/${id}/`),

  // Create a new session
  create: (data: LivestreamSessionCreateRequest) =>
    apiClient.post<LivestreamSession>(`${BASE_PATH}/livestreams/`, data),

  // Update a session
  update: (id: string, data: Partial<LivestreamSessionCreateRequest>) =>
    apiClient.put<LivestreamSession>(`${BASE_PATH}/livestreams/${id}/`, data),

  // Partially update a session
  partialUpdate: (id: string, data: Partial<LivestreamSessionCreateRequest>) =>
    apiClient.patch<LivestreamSession>(`${BASE_PATH}/livestreams/${id}/`, data),

  // Delete a session
  delete: (id: string) =>
    apiClient.delete(`${BASE_PATH}/livestreams/${id}/`),

  // Perform action on a session (start, end, cancel, remind, send_recording)
  action: (id: string, data: LivestreamActionRequest) =>
    apiClient.post<LivestreamSession>(
      `${BASE_PATH}/livestreams/${id}/action/`, data
    ),

  // Get join info
  join: (id: string) =>
    apiClient.get<LivestreamSession>(`${BASE_PATH}/livestreams/${id}/join/`),

  // Get attendance report
  attendanceReport: (id: string) =>
    apiClient.get(`${BASE_PATH}/livestreams/${id}/attendance_report/`),
};

export const livestreamAttendanceApi = {
  // List attendance records
  getAll: (params?: LivestreamAttendanceParams) =>
    apiClient.get<PaginatedLivestreamResponse<LivestreamAttendance>>(
      `${BASE_PATH}/livestream-attendance/`, { params }
    ),

  // Get attendance detail
  getById: (id: string) =>
    apiClient.get<LivestreamAttendance>(
      `${BASE_PATH}/livestream-attendance/${id}/`
    ),
};
