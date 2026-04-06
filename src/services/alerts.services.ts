/**
 * Alerts API Service (stub)
 * Finance alerts endpoint — pending backend implementation.
 * Replace with real apiClient calls once /api/v1/finance/alerts/ is available.
 */

import { apiClient } from '../utils/config';

export const alertsApi = {
  markAllAsRead: () =>
    apiClient.post('/api/v1/finance/alerts/mark-all-read/'),

  delete: (alertId: string) =>
    apiClient.delete(`/api/v1/finance/alerts/${alertId}/`),
};
