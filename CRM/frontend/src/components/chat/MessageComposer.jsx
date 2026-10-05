import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { communicationApi } from '../../api/communicationApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Send, Paperclip } from 'lucide-react';

export default function MessageComposer({ conversationId, onSent }) {
  const [content, setContent] = useState('');
  const { publish } = useWebSocket();
  const textRef = useRef(null);

  const sendMutation = useMutation({
    mutationFn: () => communicationApi.sendMessage({ conversationId, content }),
    onSuccess: () => {
      setContent('');
      onSent?.();
      textRef.current?.focus();
    },
  });

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || sendMutation.isPending) return;
    
    // Try WebSocket first, fall back to REST
    try {
      publish('/app/chat.send', { conversationId, content: trimmed });
      setContent('');
      onSent?.();
    } catch {
      sendMutation.mutate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
        <textarea
          ref={textRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none focus:outline-none max-h-32 overflow-y-auto py-1 px-2"
          style={{ minHeight: '36px' }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sendMutation.isPending}
          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
