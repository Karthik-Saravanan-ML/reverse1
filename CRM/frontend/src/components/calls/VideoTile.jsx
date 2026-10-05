import React, { useRef, useEffect } from 'react';
import { MicOff, VideoOff } from 'lucide-react';

export default function VideoTile({ participant, isLocal, callType }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  const showVideo = callType === 'VIDEO' && participant.stream;
  const initials = participant.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center aspect-video">
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl font-semibold">
          {initials || '?'}
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
        {isLocal ? 'You' : participant.name}
      </div>

      {/* Muted indicator */}
      {participant.isMuted && (
        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
          <MicOff size={12} />
        </div>
      )}

      {/* Camera off overlay */}
      {callType === 'VIDEO' && !showVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <VideoOff size={24} className="text-gray-500" />
        </div>
      )}
    </div>
  );
}
