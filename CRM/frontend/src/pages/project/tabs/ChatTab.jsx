import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communicationApi } from '../../../api/communicationApi';
import ChatWindow from '../../../components/chat/ChatWindow';
import Spinner from '../../../components/ui/Spinner';
import { MessageSquare } from 'lucide-react';

export default function ChatTab({ projectId }) {
  const { data: conversation, isLoading } = useQuery({
    queryKey: ['project-conversation', projectId],
    queryFn: () => communicationApi.getProjectConversation(projectId),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="h-[calc(100vh-280px)] min-h-96 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
      {conversation ? (
        <ChatWindow
          conversationId={conversation.id}
          conversationName="Project Chat"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No chat available for this project</p>
          </div>
        </div>
      )}
    </div>
  );
}
