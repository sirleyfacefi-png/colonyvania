import { io } from 'socket.io-client';

export function connect(roomId) {
  const socket = io('http://localhost:3000');
  socket.emit('join', roomId);
  return socket;
}
