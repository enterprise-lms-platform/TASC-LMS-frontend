/**
 * Notifications API Service
 * Handles user notifications
 * Endpoints: /api/v1/notifications/
 */

import { apiClient } from '../utils/config';
import type { PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/notifications';

export interface Notification {
  id: number;
  type: 'approval' | 'registration' | 'system' | 'milestone';
  title: string;
  description: string;
  is_read: boolean;
  link?: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationListParams {
  type?: string;
  is_read?: boolean;
  page?: number;
  page_size?: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export const notificationApi = {
  // Get all notifications
  getAll: (params?: NotificationListParams) =>
    apiClient.get<PaginatedResponse<Notification>>(`${BASE_PATH}/`, { params }),

  // Get notification by ID
  getById: (id: number) =>
    apiClient.get<Notification>(`${BASE_PATH}/${id}/`),

  // Mark notification as read
  markAsRead: (id: number) =>
    apiClient.post<Notification>(`${BASE_PATH}/${id}/mark_read/`),

  // Mark all notifications as read
  markAllAsRead: () =>
    apiClient.post<{ message: string; count: number }>(`${BASE_PATH}/mark_all_read/`),

  // Get unread count
  getUnreadCount: () =>
    apiClient.get<UnreadCountResponse>(`${BASE_PATH}/unread_count/`),
};

export default notificationApi;
