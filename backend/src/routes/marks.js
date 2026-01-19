import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All marks routes require authentication
router.use(authenticateToken);

// ADMIN: Add/Edit marks
router.post('/', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { student_id, subject_id, exam_type, marks_obtained, max_marks, published } = req.body;

    if (!student_id || !subject_id || !exam_type || marks_obtained === undefined || !max_marks) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const { data, error } = await supabase
      .from('marks')
      .insert([{
        student_id,
        subject_id,
        exam_type,
        marks_obtained,
        max_marks,
        published: published || false
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Marks added successfully', marks: data });
  } catch (error) {
    console.error('Add marks error:', error);
    res.status(500).json({ error: 'Failed to add marks' });
  }
});

// ADMIN: Update marks
router.put('/:id', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { marks_obtained, max_marks, published } = req.body;

    const updateData = {};
    if (marks_obtained !== undefined) updateData.marks_obtained = marks_obtained;
    if (max_marks !== undefined) updateData.max_marks = max_marks;
    if (published !== undefined) updateData.published = published;

    const { data, error } = await supabase
      .from('marks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Marks updated successfully', marks: data });
  } catch (error) {
    console.error('Update marks error:', error);
    res.status(500).json({ error: 'Failed to update marks' });
  }
});

// ADMIN: Delete marks
router.delete('/:id', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('marks')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Marks deleted successfully' });
  } catch (error) {
    console.error('Delete marks error:', error);
    res.status(500).json({ error: 'Failed to delete marks' });
  }
});

// ADMIN: Get all marks (with filters)
router.get('/all', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { dept_id, semester, subject_id } = req.query;

    let query = supabase
      .from('marks')
      .select(`
        *,
        students(roll_no, users(full_name), semester),
        subjects(name, code)
      `);

    if (subject_id) {
      query = query.eq('subject_id', subject_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    // Filter by department/semester if needed (after join)
    let filteredData = data;
    if (dept_id) {
      filteredData = filteredData.filter(m => m.students?.dept_id === parseInt(dept_id));
    }
    if (semester) {
      filteredData = filteredData.filter(m => m.students?.semester === parseInt(semester));
    }

    res.json({ marks: filteredData });
  } catch (error) {
    console.error('Get all marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// ADMIN: Publish/Unpublish marks
router.patch('/:id/publish', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const { data, error } = await supabase
      .from('marks')
      .update({ published })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: `Marks ${published ? 'published' : 'unpublished'} successfully`, marks: data });
  } catch (error) {
    console.error('Publish marks error:', error);
    res.status(500).json({ error: 'Failed to update publish status' });
  }
});

// STUDENT: Get own marks (published only)
router.get('/student/me', requireRole([ROLES.STUDENT]), async (req, res) => {
  try {
    // Get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Get published marks only
    const { data, error } = await supabase
      .from('marks')
      .select(`
        *,
        subjects(name, code, credits)
      `)
      .eq('student_id', studentData.id)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    res.json({ marks: data });
  } catch (error) {
    console.error('Get student marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// FACULTY: Get marks for assigned subjects (published only)
router.get('/faculty/subjects', requireRole([ROLES.FACULTY]), async (req, res) => {
  try {
    // Get faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    // Get assigned subjects
    const { data: assignedSubjects, error: subjectError } = await supabase
      .from('faculty_subjects')
      .select('subject_id')
      .eq('faculty_id', facultyData.id);

    if (subjectError) {
      return res.status(500).json({ error: 'Failed to fetch assigned subjects' });
    }

    const subjectIds = assignedSubjects.map(fs => fs.subject_id);

    if (subjectIds.length === 0) {
      return res.json({ marks: [] });
    }

    // Get marks for those subjects (published only)
    const { data, error } = await supabase
      .from('marks')
      .select(`
        *,
        students(roll_no, users(full_name)),
        subjects(name, code)
      `)
      .in('subject_id', subjectIds)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    res.json({ marks: data });
  } catch (error) {
    console.error('Get faculty marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

export default router;
