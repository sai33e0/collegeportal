import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, requireAdmin, ROLES } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ENDPOINT: GET /admin/departments - List all departments (NO AUTH REQUIRED)
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

// PROTECTED ROUTES BELOW

router.post('/students', requireAdmin, async (req, res) => {
  try {
    const {
      email,
      password,
      roll_no,
      department_id,
      section,
      admission_year
    } = req.body;

    // 1️⃣ Create Auth user (THIS updates Authentication → Users)
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2️⃣ Create user record in users table with role_id = 1 (STUDENT)
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        role_id: 1, // STUDENT
        full_name: email.split('@')[0] // Use part of email as name if not provided
      });

    if (userError) {
      // Rollback: delete auth user if users insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: userError.message });
    }

    // 3️⃣ Insert into students table (LINKED)
    const { error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: authData.user.id,
        roll_no,
        department_id,
        section,
        admission_year
      });

    if (studentError) {
      // Rollback: delete user and auth if student insert fails
      await supabase.from('users').delete().eq('id', authData.user.id);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: studentError.message });
    }

    res.json({ message: 'Student created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Change a student password (Admin only)
router.post('/students/:userId/password', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params; // Supabase auth user id
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'new_password is required (min 6 chars)' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, { password: new_password });
    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});
router.post('/faculty', requireAdmin, async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      employee_id,
      department_id
    } = req.body;

    if (!email || !password || !employee_id) {
      return res.status(400).json({ error: 'Email, password, and employee_id are required' });
    }

    // 1️⃣ Create Auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2️⃣ Create user record in users table with role_id = 2 (FACULTY)
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        role_id: 2, // FACULTY
        full_name: full_name || email.split('@')[0] // Use provided name or email prefix
      });

    if (userError) {
      // Rollback: delete auth user if users insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: userError.message });
    }

    // 3️⃣ Insert faculty profile
    const { error: facultyError } = await supabase
      .from('faculty')
      .insert({
        user_id: authData.user.id,
        employee_id,
        department_id: department_id || null
      });

    if (facultyError) {
      // Rollback: delete user and auth if faculty insert fails
      await supabase.from('users').delete().eq('id', authData.user.id);
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: facultyError.message });
    }

    res.json({ message: 'Faculty created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole([ROLES.ADMIN]));

// GET /admin/dashboard - Admin dashboard stats
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

// POST /admin/departments - Create new department
router.post('/departments', async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    const { data, error } = await supabase
      .from('departments')
      .insert({ name, code })
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Department created successfully', department: data[0] });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// POST /admin/subjects - Create new subject
router.post('/subjects', requireAdmin, async (req, res) => {
  try {
    const { subject_code, subject_name, department_id, semester_id } = req.body;

    if (!subject_code || !subject_name || !department_id) {
      return res.status(400).json({ error: 'subject_code, subject_name, and department_id required' });
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert([{
        subject_code,
        subject_name,
        department_id,
        semester_id: semester_id || 1
      }])
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
router.get('/subjects', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('semester_id')
      .order('subject_code');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch subjects: ' + error.message });
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
    const { faculty_id, subject_id } = req.body;

    if (!faculty_id || !subject_id) {
      return res.status(400).json({ error: 'faculty_id and subject_id required' });
    }

    const { data, error } = await supabase
      .from('faculty_subjects')
      .insert([{ faculty_id, subject_id }])
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
    const { email, password, full_name, roll_no, department_id, year_of_admission } = req.body;

    if (!email || !password || !full_name || !roll_no || !department_id) {
      return res.status(400).json({ error: 'Email, password, full_name, roll_no, and department_id are required' });
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
        department_id,
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
        department_id,
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
        users(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch students: ' + error.message });
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
    const { roll_no, department_id, full_name } = req.body;

    const updateData = {};
    if (roll_no) updateData.roll_no = roll_no;
    if (department_id) updateData.department_id = department_id;

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
    const { email, password, full_name, employee_id, department_id } = req.body;

    if (!email || !password || !full_name || !employee_id || !department_id) {
      return res.status(400).json({ error: 'Email, password, full_name, employee_id, and department_id are required' });
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
        department_id
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
        department_id
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
        users(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch faculty: ' + error.message });
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
    const { employee_id, department_id, full_name } = req.body;

    const updateData = {};
    if (employee_id) updateData.employee_id = employee_id;
    if (department_id) updateData.department_id = department_id;

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

// ============ FACULTY-SUBJECT ASSIGNMENTS ============

// GET /admin/faculty-subjects - Get all faculty-subject assignments
router.get('/faculty-subjects', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faculty_subjects')
      .select('*');

    if (error) {
      return res.json({ faculty_subjects: [] });
    }

    // Manually fetch related data to avoid join issues
    let results = [];
    for (const record of (data || [])) {
      const [facultyRes, subjectRes] = await Promise.all([
        supabase.from('faculty').select('*,users(full_name)').eq('id', record.faculty_id).single(),
        supabase.from('subjects').select('*').eq('id', record.subject_id).single()
      ]);

      results.push({
        id: record.id,
        faculty_id: record.faculty_id,
        subject_id: record.subject_id,
        faculty: facultyRes.data,
        subjects: subjectRes.data
      });
    }

    res.json({ faculty_subjects: results });
  } catch (error) {
    console.error('List faculty-subjects error:', error);
    res.json({ faculty_subjects: [] });
  }
});

// GET /admin/faculty/:id/subjects - Get subjects assigned to a specific faculty
router.get('/faculty/:id/subjects', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('faculty_subjects')
      .select(`
        id,
        subject_id,
        subjects(id, name, code, semester, dept_id)
      `)
      .eq('faculty_id', id)
      .order('subjects(semester)');

    // If table doesn't exist, return empty array
    if (error && error.message && error.message.includes('relation')) {
      return res.json({ subjects: [] });
    }

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subjects: ' + error.message });
    }

    res.json({ subjects: data || [] });
  } catch (error) {
    console.error('Get faculty subjects error:', error);
    res.json({ subjects: [] });
  }
});

// POST /admin/faculty-subjects - Assign faculty to subject
router.post('/faculty-subjects', requireAdmin, async (req, res) => {
  try {
    const { faculty_id, subject_id } = req.body;

    if (!faculty_id || !subject_id) {
      return res.status(400).json({ error: 'faculty_id and subject_id are required' });
    }

    // Check if assignment already exists
    const { data: existing, error: checkError } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('faculty_id', faculty_id)
      .eq('subject_id', subject_id);

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'This faculty is already assigned to this subject' });
    }

    // Create assignment
    const { data, error } = await supabase
      .from('faculty_subjects')
      .insert({
        faculty_id,
        subject_id
      })
      .select();

    if (error) {
      // If table doesn't exist, return error with helpful message
      if (error.message && error.message.includes('relation')) {
        return res.status(501).json({ error: 'Faculty-subject assignment feature not yet configured. Please contact administrator.' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Faculty assigned successfully', faculty_subjects: data });
  } catch (error) {
    console.error('Assign faculty error:', error);
    res.status(500).json({ error: 'Failed to assign faculty: ' + error.message });
  }
});

// DELETE /admin/faculty-subjects/:id - Remove faculty-subject assignment
router.delete('/faculty-subjects/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('faculty_subjects')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Assignment removed successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to remove assignment' });
  }
});

export default router;
