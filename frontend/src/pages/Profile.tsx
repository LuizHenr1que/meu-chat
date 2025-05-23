import { useEffect, useState } from 'react';
import api from '../api';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/profile')
      .then(res => setUser(res.data.user))
      .catch(() => {
        alert('Unauthorized');
        navigate('/login');
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Perfil</h1>
      {user && <p>Bem vindo {user.username}</p>}
      <button onClick={logout}>Sair</button>
      <Chat />
    </div>
  );
}
