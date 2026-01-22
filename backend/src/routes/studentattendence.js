import express from 'express';
import supabase from '../config/supabase.js';
import { requireStudent } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireStudent, async (req, res) => {
  try {
    // 1. Get logged-in student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 2. Fetch attendance rows with subject info
    const { data: rows, error } = await supabase
      .from('attendance')
      .select(`
        subject_id,
        status,
        subjects (
          code,
          name
        )
      `)
      .eq('student_id', student.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 3. Aggregate cleanly
    const map = {};

    for (const row of rows) {
      const key = row.subject_id;

      if (!map[key]) {
        map[key] = {
          subject_code: row.subjects.code,
          subject_name: row.subjects.name,
          total_classes: 0,
          present: 0
        };
      }

      map[key].total_classes++;
      if (row.status) map[key].present++;
    }

    // 4. Final shape
    const result = Object.values(map).map(s => ({
      ...s,
      attendance_percentage:
        s.total_classes === 0
          ? 0
          : Math.round((s.present / s.total_classes) * 100)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});


export default router;
