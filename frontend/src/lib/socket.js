import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io/',
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  withCredentials: true,
  autoConnect: false,
  // Critical change:
  forceNew: true, // Ensures fresh connection each time
  upgrade: false  // Force WebSocket only
});

export const connectSocket = (userId, token) => {
  socket.auth = { userId, token };
  
  socket.off('connect_error'); // Clean old listeners
  
  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    // Fallback to polling if WebSocket fails
    if (err.message.includes('websocket')) {
      socket.io.opts.transports = ['polling', 'websocket'];
      socket.connect();
    }
  });
  
  socket.connect();
};

export default socket;
