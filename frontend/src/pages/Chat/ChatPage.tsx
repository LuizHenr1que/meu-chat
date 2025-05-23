import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import io, { Socket } from 'socket.io-client';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

import ChatWindow from '../../components/ChatComponent/ChatWindow';
import MessageInput from '../../components/ChatComponent/MessageInput';
import ChatActions from '../../components/ChatComponent/ChatActions';

interface Message {
  username: string;
  msg: string;
  timestamp?: Date | number;
}

interface ChatPageProps {
  token: string;
  onLogout: () => void;
}

export default function ChatPage({ token, onLogout }: ChatPageProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;

    // Consulta Firestore para mensagens ordenadas
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    // Escuta mensagens do Firestore
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => doc.data() as Message);
      setMessages(msgs);
    });

    // Conectar socket.io
    const newSocket = io('http://localhost:3000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket');
    });

    newSocket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('userOnline', (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      unsubscribeFirestore();
      newSocket.disconnect();
    };
  }, [token]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMessages([]);
      setOnlineUsers([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      onLogout();
      console.log('Logged out');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-4xl font-extrabold text-green-700 text-center">Chat</h2>

        <ChatWindow
          messages={messages}
          onlineUsers={onlineUsers}
          currentUser={auth.currentUser?.displayName || 'me'}
        />

        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />

        <ChatActions
          logout={logout}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
