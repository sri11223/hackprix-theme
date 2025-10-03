'use client';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const SOCKET_URL = 'https://hackprix-theme-v6r3.vercel.app';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    const userType = Cookies.get('userType');

    if (!socketRef.current && token && userId && userType) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket']
      });

      socketRef.current.emit('register', { userId, userType });

      socketRef.current.on('connect', () => {
        console.log('Connected to websocket');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from websocket');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};
