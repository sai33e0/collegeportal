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

// GET /faculty/students - Get students for assigned subjects
router.get('/students', async (req, res) => {
  try {
    const { subject_id, semester, dept_id } = req.query;

    // Get faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id, dept_id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    // Build query for students
    let query = supabase
      .from('students')
      .select(`
        *,
        users(full_name),
        departments(name, code)
      `);

    // Filter by department (faculty's department by default)
    if (dept_id) {
      query = query.eq('dept_id', dept_id);
    } else {
      query = query.eq('dept_id', facultyData.dept_id);
    }

    // Filter by semester if provided
    if (semester) {
      query = query.eq('semester', parseInt(semester));
    }

    const { data, error } = await query.order('roll_no');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    res.json({ students: data });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /faculty/marks - Add marks for a student (for assigned subjects only)
router.post('/marks', async (req, res) => {
  try {
    const { student_id, subject_id, exam_type, marks_obtained, max_marks } = req.body;

    if (!student_id || !subject_id || !exam_type || marks_obtained === undefined || !max_marks) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validate exam_type
    const validExamTypes = ['internal1', 'internal2', 'lab', 'assignment', 'final'];
    if (!validExamTypes.includes(exam_type)) {
      return res.status(400).json({ error: 'Invalid exam type. Must be: internal1, internal2, lab, assignment, or final' });
    }

    // Verify faculty is assigned to this subject
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('faculty_id', facultyData.id)
      .eq('subject_id', subject_id)
      .single();

    if (assignmentError || !assignmentData) {
      return res.status(403).json({ error: 'You are not assigned to this subject' });
    }

    // Check if marks already exist for this student/subject/exam_type combination
    const { data: existingMark } = await supabase
      .from('marks')
      .select('id')
      .eq('student_id', student_id)
      .eq('subject_id', subject_id)
      .eq('exam_type', exam_type)
      .single();

    let result;
    if (existingMark) {
      // Update existing marks
      const { data, error } = await supabase
        .from('marks')
        .update({ marks_obtained, max_marks })
        .eq('id', existingMark.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = { message: 'Marks updated successfully', marks: data };
    } else {
      // Insert new marks
      const { data, error } = await supabase
        .from('marks')
        .insert([{
          student_id,
          subject_id,
          exam_type,
          marks_obtained,
          max_marks,
          published: false
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = { message: 'Marks added successfully', marks: data };
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Add marks error:', error);
    res.status(500).json({ error: 'Failed to add marks' });
  }
});

// POST /faculty/marks/bulk - Add marks for multiple students at once
router.post('/marks/bulk', async (req, res) => {
  try {
    const { subject_id, exam_type, max_marks, marks_data } = req.body;
    // marks_data should be an array of { student_id, marks_obtained }

    if (!subject_id || !exam_type || !max_marks || !marks_data || !Array.isArray(marks_data)) {
      return res.status(400).json({ error: 'subject_id, exam_type, max_marks, and marks_data array are required' });
    }

    // Verify faculty is assigned to this subject
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('faculty_id', facultyData.id)
      .eq('subject_id', subject_id)
      .single();

    if (assignmentError || !assignmentData) {
      return res.status(403).json({ error: 'You are not assigned to this subject' });
    }

    // Process each mark entry
    const results = [];
    const errors = [];

    for (const entry of marks_data) {
      const { student_id, marks_obtained } = entry;

      try {
        // Check if marks already exist
        const { data: existingMark } = await supabase
          .from('marks')
          .select('id')
          .eq('student_id', student_id)
          .eq('subject_id', subject_id)
          .eq('exam_type', exam_type)
          .single();

        if (existingMark) {
          // Update
          const { data } = await supabase
            .from('marks')
            .update({ marks_obtained, max_marks })
            .eq('id', existingMark.id)
            .select()
            .single();
          results.push({ student_id, status: 'updated', data });
        } else {
          // Insert
          const { data } = await supabase
            .from('marks')
            .insert([{
              student_id,
              subject_id,
              exam_type,
              marks_obtained,
              max_marks,
              published: false
            }])
            .select()
            .single();
          results.push({ student_id, status: 'created', data });
        }
      } catch (err) {
        errors.push({ student_id, error: err.message });
      }
    }

    res.json({
      message: `Processed ${results.length} marks entries`,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk marks error:', error);
    res.status(500).json({ error: 'Failed to process bulk marks' });
  }
});

// GET /faculty/marks - Get marks for faculty's assigned subjects
router.get('/marks', async (req, res) => {
  try {
    const { subject_id, exam_type, semester } = req.query;

    // Get faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    // Get assigned subject IDs
    const { data: assignedSubjects, error: subjectError } = await supabase
      .from('faculty_subjects')
      .select('subject_id')
      .eq('faculty_id', facultyData.id);

    if (subjectError) {
      return res.status(500).json({ error: 'Failed to fetch assigned subjects' });
    }

    let subjectIds = assignedSubjects.map(fs => fs.subject_id);

    // If specific subject_id is provided, verify it's assigned to this faculty
    if (subject_id) {
      if (!subjectIds.includes(parseInt(subject_id))) {
        return res.status(403).json({ error: 'You are not assigned to this subject' });
      }
      subjectIds = [parseInt(subject_id)];
    }

    if (subjectIds.length === 0) {
      return res.json({ marks: [] });
    }

    // Build query
    let query = supabase
      .from('marks')
      .select(`
        *,
        students(id, roll_no, semester, users(full_name), departments(code)),
        subjects(name, code)
      `)
      .in('subject_id', subjectIds);

    if (exam_type) {
      query = query.eq('exam_type', exam_type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    // Filter by semester if provided
    let filteredData = data;
    if (semester) {
      filteredData = data.filter(m => m.students?.semester === parseInt(semester));
    }

    res.json({ marks: filteredData });
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// POST /faculty/attendance - Add attendance for a student
router.post('/attendance', async (req, res) => {
  try {
    const { student_id, subject_id, date, status, period } = req.body;

    if (!student_id || !subject_id || !date || !status) {
      return res.status(400).json({ error: 'student_id, subject_id, date, and status are required' });
    }

    // Validate status
    const validStatuses = ['present', 'absent', 'late', 'excused'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: present, absent, late, or excused' });
    }

    // Verify faculty is assigned to this subject
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('faculty_id', facultyData.id)
      .eq('subject_id', subject_id)
      .single();

    if (assignmentError || !assignmentData) {
      return res.status(403).json({ error: 'You are not assigned to this subject' });
    }

    // Check if attendance record exists for this student/subject/date
    const { data: existingRecord } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', student_id)
      .eq('subject_id', subject_id)
      .eq('date', date)
      .eq('period', period || 1)
      .single();

    let result;
    if (existingRecord) {
      // Update existing
      const { data, error } = await supabase
        .from('attendance')
        .update({ status })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = { message: 'Attendance updated successfully', attendance: data };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          student_id,
          subject_id,
          date,
          status,
          period: period || 1,
          faculty_id: facultyData.id
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      result = { message: 'Attendance added successfully', attendance: data };
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Add attendance error:', error);
    res.status(500).json({ error: 'Failed to add attendance' });
  }
});

// POST /faculty/attendance/bulk - Add attendance for multiple students
router.post('/attendance/bulk', async (req, res) => {
  try {
    const { subject_id, date, period, attendance_data } = req.body;
    // attendance_data should be an array of { student_id, status }

    if (!subject_id || !date || !attendance_data || !Array.isArray(attendance_data)) {
      return res.status(400).json({ error: 'subject_id, date, and attendance_data array are required' });
    }

    // Verify faculty is assigned to this subject
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('faculty_id', facultyData.id)
      .eq('subject_id', subject_id)
      .single();

    if (assignmentError || !assignmentData) {
      return res.status(403).json({ error: 'You are not assigned to this subject' });
    }

    const results = [];
    const errors = [];

    for (const entry of attendance_data) {
      const { student_id, status } = entry;

      try {
        // Check if record exists
        const { data: existingRecord } = await supabase
          .from('attendance')
          .select('id')
          .eq('student_id', student_id)
          .eq('subject_id', subject_id)
          .eq('date', date)
          .eq('period', period || 1)
          .single();

        if (existingRecord) {
          const { data } = await supabase
            .from('attendance')
            .update({ status })
            .eq('id', existingRecord.id)
            .select()
            .single();
          results.push({ student_id, status: 'updated', data });
        } else {
          const { data } = await supabase
            .from('attendance')
            .insert([{
              student_id,
              subject_id,
              date,
              status,
              period: period || 1,
              faculty_id: facultyData.id
            }])
            .select()
            .single();
          results.push({ student_id, status: 'created', data });
        }
      } catch (err) {
        errors.push({ student_id, error: err.message });
      }
    }

    res.json({
      message: `Processed ${results.length} attendance entries`,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(500).json({ error: 'Failed to process bulk attendance' });
  }
});

// GET /faculty/attendance - Get attendance for assigned subjects
router.get('/attendance', async (req, res) => {
  try {
    const { subject_id, date, start_date, end_date } = req.query;

    // Get faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (facultyError) {
      return res.status(404).json({ error: 'Faculty record not found' });
    }

    // Get assigned subject IDs
    const { data: assignedSubjects, error: subjectError } = await supabase
      .from('faculty_subjects')
      .select('subject_id')
      .eq('faculty_id', facultyData.id);

    if (subjectError) {
      return res.status(500).json({ error: 'Failed to fetch assigned subjects' });
    }

    let subjectIds = assignedSubjects.map(fs => fs.subject_id);

    if (subject_id) {
      if (!subjectIds.includes(parseInt(subject_id))) {
        return res.status(403).json({ error: 'You are not assigned to this subject' });
      }
      subjectIds = [parseInt(subject_id)];
    }

    if (subjectIds.length === 0) {
      return res.json({ attendance: [] });
    }

    let query = supabase
      .from('attendance')
      .select(`
        *,
        students(roll_no, users(full_name)),
        subjects(name, code)
      `)
      .in('subject_id', subjectIds);

    if (date) {
      query = query.eq('date', date);
    } else if (start_date && end_date) {
      query = query.gte('date', start_date).lte('date', end_date);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch attendance' });
    }

    res.json({ attendance: data });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

export default router;
