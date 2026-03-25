/**
 * Messaging API Service
 * Handles conversations and messages
 * Endpoints: /api/v1/messaging/conversations/
 */

import { apiClient } from '../utils/config';
import type { PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/messaging/conversations';

export interface ParticipantDetail {
  id: number;
  name: string;
  email: string;
}

export interface MessageResponse {
  id: number;
  conversation: number;
  sender: number;
  sender_name: string;
  sender_email: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationResponse {
  id: number;
  participants: number[];
  participants_details: ParticipantDetail[];
  last_message: MessageResponse | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationListParams {
  page?: number;
  page_size?: number;
}

export interface MessageListParams {
  page?: number;
  page_size?: number;
}

export const messagingApi = {
  // List conversations for the current user
  getAll: (params?: ConversationListParams) =>
    apiClient.get<PaginatedResponse<ConversationResponse>>(`${BASE_PATH}/`, { params }),

  // Get a single conversation
  getById: (id: number) =>
    apiClient.get<ConversationResponse>(`${BASE_PATH}/${id}/`),

  // Create a new conversation
  create: (participantIds: number[]) =>
    apiClient.post<ConversationResponse>(`${BASE_PATH}/`, { participants: participantIds }),

  // Get messages in a conversation
  getMessages: (conversationId: number, params?: MessageListParams) =>
    apiClient.get<PaginatedResponse<MessageResponse>>(`${BASE_PATH}/${conversationId}/messages/`, { params }),

  // Send a message in a conversation
  sendMessage: (conversationId: number, content: string) =>
    apiClient.post<MessageResponse>(`${BASE_PATH}/${conversationId}/messages/send/`, { content }),

  // Mark all messages in a conversation as read
  markAsRead: (conversationId: number) =>
    apiClient.post<{ status: string; messages_marked_read: number }>(`${BASE_PATH}/${conversationId}/read/`),
};

export default messagingApi;
