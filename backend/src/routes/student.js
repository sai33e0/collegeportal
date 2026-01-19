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
      .select('id, dept_id, semester')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Get subjects for student's department and semester
    const { data, error } = await supabase
      .from('subjects')
      .select('*, departments(name)')
      .eq('dept_id', studentData.dept_id)
      .eq('semester', studentData.semester)
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

// GET /student/marks - Get student's marks (published only)
router.get('/marks', async (req, res) => {
  try {
    const { subject_id, exam_type, semester } = req.query;

    // Get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Build query for published marks only
    let query = supabase
      .from('marks')
      .select(`
        *,
        subjects(name, code, credits, semester)
      `)
      .eq('student_id', studentData.id)
      .eq('published', true);

    if (subject_id) {
      query = query.eq('subject_id', subject_id);
    }

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
      filteredData = data.filter(m => m.subjects?.semester === parseInt(semester));
    }

    // Group marks by subject for easier display
    const groupedMarks = {};
    filteredData.forEach(mark => {
      const subjectCode = mark.subjects?.code || 'Unknown';
      if (!groupedMarks[subjectCode]) {
        groupedMarks[subjectCode] = {
          subject: mark.subjects,
          marks: []
        };
      }
      groupedMarks[subjectCode].marks.push({
        id: mark.id,
        exam_type: mark.exam_type,
        marks_obtained: mark.marks_obtained,
        max_marks: mark.max_marks,
        percentage: ((mark.marks_obtained / mark.max_marks) * 100).toFixed(2)
      });
    });

    res.json({ 
      marks: filteredData,
      grouped: groupedMarks
    });
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// GET /student/marks/summary - Get semester-wise marks summary
router.get('/marks/summary', async (req, res) => {
  try {
    // Get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id, semester')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Get all published marks
    const { data: marks, error: marksError } = await supabase
      .from('marks')
      .select(`
        *,
        subjects(name, code, credits, semester)
      `)
      .eq('student_id', studentData.id)
      .eq('published', true);

    if (marksError) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    // Calculate summary by semester
    const summary = {};
    marks.forEach(mark => {
      const sem = mark.subjects?.semester || 0;
      if (!summary[sem]) {
        summary[sem] = {
          semester: sem,
          subjects: {},
          total_obtained: 0,
          total_max: 0
        };
      }

      const subjectCode = mark.subjects?.code;
      if (!summary[sem].subjects[subjectCode]) {
        summary[sem].subjects[subjectCode] = {
          name: mark.subjects?.name,
          code: subjectCode,
          credits: mark.subjects?.credits,
          marks: {}
        };
      }

      summary[sem].subjects[subjectCode].marks[mark.exam_type] = {
        obtained: mark.marks_obtained,
        max: mark.max_marks
      };

      summary[sem].total_obtained += mark.marks_obtained;
      summary[sem].total_max += mark.max_marks;
    });

    // Calculate percentages
    Object.values(summary).forEach(sem => {
      sem.percentage = sem.total_max > 0 
        ? ((sem.total_obtained / sem.total_max) * 100).toFixed(2) 
        : 0;
      sem.subjects = Object.values(sem.subjects);
    });

    res.json({ 
      summary: Object.values(summary).sort((a, b) => a.semester - b.semester),
      current_semester: studentData.semester
    });
  } catch (error) {
    console.error('Get marks summary error:', error);
    res.status(500).json({ error: 'Failed to fetch marks summary' });
  }
});

// GET /student/attendance - Get student's attendance
router.get('/attendance', async (req, res) => {
  try {
    const { subject_id, start_date, end_date } = req.query;

    // Get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (studentError) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Build query
    let query = supabase
      .from('attendance')
      .select(`
        *,
        subjects(name, code)
      `)
      .eq('student_id', studentData.id);

    if (subject_id) {
      query = query.eq('subject_id', subject_id);
    }

    if (start_date && end_date) {
      query = query.gte('date', start_date).lte('date', end_date);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch attendance' });
    }

    // Calculate attendance summary
    const summary = {};
    const validStatuses = ['present', 'absent', 'late', 'excused'];
    data.forEach(record => {
      const subjectCode = record.subjects?.code || 'Unknown';
      if (!summary[subjectCode]) {
        summary[subjectCode] = {
          subject: record.subjects,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        };
      }
      summary[subjectCode].total++;
      // Only increment if status is valid
      if (validStatuses.includes(record.status)) {
        summary[subjectCode][record.status]++;
      }
    });

    // Calculate percentages
    Object.values(summary).forEach(sub => {
      sub.percentage = sub.total > 0 
        ? ((sub.present / sub.total) * 100).toFixed(2) 
        : 0;
    });

    res.json({ 
      attendance: data,
      summary: Object.values(summary)
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

export default router;
