import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { useWebSocket } from './useWebSocket';
import { useAuthStore } from '../store/authStore';

export const useNotifications = () => {
  const { user } = useAuthStore();
  const { notifications, unreadCount, addNotification, markAsRead, markAllRead } = useNotificationStore();

  useWebSocket(user ? \`/user/\${user.id}/queue/notifications\` : null, (notification) => {
    addNotification(notification);
  });

  return { notifications, unreadCount, markAsRead, markAllRead };
};
