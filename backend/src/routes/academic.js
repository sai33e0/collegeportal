import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All academic routes require authentication
router.use(authenticateToken);

// Role-based middleware
const requireAdmin = requireRole(ROLES.ADMIN);
const requireStudent = requireRole(ROLES.STUDENT);
const requireFaculty = requireRole(ROLES.FACULTY);

// Helper function to calculate CGPA from marks
async function calculateCGPA(studentId) {
  try {
    // Get all marks for the student
    const { data: allMarks, error } = await supabase
      .from('marks')
      .select(`
        *,
        subjects(id, credits, semester)
      `)
      .eq('student_id', studentId)
      .eq('published', true);

    if (error || !allMarks || allMarks.length === 0) {
      return 0;
    }

    // Group marks by subject
    const subjectMarks = {};
    allMarks.forEach(mark => {
      const subjectId = mark.subjects.id;
      if (!subjectMarks[subjectId]) {
        subjectMarks[subjectId] = {
          total: 0,
          max: 0,
          credits: mark.subjects.credits,
          semester: mark.subjects.semester
        };
      }
      subjectMarks[subjectId].total += mark.marks_obtained;
      subjectMarks[subjectId].max += mark.max_marks;
    });

    // Calculate GPA
    let totalGradePoints = 0;
    let totalCredits = 0;

    Object.values(subjectMarks).forEach(subject => {
      const percentage = (subject.total / subject.max) * 100;
      let gradePoint = 0;

      if (percentage >= 90) gradePoint = 10;
      else if (percentage >= 80) gradePoint = 9;
      else if (percentage >= 70) gradePoint = 8;
      else if (percentage >= 60) gradePoint = 7;
      else if (percentage >= 50) gradePoint = 6;
      else gradePoint = 4;

      totalGradePoints += gradePoint * subject.credits;
      totalCredits += subject.credits;
    });

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
    return parseFloat(cgpa);
  } catch (err) {
    console.error('Error calculating CGPA:', err);
    return 0;
  }
}

// STUDENT: Get own academic info
router.get('/my-info', requireRole([ROLES.STUDENT]), async (req, res) => {
  try {
    const userId = req.user.sub;

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        roll_no,
        semester,
        year_of_admission,
        departments(name, code),
        users(full_name)
      `)
      .eq('user_id', userId)
      .single();

    if (studentError || !studentData) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Calculate CGPA
    const cgpa = await calculateCGPA(studentData.id);

    // Get current semester marks
    const { data: currentMarks } = await supabase
      .from('marks')
      .select(`
        *,
        subjects(id, code, name, semester, credits)
      `)
      .eq('student_id', studentData.id)
      .eq('published', true)
      .order('subjects.code');

    // Group marks by subject
    const subjectMarks = {};
    currentMarks?.forEach(mark => {
      const subId = mark.subject_id;
      if (!subjectMarks[subId]) {
        subjectMarks[subId] = {
          subject_code: mark.subjects.code,
          subject_name: mark.subjects.name,
          credits: mark.subjects.credits,
          marks: {}
        };
      }
      subjectMarks[subId].marks[mark.exam_type] = {
        obtained: mark.marks_obtained,
        max: mark.max_marks
      };
    });

    // Convert to array and calculate totals
    const subjects = Object.values(subjectMarks).map(sub => {
      const totalObtained = Object.values(sub.marks).reduce((sum, m) => sum + m.obtained, 0);
      const totalMax = Object.values(sub.marks).reduce((sum, m) => sum + m.max, 0);
      const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0;

      return {
        ...sub,
        total_obtained: totalObtained,
        total_max: totalMax,
        percentage,
        marks: sub.marks
      };
    });

    res.json({
      student: {
        full_name: studentData.users.full_name,
        roll_no: studentData.roll_no,
        department: studentData.departments.name,
        semester: studentData.semester,
        year_of_admission: studentData.year_of_admission
      },
      academics: {
        cgpa: parseFloat(cgpa),
        total_subjects: subjects.length,
        subjects: subjects,
        overall_percentage: subjects.length > 0
          ? (subjects.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / subjects.length).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('Get my academic info error:', error);
    res.status(500).json({ error: 'Failed to fetch academic information' });
  }
});

// ADMIN: Get student academic info by roll number
router.get('/student/:roll_no', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { roll_no } = req.params;

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        roll_no,
        semester,
        year_of_admission,
        departments(name, code),
        users(full_name)
      `)
      .eq('roll_no', roll_no)
      .single();

    if (studentError || !studentData) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const cgpa = await calculateCGPA(studentData.id);

    const { data: marks } = await supabase
      .from('marks')
      .select(`
        *,
        subjects(id, code, name, credits)
      `)
      .eq('student_id', studentData.id)
      .eq('published', true);

    const subjectMarks = {};
    marks?.forEach(mark => {
      const subId = mark.subject_id;
      if (!subjectMarks[subId]) {
        subjectMarks[subId] = {
          subject_code: mark.subjects.code,
          subject_name: mark.subjects.name,
          credits: mark.subjects.credits,
          marks: {}
        };
      }
      subjectMarks[subId].marks[mark.exam_type] = {
        obtained: mark.marks_obtained,
        max: mark.max_marks
      };
    });

    const subjects = Object.values(subjectMarks).map(sub => {
      const totalObtained = Object.values(sub.marks).reduce((sum, m) => sum + m.obtained, 0);
      const totalMax = Object.values(sub.marks).reduce((sum, m) => sum + m.max, 0);

      return {
        ...sub,
        total_obtained: totalObtained,
        total_max: totalMax,
        percentage: ((totalObtained / totalMax) * 100).toFixed(2)
      };
    });

    res.json({
      student: {
        full_name: studentData.users.full_name,
        roll_no: studentData.roll_no,
        department: studentData.departments.name,
        semester: studentData.semester
      },
      academics: {
        cgpa,
        subjects
      }
    });
  } catch (error) {
    console.error('Get student academic info error:', error);
    res.status(500).json({ error: 'Failed to fetch student academic information' });
  }
});

