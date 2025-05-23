import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  username: string;
  msg: string;
}

let socket: Socket;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    socket = io('http://localhost:3000', { auth: { token } });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', input);
    setInput('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((m, i) => (
          <div key={i}><b>{m.username}</b>: {m.msg}</div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
