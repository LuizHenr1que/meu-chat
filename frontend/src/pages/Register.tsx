import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { username, password });
      alert('User registered!');
      navigate('/login');
    } catch (err) {
      alert('Error registering: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
