/**
 * Reports API Service
 * Handles organization report generation and management
 * Endpoints: /api/v1/learning/reports/
 */

import { apiClient } from '../utils/config';
import type { PaginatedResponse } from '../types/types';

const BASE_PATH = '/api/v1/learning/reports';

export interface ReportType {
  id: string;
  name: string;
  description: string;
}

export interface Report {
  id: number;
  report_type: string;
  name: string;
  generated_by: number;
  generated_at: string;
  status: 'processing' | 'ready' | 'failed';
  file?: string;
  file_size?: string;
  parameters?: Record<string, any>;
}

export interface ReportGenerateRequest {
  report_type: string;
  parameters?: Record<string, any>;
}

export interface ReportListParams {
  report_type?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export const reportsApi = {
  // Get available report types
  getTypes: () =>
    apiClient.get<ReportType[]>(`${BASE_PATH}/types/`),

  // Get all reports
  getAll: (params?: ReportListParams) =>
    apiClient.get<PaginatedResponse<Report>>(`${BASE_PATH}/`, { params }),

  // Get report by ID
  getById: (id: number) =>
    apiClient.get<Report>(`${BASE_PATH}/${id}/`),

  // Generate a new report
  generate: (data: ReportGenerateRequest) =>
    apiClient.post<Report>(`${BASE_PATH}/`, data),

  // Download report
  download: (id: number) =>
    apiClient.get<{ download_url: string; file_size: string }>(`${BASE_PATH}/${id}/download/`),
};

export default reportsApi;
