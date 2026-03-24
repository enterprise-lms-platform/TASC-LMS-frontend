import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../services/notifications.services';

/**
 * Shared hook to fetch unread notification count.
 * Polls every 60 seconds so the badge stays current.
 */
export const useUnreadNotificationCount = () => {
  const { data } = useQuery({
    queryKey: ['notificationsUnreadCount'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 60000,
  });

  return data?.data?.unread_count ?? 0;
};
