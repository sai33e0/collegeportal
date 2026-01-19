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

// POST /admin/students - Create new student
router.post('/students', async (req, res) => {
  try {
    const { email, password, full_name, roll_no, dept_id, semester, year_of_admission } = req.body;

    if (!email || !password || !full_name || !roll_no || !dept_id) {
      return res.status(400).json({ error: 'Email, password, full_name, roll_no, and dept_id are required' });
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

    // Create user record in users table with role_id = 1 (Student)
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        full_name,
        role_id: ROLES.STUDENT
      }]);

    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user record' });
    }

    // Create student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert([{
        user_id: authData.user.id,
        roll_no,
        dept_id,
        semester: semester || 1,
        year_of_admission: year_of_admission || new Date().getFullYear()
      }])
      .select()
      .single();

    if (studentError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create student record: ' + studentError.message });
    }

    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: studentData.id,
        email: authData.user.email,
        full_name,
        roll_no,
        dept_id,
        semester: studentData.semester,
        year_of_admission: studentData.year_of_admission
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// GET /admin/students - List all students
router.get('/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        users(full_name),
        departments(name, code)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    res.json({ students: data });
  } catch (error) {
    console.error('List students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// PUT /admin/students/:id - Update student
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roll_no, dept_id, semester, full_name } = req.body;

    const updateData = {};
    if (roll_no) updateData.roll_no = roll_no;
    if (dept_id) updateData.dept_id = dept_id;
    if (semester) updateData.semester = semester;

    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update user full_name if provided
    if (full_name && data.user_id) {
      await supabase
        .from('users')
        .update({ full_name })
        .eq('id', data.user_id);
    }

    res.json({ message: 'Student updated successfully', student: data });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /admin/students/:id - Delete student
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get student's user_id first
    const { data: studentData, error: fetchError } = await supabase
      .from('students')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete auth user (cascades to users and students tables)
    if (studentData.user_id) {
      await supabase.auth.admin.deleteUser(studentData.user_id);
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// POST /admin/faculty - Create new faculty
router.post('/faculty', async (req, res) => {
  try {
    const { email, password, full_name, employee_id, dept_id, designation } = req.body;

    if (!email || !password || !full_name || !employee_id || !dept_id) {
      return res.status(400).json({ error: 'Email, password, full_name, employee_id, and dept_id are required' });
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

    // Create user record in users table with role_id = 2 (Faculty)
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        full_name,
        role_id: ROLES.FACULTY
      }]);

    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user record' });
    }

    // Create faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .insert([{
        user_id: authData.user.id,
        employee_id,
        dept_id,
        designation: designation || 'Assistant Professor'
      }])
      .select()
      .single();

    if (facultyError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create faculty record: ' + facultyError.message });
    }

    res.status(201).json({
      message: 'Faculty created successfully',
      faculty: {
        id: facultyData.id,
        email: authData.user.email,
        full_name,
        employee_id,
        dept_id,
        designation: facultyData.designation
      }
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

// GET /admin/faculty - List all faculty
router.get('/faculty', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faculty')
      .select(`
        *,
        users(full_name),
        departments(name, code)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch faculty' });
    }

    res.json({ faculty: data });
  } catch (error) {
    console.error('List faculty error:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// PUT /admin/faculty/:id - Update faculty
router.put('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, dept_id, designation, full_name } = req.body;

    const updateData = {};
    if (employee_id) updateData.employee_id = employee_id;
    if (dept_id) updateData.dept_id = dept_id;
    if (designation) updateData.designation = designation;

    const { data, error } = await supabase
      .from('faculty')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update user full_name if provided
    if (full_name && data.user_id) {
      await supabase
        .from('users')
        .update({ full_name })
        .eq('id', data.user_id);
    }

    res.json({ message: 'Faculty updated successfully', faculty: data });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
});

// DELETE /admin/faculty/:id - Delete faculty
router.delete('/faculty/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get faculty's user_id first
    const { data: facultyData, error: fetchError } = await supabase
      .from('faculty')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Delete auth user (cascades to users and faculty tables)
    if (facultyData.user_id) {
      await supabase.auth.admin.deleteUser(facultyData.user_id);
    }

    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

export default router;
