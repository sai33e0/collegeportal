import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user's role from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role_id, full_name')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    // Return token and role
    res.json({
      access_token: authData.session.access_token,
      role_id: userData.role_id,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: userData.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await supabase.auth.signOut();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
