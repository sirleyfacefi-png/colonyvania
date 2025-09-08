import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    if (!rooms.has(roomId)) rooms.set(roomId, []);
    const room = rooms.get(roomId);
    if (room.length >= 2) {
      // sala cheia
      socket.emit('full');
      return;
    }
    room.push(socket.id);
    socket.join(roomId);

    if (room.length === 2) {
      io.to(roomId).emit('start');
    }

    socket.on('state', (state) => {
      socket.to(roomId).emit('state', { id: socket.id, state });
    });

    socket.on('disconnect', () => {
      const r = rooms.get(roomId);
      if (r) {
        rooms.set(roomId, r.filter((id) => id !== socket.id));
        io.to(roomId).emit('end');
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
