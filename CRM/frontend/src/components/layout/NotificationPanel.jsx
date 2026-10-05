import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notificationsApi';
import { useNotificationStore } from '../../store/notificationStore';
import { X, Check, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

export default function NotificationPanel({ onClose }) {
  const queryClient = useQueryClient();
  const { notifications, setNotifications, markAsRead, markAllRead } = useNotificationStore();

  const { isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    onSuccess: (data) => setNotifications(data),
  });

  const readMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, id) => {
      markAsRead(id);
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const readAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      markAllRead();
      queryClient.invalidateQueries(['notifications']);
    },
  });

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => readAllMutation.mutate()}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<Check size={32} />}
              title="All caught up!"
              description="You have no new notifications."
            />
          ) : (
            <div className="space-y-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${
                    notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    if (!notif.isRead) readMutation.mutate(notif.id);
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
