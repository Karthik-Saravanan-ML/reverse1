import React from 'react';

export default function UserAvatar({ user, size = 'md', showOnline = false }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || '?';

  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ];

  const colorIndex = (user?.firstName?.charCodeAt(0) || 0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className="relative inline-flex flex-shrink-0">
      {user?.profilePhotoUrl ? (
        <img
          src={user.profilePhotoUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold ${colorClass}`}>
          {initials}
        </div>
      )}
      {showOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
