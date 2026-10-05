import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { callsApi } from '../../../api/communicationApi';
import { useAuthStore } from '../../../store/authStore';
import CallRoom from '../../../components/calls/CallRoom';
import Button from '../../../components/ui/Button';
import { Phone, Video, PhoneOff, Clock } from 'lucide-react';

export default function CallsTab({ projectId }) {
  const { user } = useAuthStore();
  const [activeCall, setActiveCall] = useState(null);

  const initiateCall = useMutation({
    mutationFn: ({ callType }) => callsApi.initiateCall({ projectId, callType }),
    onSuccess: (session) => setActiveCall(session),
  });

  if (activeCall) {
    return (
      <CallRoom
        session={activeCall}
        currentUser={user}
        onLeave={() => setActiveCall(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Phone size={20} className="text-blue-600" />
        Calls
      </h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Video size={28} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Start a Project Call</h3>
            <p className="text-sm text-gray-500 mt-1">
              Start an audio or video call with your project team
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => initiateCall.mutate({ callType: 'AUDIO' })}
              loading={initiateCall.isPending}
              variant="secondary"
            >
              <Phone size={16} className="mr-1.5" />
              Audio Call
            </Button>
            <Button
              onClick={() => initiateCall.mutate({ callType: 'VIDEO' })}
              loading={initiateCall.isPending}
            >
              <Video size={16} className="mr-1.5" />
              Video Call
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium">WebRTC calls are peer-to-peer</p>
        <p className="mt-1 text-amber-700">Calls use your browser's WebRTC capabilities. Both participants must have camera/microphone permissions enabled.</p>
      </div>
    </div>
  );
}
