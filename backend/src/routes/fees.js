import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All fee routes require authentication
router.use(authenticateToken);

// STUDENT: Get own fee details
router.get('/my-fees', requireRole([ROLES.STUDENT]), async (req, res) => {
  try {
    const userId = req.user.sub;

    // Get student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id, roll_no')
      .eq('user_id', userId)
      .single();

    if (studentError || !studentData) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    // Get fee details
    const { data: fees, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentData.id)
      .order('semester', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate totals
    const totalFees = fees.reduce((sum, f) => sum + (f.tuition_fee + f.lab_fee + f.other_fee), 0);
    const totalPaid = fees.reduce((sum, f) => sum + f.amount_paid, 0);
    const totalDue = fees.reduce((sum, f) => sum + f.amount_due, 0);

    res.json({
      student_roll: studentData.roll_no,
      fees: fees.map(f => ({
        id: f.id,
        semester: f.semester,
        academic_year: f.academic_year,
        tuition_fee: f.tuition_fee,
        lab_fee: f.lab_fee,
        other_fee: f.other_fee,
        total_fee: f.tuition_fee + f.lab_fee + f.other_fee,
        amount_paid: f.amount_paid,
        amount_due: f.amount_due,
        payment_status: f.amount_due === 0 ? 'paid' : f.amount_paid === 0 ? 'pending' : 'partial',
        due_date: f.due_date
      })),
      summary: {
        total_fees: totalFees,
        total_paid: totalPaid,
        total_due: totalDue,
        overall_status: totalDue === 0 ? 'all_paid' : totalPaid === 0 ? 'all_pending' : 'partial_paid'
      }
    });
  } catch (error) {
    console.error('Get my fees error:', error);
    res.status(500).json({ error: 'Failed to fetch fee details' });
  }
});

// ADMIN: Get all student fees
router.get('/all', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { dept_id, semester } = req.query;

    let query = supabase
      .from('fees')
      .select(`
        *,
        students(roll_no, dept_id, semester, users(full_name))
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Filter if needed
    let filtered = data;
    if (dept_id) {
      filtered = filtered.filter(f => f.students?.dept_id === parseInt(dept_id));
    }
    if (semester) {
      filtered = filtered.filter(f => f.semester === parseInt(semester));
    }

    res.json({
      fees: filtered.map(f => ({
        id: f.id,
        student_name: f.students?.users?.full_name,
        student_roll: f.students?.roll_no,
        semester: f.semester,
        academic_year: f.academic_year,
        tuition_fee: f.tuition_fee,
        lab_fee: f.lab_fee,
        other_fee: f.other_fee,
        total_fee: f.tuition_fee + f.lab_fee + f.other_fee,
        amount_paid: f.amount_paid,
        amount_due: f.amount_due,
        payment_status: f.amount_due === 0 ? 'paid' : f.amount_paid === 0 ? 'pending' : 'partial',
        due_date: f.due_date
      })),
      total: filtered.length
    });
  } catch (error) {
    console.error('Get all fees error:', error);
    res.status(500).json({ error: 'Failed to fetch fee details' });
  }
});

// ADMIN: Add/Create fee for student
router.post('/', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { student_id, tuition_fee, lab_fee, other_fee, amount_paid, semester, academic_year, due_date } = req.body;

    if (!student_id || tuition_fee === undefined || lab_fee === undefined || other_fee === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total_fee = tuition_fee + lab_fee + other_fee;
    const amount_due = total_fee - (amount_paid || 0);

    const { data, error } = await supabase
      .from('fees')
      .insert({
        student_id,
        tuition_fee,
        lab_fee,
        other_fee,
        amount_paid: amount_paid || 0,
        amount_due: amount_due,
        semester: semester || 1,
        academic_year: academic_year || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        due_date: due_date || null
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Fee record created successfully', fee: data });
  } catch (error) {
    console.error('Add fee error:', error);
    res.status(500).json({ error: 'Failed to create fee record' });
  }
});

// ADMIN: Update payment for student
router.put('/:id/payment', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    if (amount_paid === undefined) {
      return res.status(400).json({ error: 'Amount paid is required' });
    }

    // Get current fee record
    const { data: currentFee, error: fetchError } = await supabase
      .from('fees')
      .select('tuition_fee, lab_fee, other_fee')
      .eq('id', id)
      .single();

    if (fetchError || !currentFee) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    const total_fee = currentFee.tuition_fee + currentFee.lab_fee + currentFee.other_fee;
    const amount_due = Math.max(0, total_fee - amount_paid);

    const { data, error } = await supabase
      .from('fees')
      .update({
        amount_paid,
        amount_due
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Payment updated successfully', fee: data });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// ADMIN: Delete fee record
router.delete('/:id', requireRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ error: 'Failed to delete fee record' });
  }
});

export default router;
