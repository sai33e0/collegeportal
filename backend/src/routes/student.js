import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(authenticateToken);
router.use(requireRole([ROLES.STUDENT]));

// GET /student/profile - Get student profile
router.get('/profile', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        users(full_name, role_id),
        departments(name, code)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({ profile: data });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /student/subjects - Get enrolled subjects
router.get('/subjects', async (req, res) => {
  try {
    // First get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Get subjects (placeholder - will need enrollment logic later)
    const { data, error } = await supabase
      .from('subjects')
      .select('*, departments(name)')
      .order('code');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subjects' });
    }

    res.json({ subjects: data });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// GET /student/marks - Get marks (placeholder)
router.get('/marks', async (req, res) => {
  try {
    // Placeholder for marks functionality
    res.json({
      message: 'Marks module coming soon',
      marks: []
    });
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

export default router;
