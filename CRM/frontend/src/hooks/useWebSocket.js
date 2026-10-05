import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

let stompClient = null;
const subscriptions = new Map();

export function useWebSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const clientRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL || ''}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WebSocket] Connected');
        stompClient = client;
        clientRef.current = client;
        // Re-subscribe all pending subscriptions
        subscriptions.forEach((callback, topic) => {
          client.subscribe(topic, (msg) => {
            try {
              callback(JSON.parse(msg.body));
            } catch (e) {
              callback(msg.body);
            }
          });
        });
        // Subscribe to personal notifications
        client.subscribe('/user/queue/notifications', (msg) => {
          try {
            addNotification(JSON.parse(msg.body));
          } catch {}
        });
      },
      onDisconnect: () => {
        console.log('[WebSocket] Disconnected');
        stompClient = null;
        clientRef.current = null;
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      stompClient = null;
      clientRef.current = null;
    };
  }, [isAuthenticated, token]);

  const subscribe = useCallback((topic, callback) => {
    subscriptions.set(topic, callback);
    if (stompClient?.connected) {
      const sub = stompClient.subscribe(topic, (msg) => {
        try {
          callback(JSON.parse(msg.body));
        } catch (e) {
          callback(msg.body);
        }
      });
      return () => {
        sub.unsubscribe();
        subscriptions.delete(topic);
      };
    }
    return () => subscriptions.delete(topic);
  }, []);

  const publish = useCallback((destination, body) => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('[WebSocket] Cannot publish — not connected');
    }
  }, []);

  const isConnected = () => !!stompClient?.connected;

  return { subscribe, publish, isConnected };
}
