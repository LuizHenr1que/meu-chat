import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import * as serviceAccount from './chatsocket-1cd90-firebase-adminsdk-fbsvc-aa960d68da.json';


initializeApp({
  credential: cert(serviceAccount as any),
});
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const onlineUsers = new Set<string>();

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));

  try {
    const decoded = await getAuth().verifyIdToken(token);
    (socket as any).username = decoded.email;
    next();
  } catch (err) {
    console.error('Token error', err);
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const username = (socket as any).username;
  onlineUsers.add(username);

  io.emit('userOnline', Array.from(onlineUsers));

  socket.on('message', (msg) => {
    io.emit('message', { username, msg });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(username);
    io.emit('userOnline', Array.from(onlineUsers));
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
