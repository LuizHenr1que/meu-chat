import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; 

import authRouter from './routes/auth';
import { authenticateToken } from './middleware/auth';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Simples armazenamento de usuários online (em memória)
const onlineUsers = new Set<string>();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token missing'));

  jwt.verify(token, 'secreta', (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) return next(new Error('Invalid token'));
    (socket as any).username = (decoded as any).username;
    next();
  });
});

io.on('connection', (socket) => {
  const username = (socket as any).username;
  onlineUsers.add(username);

  io.emit('userOnline', Array.from(onlineUsers));

  socket.on('message', (msg) => {
    // reenvia para todos os clients
    io.emit('message', { username, msg });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(username);
    io.emit('userOnline', Array.from(onlineUsers));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});