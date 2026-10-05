import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function MessageItem({ message, isOwn, showSender }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {showSender && !isOwn && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {message.senderName || 'Unknown'}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-sm break-words ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}
        >
          {message.content}
          {message.isEdited && (
            <span className={`text-xs ml-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>(edited)</span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 px-1 mt-0.5">
          {message.createdAt
            ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
            : ''}
        </span>
      </div>
    </div>
  );
}
