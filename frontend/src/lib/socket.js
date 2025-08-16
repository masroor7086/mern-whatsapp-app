import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  withCredentials: true,
  autoConnect: false,
  forceNew: false,
  // Critical changes:
  upgrade: false, // Force WebSocket first
  rememberUpgrade: true,
  // Debug
  debug: process.env.NODE_ENV === 'development'
});

export const connectSocket = (userId, token) => {
  socket.auth = { 
    userId, 
    token,
    timestamp: Date.now() 
  };
  
  socket.off('connect_error'); // Clean old listeners
  
  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    // Fallback to polling if WebSocket fails
    if (err.message.includes('websocket')) {
      socket.io.opts.transports = ['polling', 'websocket'];
    }
  });
  
  socket.connect();
};

export default socket;