// =====================
// Student Service Assignment (Admin)
// =====================
router.post('/students/:studentId/service', requireAdmin, async (req, res) => {
  try {
    const { studentId } = req.params; // user_id of student
    const { service, service_details, annual_fee } = req.body; // service: 'none' | 'bus' | 'hostel'
    if (!service || !['none','bus','hostel'].includes(service)) {
      return res.status(400).json({ error: "service must be one of: 'none','bus','hostel'" });
    }

    const { data, error } = await supabase
      .from('student_services')
      .upsert({ student_id: studentId, service, service_details: service_details || null, annual_fee: annual_fee ?? null }, { onConflict: 'student_id' })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message, hint: 'Ensure table student_services exists. See ACADEMIC_SCHEMA.sql.' });
    res.json({ message: 'Student service saved', service: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save student service' });
  }
});

// =====================
// Record Payment (Admin)
// =====================
router.post('/students/:studentId/payments', requireAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academic_year, tuition_amount = 0, service_amount = 0, service_type = null } = req.body;
    if (!academic_year) return res.status(400).json({ error: 'academic_year is required' });

    const total_amount = Number(tuition_amount) + Number(service_amount);
    const created_by = req.user.id;

    const { data, error } = await supabase
      .from('fee_payments')
      .insert({ student_id: studentId, academic_year, tuition_amount, service_type, service_amount, total_amount, created_by })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message, hint: 'Ensure table fee_payments exists. See ACADEMIC_SCHEMA.sql.' });

    const receipt_no = `RCPT-${academic_year}-${data.id?.slice?.(0,8) || Math.random().toString(36).slice(2,10)}`;
    res.json({ message: 'Payment recorded', payment: { ...data, receipt_no } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// =====================
// Get Fee Summary (Admin/Student)
// =====================
router.get('/students/:studentId/fees', requireAdmin, async (req, res) => {
  const { studentId } = req.params;
  const year = req.query.year ? parseInt(req.query.year, 10) : null;
  const profileRes = await getStudentProfile(studentId);
  if (profileRes.error) return res.status(404).json({ error: 'Student not found' });

  const { data: service } = await supabase
    .from('student_services')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();

  let config = null;
  if (year) {
    const cfg = await supabase.from('fee_configs').select('*').eq('academic_year', year).maybeSingle();
    config = cfg.data || null;
  }

  const payQuery = supabase
    .from('fee_payments')
    .select('*')
    .eq('student_id', studentId)
    .order('paid_at', { ascending: false });
  if (year) payQuery.eq('academic_year', year);
  const { data: payments } = await payQuery;

  res.json({
    student: profileRes.data,
    service: service || null,
    config,
    payments: payments || []
  });
});

// Student self view
router.get('/me/fees', requireStudent, async (req, res) => {
  const studentId = req.user.id;
  const year = req.query.year ? parseInt(req.query.year, 10) : null;
  const profileRes = await getStudentProfile(studentId);
  if (profileRes.error) return res.status(404).json({ error: 'Student not found' });

  const { data: service } = await supabase
    .from('student_services')
    .select('*')
    .eq('student_id', studentId)
    .maybeSingle();

  let config = null;
  if (year) {
    const cfg = await supabase.from('fee_configs').select('*').eq('academic_year', year).maybeSingle();
    config = cfg.data || null;
  }

  const payQuery = supabase
    .from('fee_payments')
    .select('*')
    .eq('student_id', studentId)
    .order('paid_at', { ascending: false });
  if (year) payQuery.eq('academic_year', year);
  const { data: payments } = await payQuery;

  res.json({
    student: profileRes.data,
    service: service || null,
    config,
    payments: payments || []
  });
});

// Printable receipt data (Admin/Student)
router.get('/students/:studentId/receipt', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const year = req.query.year ? parseInt(req.query.year, 10) : null;
    if (!year) return res.status(400).json({ error: 'year is required' });

    // If student, ensure owns the record
    const { data: userData } = await supabase.from('users').select('role_id').eq('id', req.user.id).single();
    if (userData?.role_id === ROLES.STUDENT && req.user.id !== studentId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const profileRes = await getStudentProfile(studentId);
    if (profileRes.error) return res.status(404).json({ error: 'Student not found' });

    const { data: lastPayment } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('student_id', studentId)
      .eq('academic_year', year)
      .order('paid_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lastPayment) return res.status(404).json({ error: 'No payment found for the provided year' });

    const receipt_no = `RCPT-${year}-${lastPayment.id?.slice?.(0,8) || Math.random().toString(36).slice(2,10)}`;
    res.json({
      receipt: {
        receipt_no,
        student_name: profileRes.data.full_name,
        father_name: profileRes.data.father_name || 'N/A',
        roll_no: profileRes.data.roll_no,
        academic_year: year,
        tuition_amount: lastPayment.tuition_amount,
        service_type: lastPayment.service_type,
        service_amount: lastPayment.service_amount,
        total_amount: lastPayment.total_amount,
        paid_at: lastPayment.paid_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get receipt' });
  }
});

export default router;
