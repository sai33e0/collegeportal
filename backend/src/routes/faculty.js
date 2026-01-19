import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All faculty routes require authentication and faculty role
router.use(authenticateToken);
router.use(requireRole([ROLES.FACULTY]));

// GET /faculty/profile - Get faculty profile
router.get('/profile', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faculty')
      .select(`
        *,
        users(full_name, role_id),
        departments(name, code)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Faculty profile not found' });
    }

    res.json({ profile: data });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /faculty/subjects - Get assigned subjects
router.get('/subjects', async (req, res) => {
  try {
    // First get faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    // Get assigned subjects
    const { data, error } = await supabase
      .from('faculty_subjects')
      .select(`
        *,
        subjects(*, departments(name))
      `)
      .eq('faculty_id', facultyData.id);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subjects' });
    }

    res.json({ subjects: data.map(fs => fs.subjects) });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// GET /faculty/students - Get students (placeholder)
router.get('/students', async (req, res) => {
  try {
    // Placeholder for student roster functionality
    res.json({
      message: 'Student roster coming soon',
      students: []
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

export default router;
