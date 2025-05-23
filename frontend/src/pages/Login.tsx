import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
