import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communicationApi } from '../../api/communicationApi';
import { useAuthStore } from '../../store/authStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import Spinner from '../ui/Spinner';
import { MessageSquare } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatWindow({ conversationId, conversationName }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();
  const bottomRef = useRef(null);

  const { data: msgPage, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => communicationApi.getMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribe(`/topic/conversations/${conversationId}`, (newMsg) => {
      queryClient.setQueryData(['messages', conversationId], (old) => {
        if (!old) return { content: [newMsg] };
        const content = Array.isArray(old) ? old : (old.content || []);
        return Array.isArray(old) ? [newMsg, ...old] : { ...old, content: [newMsg, ...content] };
      });
    });
    return unsub;
  }, [conversationId, subscribe, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgPage]);

  const messages = msgPage?.content || msgPage || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <MessageSquare size={16} />
        </div>
        <h3 className="font-semibold text-gray-900">{conversationName || 'Chat'}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            <MessageList messages={[...messages].reverse()} currentUserId={user?.id} />
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <MessageComposer
          conversationId={conversationId}
          onSent={() => queryClient.invalidateQueries(['messages', conversationId])}
        />
      </div>
    </div>
  );
}
