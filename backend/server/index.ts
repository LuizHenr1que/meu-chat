import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Usuário conectado: " + socket.id);
  socket.on("message", (message) => {
    console.log("Mensagem recebida: ", message);
        io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado: " + socket.id);
  });
});

server.listen(4000, () => {
  console.log("Servidor Socket rodando na porta 4000");
});
