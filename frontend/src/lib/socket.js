import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  // Reconnection settings
  reconnection: true,
  reconnectionAttempts: 10, // Limited attempts
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  // Timeout settings
  timeout: 10000, // Reduced from 20s to 10s
  // Auth settings
  withCredentials: true,
  // Connection settings
  autoConnect: false,
  forceNew: false, // Changed to false for better performance
  // Protocol options
  upgrade: true,
  rememberUpgrade: true,
  // Debugging
  debug: process.env.NODE_ENV !== 'production'
});

// Enhanced auth handling
export const connectSocket = (userId, token) => {
  socket.auth = { 
    userId, 
    token,
    timestamp: Date.now() 
  };
  
  // Clear previous listeners to avoid duplicates
  socket.off('connect_error');
  
  // Add error handler
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
  
  socket.connect();
};

export default socket;
