import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Users, MessageSquare } from 'lucide-react';
import SimplePeer from 'simple-peer';
import { useWebSocket } from '../../hooks/useWebSocket';
import VideoTile from './VideoTile';
import CallControls from './CallControls';

export default function CallRoom({ session, currentUser, onLeave }) {
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(session.callType === 'VIDEO');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef(null);
  const peersRef = useRef({});
  const { subscribe, publish } = useWebSocket();

  // Get local media
  useEffect(() => {
    const constraints = {
      audio: true,
      video: session.callType === 'VIDEO',
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Join the call signaling
        publish(`/app/call.join`, {
          sessionId: session.id,
          userId: currentUser.id,
        });
      })
      .catch((err) => {
        console.error('Media access error:', err);
      });

    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Subscribe to WebRTC signaling
  useEffect(() => {
    const unsubSignal = subscribe(
      `/topic/call/${session.id}/signal`,
      (signal) => {
        if (signal.from === currentUser.id) return;
        handleSignal(signal);
      }
    );
    const unsubJoin = subscribe(
      `/topic/call/${session.id}/join`,
      (event) => {
        if (event.userId !== currentUser.id) {
          initPeer(event.userId, true);
        }
      }
    );
    const unsubLeave = subscribe(
      `/topic/call/${session.id}/leave`,
      (event) => {
        removePeer(event.userId);
      }
    );
    return () => { unsubSignal(); unsubJoin(); unsubLeave(); };
  }, [localStream]);

  const initPeer = useCallback((userId, initiator) => {
    if (!localStream) return;
    const peer = new SimplePeer({
      initiator,
      stream: localStream,
      trickle: true,
    });
    peer.on('signal', (data) => {
      publish(`/app/call.signal`, {
        sessionId: session.id,
        from: currentUser.id,
        to: userId,
        signal: data,
      });
    });
    peer.on('stream', (remoteStream) => {
      setStreams((prev) => ({ ...prev, [userId]: remoteStream }));
    });
    peer.on('close', () => removePeer(userId));
    peersRef.current[userId] = peer;
    setPeers((prev) => ({ ...prev, [userId]: peer }));
  }, [localStream, session.id, currentUser.id]);

  const handleSignal = useCallback((signal) => {
    const peer = peersRef.current[signal.from];
    if (peer) {
      peer.signal(signal.signal);
    } else {
      initPeer(signal.from, false);
      // Signal after init — happens in next render cycle
      setTimeout(() => {
        peersRef.current[signal.from]?.signal(signal.signal);
      }, 100);
    }
  }, [initPeer]);

  const removePeer = (userId) => {
    peersRef.current[userId]?.destroy();
    delete peersRef.current[userId];
    setPeers((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    setStreams((prev) => { const n = { ...prev }; delete n[userId]; return n; });
  };

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach((t) => { t.enabled = isMuted; });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((t) => { t.enabled = !isCameraOn; });
    setIsCameraOn(!isCameraOn);
  };

  const handleLeave = () => {
    publish(`/app/call.leave`, { sessionId: session.id, userId: currentUser.id });
    Object.values(peersRef.current).forEach((p) => p.destroy());
    localStream?.getTracks().forEach((t) => t.stop());
    onLeave?.();
  };

  const participants = [
    { id: currentUser.id, name: 'You', stream: localStream, isMuted, isLocal: true },
    ...Object.entries(streams).map(([userId, stream]) => ({
      id: userId,
      name: session.participants?.find((p) => p.userId === userId)?.userName || 'Participant',
      stream,
      isLocal: false,
    })),
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 p-4 grid gap-3 overflow-hidden"
        style={{
          gridTemplateColumns: participants.length <= 2
            ? 'repeat(auto-fill, minmax(45%, 1fr))'
            : 'repeat(auto-fill, minmax(30%, 1fr))',
        }}
      >
        {participants.map((p) => (
          <VideoTile
            key={p.id}
            participant={p}
            isLocal={p.isLocal}
            callType={session.callType}
          />
        ))}
      </div>

      {/* Controls */}
      <CallControls
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        callType={session.callType}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onLeave={handleLeave}
        participantCount={participants.length}
      />
    </div>
  );
}
