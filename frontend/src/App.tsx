import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/Login/Login';
import ChatPage from './pages/Chat/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: import('firebase/auth').User | null) => {
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

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!user || !token) {
    return <LoginPage onLoginSuccess={setToken} />;
  }

  return <ChatPage token={token} onLogout={handleLogout} />;
}

export default App;
