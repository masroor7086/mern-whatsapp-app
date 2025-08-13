import { io } from 'socket.io-client';

const socket = io({
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  withCredentials: true,
  autoConnect: false, // Connect manually after auth
  forceNew: true // Prevent connection reuse
});

// Auth handling example
export const connectSocket = (userId, token) => {
  socket.auth = { userId, token };
  socket.connect();
};

export default socket;
