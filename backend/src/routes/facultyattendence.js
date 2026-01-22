import express from 'express';
import supabase from '../config/supabase.js';
import { requireFaculty } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireFaculty, async (req, res) => {
  try {
    const { student_id, subject_id, attendance_date, status } = req.body;

    if (!student_id || !subject_id || !attendance_date || status === undefined) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // check faculty is assigned to subject
    const { data: assignment } = await supabase
      .from('faculty_subjects')
      .select('id')
      .eq('subject_id', subject_id)
      .single();

    if (!assignment) {
      return res.status(403).json({ error: 'Faculty not assigned to this subject' });
    }

    const { error } = await supabase
      .from('attendance')
      .upsert({
        student_id,
        subject_id,
        faculty_id: req.user.id,
        attendance_date,
        status
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});
router.post('/bulk', requireFaculty, async (req, res) => {
  try {
    const { subject_id, attendance_date, records } = req.body;

    if (!subject_id || !attendance_date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const rows = records.map(r => ({
      student_id: r.student_id,
      subject_id,
      faculty_id: req.user.id,
      attendance_date,
      status: r.status
    }));

    const { error } = await supabase
      .from('attendance')
      .upsert(rows);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Bulk attendance marked' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk attendance failed' });
  }
});

export default router;
