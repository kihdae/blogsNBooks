import express from 'express';
import authService from '../services/authService';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await authService.register(req.body.username, req.body.password, req.body.isAdmin);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const token = await authService.login(req.body.username, req.body.password);
  if (token) {
    res.json(token);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

export default router;