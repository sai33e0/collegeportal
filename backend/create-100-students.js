import supabase from './src/config/supabase.js';

// 100 Bulk students for CSE and AI/ML (2023 batch, semester 6)
const bulkStudents = [];

// CSE students: 50 students (234G1A3301 - 234G1A3350)
for (let i = 1; i <= 50; i++) {
  bulkStudents.push({
    email: `student${String(i).padStart(2, '0')}@srit.ac.in`,
    password: 'srit1234',
    full_name: `CSE Student ${i}`,
    roll_no: `234G1A33${String(i).padStart(2, '0')}`,
    dept_id: 1, // CSE
    semester: 6,
    year: 2023
  });
}

// AI/ML students: 50 students (234G5A0401 - 234G5A0450)
for (let i = 1; i <= 50; i++) {
  bulkStudents.push({
    email: `ml_student${String(i).padStart(2, '0')}@srit.ac.in`,
    password: 'srit1234',
    full_name: `AI/ML Student ${i}`,
    roll_no: `234G5A04${String(i).padStart(2, '0')}`,
    dept_id: 3, // AI/ML
    semester: 6,
    year: 2023
  });
}

async function createBulkStudents() {
  console.log('🚀 Starting bulk student creation (100 students)...\n');

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < bulkStudents.length; i++) {
    const student = bulkStudents[i];

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: student.email,
        password: student.password,
        email_confirm: true
      });

      if (authError) {
        if (authError.message.includes('already exists')) {
          skippedCount++;
          if (i % 10 === 0) {
            console.log(`  ⊘ ${i + 1} students processed (${skippedCount} skipped)...`);
          }
        } else {
          errorCount++;
          console.error(`  ✗ Failed to create auth user ${student.email}:`, authError.message);
        }
        continue;
      }

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          role_id: 1,
          full_name: student.full_name
        });

      if (userError && !userError.message.includes('duplicate')) {
        errorCount++;
        console.error(`  ✗ Failed to create user record for ${student.email}:`, userError.message);
        continue;
      }

      // Create student record
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          roll_no: student.roll_no,
          dept_id: student.dept_id,
          semester: student.semester,
          year_of_admission: student.year
        });

      if (studentError && !studentError.message.includes('duplicate')) {
        errorCount++;
        console.error(`  ✗ Failed to create student record for ${student.email}:`, studentError.message);
        continue;
      }

      createdCount++;
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${createdCount} students (${i + 1}/${bulkStudents.length})...`);
      }

    } catch (err) {
      errorCount++;
      console.error(`  ✗ Error creating student ${student.email}:`, err.message);
    }
  }

  console.log('\n================================================');
  console.log('🎉 BULK STUDENT CREATION COMPLETE!');
  console.log('================================================');
  console.log(`  ✅ Students Created: ${createdCount}`);
  console.log(`  ⊘ Students Skipped (already existed): ${skippedCount}`);
  console.log(`  ✗ Errors: ${errorCount}`);
  console.log('================================================\n');

  console.log('📧 LOGIN CREDENTIALS (Sample CSE Students):');
  console.log('  student01@srit.ac.in / srit1234 (Roll: 234G1A3301)');
  console.log('  student10@srit.ac.in / srit1234 (Roll: 234G1A3310)');
  console.log('  student50@srit.ac.in / srit1234 (Roll: 234G1A3350)\n');

  console.log('📧 LOGIN CREDENTIALS (Sample AI/ML Students):');
  console.log('  ml_student01@srit.ac.in / srit1234 (Roll: 234G5A0401)');
  console.log('  ml_student10@srit.ac.in / srit1234 (Roll: 234G5A0410)');
  console.log('  ml_student50@srit.ac.in / srit1234 (Roll: 234G5A0450)\n');
}

// Run the script
createBulkStudents().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
