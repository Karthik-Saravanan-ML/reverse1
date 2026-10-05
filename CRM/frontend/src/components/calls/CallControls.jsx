import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Users } from 'lucide-react';

export default function CallControls({
  isMuted, isCameraOn, callType, onToggleMute, onToggleCamera, onLeave, participantCount
}) {
  return (
    <div className="h-20 bg-gray-800/90 backdrop-blur flex items-center justify-center gap-4 px-6 border-t border-gray-700">
      {/* Participant count */}
      <div className="flex items-center gap-1.5 text-gray-400 text-sm mr-4">
        <Users size={16} />
        <span>{participantCount}</span>
      </div>

      {/* Mute */}
      <button
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className={`p-3.5 rounded-full transition-colors ${
          isMuted
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Camera (video calls only) */}
      {callType === 'VIDEO' && (
        <button
          onClick={onToggleCamera}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          className={`p-3.5 rounded-full transition-colors ${
            !isCameraOn
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
      )}

      {/* End Call */}
      <button
        onClick={onLeave}
        title="Leave call"
        className="p-3.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors ml-4"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
}
