import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

const users: { [username: string]: string } = {}; 

router.post('/register', async (req, res): Promise<void> => {
  const { username, password } = req.body;
  if (users[username]) {
    res.status(400).json({ error: 'User exists' });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  users[username] = hashed;
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res): Promise<void> => {
  const { username, password } = req.body;
  const hashed = users[username];

  if (!hashed || !(await bcrypt.compare(password, hashed))) {
    res.status(400).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ username }, 'secreta', { expiresIn: '1h' });
  res.json({ token });
});

export default router;
