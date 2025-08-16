import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 10000,
  withCredentials: true,
  autoConnect: false,
  // Critical change: force WebSocket first
  upgrade: false,
  rememberUpgrade: true,
  debug: process.env.NODE_ENV !== 'production'
});

export const connectSocket = (userId, token) => {
  socket.auth = { 
    userId, 
    token,
    timestamp: Date.now() 
  };
  
  socket.off('connect_error');
  
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    // Fallback to polling if WebSocket fails
    if (err.message.includes('websocket')) {
      socket.io.opts.transports = ['polling', 'websocket'];
    }
  });
  
  socket.connect();
};

export default socket;
