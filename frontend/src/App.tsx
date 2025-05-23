import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import io, { Socket } from 'socket.io-client';

interface Message {
  username: string;
  msg: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      setToken(token);
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const register = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      setToken(token);
    } catch (err) {
      console.error('Register error', err);
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
      console.log('Logged out');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const t = await u.getIdToken();
        setToken(t);
      } else {
        setUser(null);
        setToken(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (token) {
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
        newSocket.disconnect();
      };
    }
  }, [token]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <div>
          <h2>Login/Register</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Chat</h2>
          <div><strong>Online:</strong> {onlineUsers.join(', ')}</div>
          <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i}><strong>{m.username}:</strong> {m.msg}</div>
            ))}
          </div>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button onClick={sendMessage}>Send</button>
          <button onClick={logout} style={{ marginLeft: '10px', color: 'red' }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
