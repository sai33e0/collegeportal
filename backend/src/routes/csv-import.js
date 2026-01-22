import express from 'express';
import supabase from '../config/supabase.js';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

// Require authentication and admin role for all routes
router.use(authenticateToken);
router.use(requireRole([ROLES.ADMIN]));

// POST /admin/import-students - Import students from CSV
router.post('/import-students', async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return res.status(400).json({ error: 'CSV data is required and must be an array' });
    }

    console.log(`Processing ${csvData.length} students from CSV...`);

    const results = {
      created: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    for (const row of csvData) {
      try {
        // Validate required fields
        const { email, password, full_name, roll_no, dept_id, semester, year_of_admission } = row;

        if (!email || !password || !full_name || !roll_no || !dept_id || !semester || !year_of_admission) {
          results.failed++;
          results.errors.push({
            email: email || 'N/A',
            error: 'Missing required fields: email, password, full_name, roll_no, dept_id, semester, year_of_admission'
          });
          continue;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          results.failed++;
          results.errors.push({
            email,
            error: 'Invalid email format'
          });
          continue;
        }

        // Validate semester range
        const semesterNum = parseInt(semester);
        if (semesterNum < 1 || semesterNum > 8) {
          results.failed++;
          results.errors.push({
            email,
            error: 'Semester must be between 1 and 8'
          });
          continue;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        });

        if (authError) {
          if (authError.message.includes('already exists')) {
            results.skipped++;
            console.log(`  ⊘ Student ${email} already exists`);
          } else {
            results.failed++;
            results.errors.push({
              email,
              error: authError.message
            });
          }
          continue;
        }

        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            role_id: 1, // Student role
            full_name
          });

        if (userError && !userError.message.includes('duplicate')) {
          results.failed++;
          results.errors.push({
            email,
            error: `Failed to create user: ${userError.message}`
          });
          // Delete the auth user if user record creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          continue;
        }

        // Create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            roll_no,
            dept_id: parseInt(dept_id),
            semester: semesterNum,
            year_of_admission: parseInt(year_of_admission)
          });

        if (studentError && !studentError.message.includes('duplicate')) {
          results.failed++;
          results.errors.push({
            email,
            error: `Failed to create student record: ${studentError.message}`
          });
          // Delete the user if student record creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          continue;
        }

        results.created++;
        console.log(`  ✓ Created student: ${full_name} (${email})`);

      } catch (rowError) {
        results.failed++;
        results.errors.push({
          email: row.email || 'Unknown',
          error: rowError.message
        });
        console.error(`  ✗ Error processing row:`, rowError.message);
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`  ✅ Created: ${results.created}`);
    console.log(`  ⊘ Skipped: ${results.skipped}`);
    console.log(`  ✗ Failed: ${results.failed}`);

    res.json({
      message: `Import completed: ${results.created} created, ${results.skipped} skipped, ${results.failed} failed`,
      results
    });

  } catch (error) {
    console.error('CSV Import error:', error);
    res.status(500).json({ error: 'Failed to import students', details: error.message });
  }
});

// GET /admin/import-students/template - Get CSV template
router.get('/import-students/template', (req, res) => {
  const template = `email,password,full_name,roll_no,dept_id,semester,year_of_admission
student01@srit.ac.in,srit1234,Student One,234G1A3301,1,6,2023
student02@srit.ac.in,srit1234,Student Two,234G1A3302,1,6,2023
student03@srit.ac.in,srit1234,Student Three,234G1A3303,1,6,2023
ml_student01@srit.ac.in,srit1234,ML Student One,234G5A0401,3,6,2023
ml_student02@srit.ac.in,srit1234,ML Student Two,234G5A0402,3,6,2023`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="students_template.csv"');
  res.send(template);
});

export default router;
