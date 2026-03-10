'use client';
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/lib/api-config';

// Module-level singleton socket for use outside React hooks
let _socket: Socket | null = null;

function getSocket(): Socket {
  if (!_socket) {
    const token = Cookies.get('token');
    _socket = io(API_CONFIG.SOCKET_URL, {
      auth: { token: token || '' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: !!token,
    });
  }
  return _socket;
}

export const socket = typeof window !== 'undefined' ? getSocket() : (null as unknown as Socket);

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    if (!socketRef.current && token && userId && userType) {
      socketRef.current = io(API_CONFIG.SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to websocket');
        socketRef.current?.emit('register', { userId, userType });
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from websocket');
      });

      socketRef.current.on('reconnect', () => {
        socketRef.current?.emit('register', { userId, userType });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, on, emit };
};
