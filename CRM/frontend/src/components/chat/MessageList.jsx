import React from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, currentUserId }) {
  return (
    <div className="space-y-1">
      {messages.map((msg, idx) => {
        const isOwn = msg.senderId === currentUserId;
        const prevMsg = messages[idx - 1];
        const showSender = !prevMsg || prevMsg.senderId !== msg.senderId;

        return (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwn={isOwn}
            showSender={showSender}
          />
        );
      })}
    </div>
  );
}
