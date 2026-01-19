import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole([ROLES.ADMIN]));

// GET /admin/dashboard - Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts for dashboard
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    const { count: facultyCount } = await supabase
      .from('faculty')
      .select('*', { count: 'exact', head: true });

    const { count: subjectCount } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true });

    res.json({
      stats: {
        students: studentCount || 0,
        faculty: facultyCount || 0,
        subjects: subjectCount || 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// POST /admin/users - Create new user
router.post('/users', async (req, res) => {
  try {
    const { email, password, full_name, role_id } = req.body;

    if (!email || !password || !full_name || !role_id) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validate role
    if (![ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT].includes(role_id)) {
      return res.status(400).json({ error: 'Invalid role_id' });
    }

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        full_name,
        role_id
      }])
      .select()
      .single();

    if (userError) {
      // Rollback: delete auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user record' });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userData.id,
        email: authData.user.email,
        full_name: userData.full_name,
        role_id: userData.role_id
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, role_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users: data });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /admin/departments - List all departments
router.get('/departments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }

    res.json({ departments: data });
  } catch (error) {
    console.error('List departments error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// POST /admin/subjects - Create new subject
router.post('/subjects', async (req, res) => {
  try {
    const { code, name, dept_id, credits } = req.body;

    if (!code || !name || !dept_id) {
      return res.status(400).json({ error: 'Code, name, and dept_id required' });
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ code, name, dept_id, credits: credits || 3 }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Subject created successfully',
      subject: data
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// GET /admin/subjects - List all subjects
router.get('/subjects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*, departments(name)')
      .order('code');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subjects' });
    }

    res.json({ subjects: data });
  } catch (error) {
    console.error('List subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// POST /admin/faculty-subjects - Assign faculty to subject
router.post('/faculty-subjects', async (req, res) => {
  try {
    const { faculty_id, subject_id, academic_year } = req.body;

    if (!faculty_id || !subject_id) {
      return res.status(400).json({ error: 'faculty_id and subject_id required' });
    }

    // Default to current academic year if not provided
    const currentYear = new Date().getFullYear();
    const year = academic_year || `${currentYear}-${currentYear + 1}`;

    const { data, error } = await supabase
      .from('faculty_subjects')
      .insert([{ faculty_id, subject_id, academic_year: year }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Faculty assigned to subject successfully',
      assignment: data
    });
  } catch (error) {
    console.error('Assign faculty error:', error);
    res.status(500).json({ error: 'Failed to assign faculty' });
  }
});

export default router;
