import supabase from './src/config/supabase.js';

// Bulk student data - 100 students for CSE and AI/ML (2023 batch, Semester 6)
const bulkStudents = [];

// Generate 100 students (234G1A3301 - 234G1A3320 for CSE, 234G5A0401-234G5A0420 for AI/ML)
// CSE students: 234G1A3301 - 234G1A3350
for (let i = 1; i <= 50; i++) {
  const rollNo = `234G1A33${String(i).padStart(2, '0')}`;
  const email = `student${String(i).padStart(2, '0')}@srit.ac.in`;
  bulkStudents.push({
    email,
    password: 'srit1234',
    full_name: `CSE Student ${i}`,
    roll_no: rollNo,
    dept_id: 1, // CSE
    semester: 6,
    year: 2023
  });
}

// AI/ML students: 234G5A0401 - 234G5A0450
for (let i = 1; i <= 50; i++) {
  const rollNo = `234G5A04${String(i).padStart(2, '0')}`;
  const email = `ml_student${String(i).padStart(2, '0')}@srit.ac.in`;
  bulkStudents.push({
    email,
    password: 'srit1234',
    full_name: `AI/ML Student ${i}`,
    roll_no: rollNo,
    dept_id: 3, // AI/ML (assuming dept_id 3 exists)
    semester: 6,
    year: 2023
  });
}

// CSE Subjects for 6th semester
const cseSubjects = [
  { code: 'CS601', name: 'Cloud Computing', dept_id: 1, credits: 4, semester: 6 },
  { code: 'CS602', name: 'Web Technologies', dept_id: 1, credits: 3, semester: 6 },
  { code: 'CS603', name: 'Artificial Intelligence', dept_id: 1, credits: 4, semester: 6 },
  { code: 'CS604', name: 'Data Science', dept_id: 1, credits: 4, semester: 6 },
  { code: 'CS605', name: 'Cybersecurity', dept_id: 1, credits: 3, semester: 6 },
];

// AI/ML Subjects for 6th semester
const aimlSubjects = [
  { code: 'AI601', name: 'Deep Learning', dept_id: 3, credits: 4, semester: 6 },
  { code: 'AI602', name: 'Natural Language Processing', dept_id: 3, credits: 4, semester: 6 },
  { code: 'AI603', name: 'Computer Vision', dept_id: 3, credits: 4, semester: 6 },
  { code: 'AI604', name: 'Reinforcement Learning', dept_id: 3, credits: 3, semester: 6 },
  { code: 'AI605', name: 'ML Operations', dept_id: 3, credits: 3, semester: 6 },
];

// Faculty data (additional faculty for bulk assignment)
const facultyData = [
  { email: 'dr.kumar@srit.ac.in', password: 'srit1234', full_name: 'Dr. Kumar Singh', emp_id: 'FAC005', dept_id: 1, designation: 'Professor' },
  { email: 'dr.sharma@srit.ac.in', password: 'srit1234', full_name: 'Dr. Sharma', emp_id: 'FAC006', dept_id: 1, designation: 'Associate Professor' },
  { email: 'dr.patel@srit.ac.in', password: 'srit1234', full_name: 'Dr. Patel', emp_id: 'FAC007', dept_id: 1, designation: 'Assistant Professor' },
  { email: 'dr.gupta.ai@srit.ac.in', password: 'srit1234', full_name: 'Dr. Gupta AI', emp_id: 'FAC008', dept_id: 3, designation: 'Professor' },
  { email: 'dr.verma@srit.ac.in', password: 'srit1234', full_name: 'Dr. Verma', emp_id: 'FAC009', dept_id: 3, designation: 'Associate Professor' },
];

// Subject assignments (Faculty to Subjects)
const subjectAssignments = [
  // CSE Faculty assignments
  { faculty_email: 'dr.kumar@srit.ac.in', subject_code: 'CS601', academic_year: '2024-25' },
  { faculty_email: 'dr.sharma@srit.ac.in', subject_code: 'CS602', academic_year: '2024-25' },
  { faculty_email: 'dr.patel@srit.ac.in', subject_code: 'CS603', academic_year: '2024-25' },
  { faculty_email: 'rajesh.kumar@srit.ac.in', subject_code: 'CS604', academic_year: '2024-25' },
  { faculty_email: 'priya.sharma@srit.ac.in', subject_code: 'CS605', academic_year: '2024-25' },
  
  // AI/ML Faculty assignments
  { faculty_email: 'dr.gupta.ai@srit.ac.in', subject_code: 'AI601', academic_year: '2024-25' },
  { faculty_email: 'dr.verma@srit.ac.in', subject_code: 'AI602', academic_year: '2024-25' },
  { faculty_email: 'neha.gupta@srit.ac.in', subject_code: 'AI603', academic_year: '2024-25' },
  { faculty_email: 'dr.kumar@srit.ac.in', subject_code: 'AI604', academic_year: '2024-25' },
  { faculty_email: 'dr.patel@srit.ac.in', subject_code: 'AI605', academic_year: '2024-25' },
];

async function createBulkData() {
  console.log('🚀 Starting bulk student data creation...\n');

  try {
    // Step 1: Create Faculty Users
    console.log('📚 Step 1: Creating Additional Faculty Users...');
    const facultyMap = {};
    
    for (const faculty of facultyData) {
      try {
        // Check if faculty already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('full_name', faculty.full_name)
          .single();

        if (existingUser) {
          console.log(`  ⊘ Faculty ${faculty.email} already exists`);
          facultyMap[faculty.email] = existingUser.id;
          continue;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: faculty.email,
          password: faculty.password,
          email_confirm: true
        });

        if (authError) {
          if (authError.message.includes('already exists')) {
            console.log(`  ⊘ Faculty ${faculty.email} already exists in auth`);
          } else {
            console.error(`  ✗ Failed to create auth user ${faculty.email}:`, authError.message);
          }
          continue;
        }

        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            role_id: 2,
            full_name: faculty.full_name
          });

        if (userError && !userError.message.includes('duplicate')) {
          console.error(`  ✗ Failed to create user record:`, userError.message);
          continue;
        }

        // Create faculty record
        const { data: facultyDataRes, error: facultyError } = await supabase
          .from('faculty')
          .insert({
            user_id: authData.user.id,
            employee_id: faculty.emp_id,
            dept_id: faculty.dept_id,
            designation: faculty.designation
          })
          .select()
          .single();

        if (facultyError && !facultyError.message.includes('duplicate')) {
          console.error(`  ✗ Failed to create faculty record:`, facultyError.message);
          continue;
        }

        facultyMap[faculty.email] = authData.user.id;
        console.log(`  ✓ Created Faculty: ${faculty.full_name} (${faculty.email})`);
      } catch (err) {
        console.error(`  ✗ Error creating faculty ${faculty.email}:`, err.message);
      }
    }

    // Step 2: Create CSE Subjects
    console.log('\n📖 Step 2: Creating CSE Subjects (6th Semester)...');
    
    for (const subject of cseSubjects) {
      try {
        const { error } = await supabase
          .from('subjects')
          .insert({
            code: subject.code,
            name: subject.name,
            dept_id: subject.dept_id,
            credits: subject.credits,
            semester: subject.semester
          });

        if (error && !error.message.includes('duplicate')) {
          console.error(`  ✗ Failed to create subject ${subject.code}:`, error.message);
        } else {
          console.log(`  ✓ Created Subject: ${subject.code} - ${subject.name}`);
        }
      } catch (err) {
        console.error(`  ✗ Error creating subject:`, err.message);
      }
    }

    // Step 3: Create AI/ML Subjects
    console.log('\n📖 Step 3: Creating AI/ML Subjects (6th Semester)...');
    
    for (const subject of aimlSubjects) {
      try {
        const { error } = await supabase
          .from('subjects')
          .insert({
            code: subject.code,
            name: subject.name,
            dept_id: subject.dept_id,
            credits: subject.credits,
            semester: subject.semester
          });

        if (error && !error.message.includes('duplicate')) {
          console.error(`  ✗ Failed to create subject ${subject.code}:`, error.message);
        } else {
          console.log(`  ✓ Created Subject: ${subject.code} - ${subject.name}`);
        }
      } catch (err) {
        console.error(`  ✗ Error creating subject:`, err.message);
      }
    }

    // Step 4: Assign Faculty to Subjects
    console.log('\n👨‍🏫 Step 4: Assigning Faculty to Subjects...');
    
    for (const assignment of subjectAssignments) {
      try {
        // Get subject ID
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id')
          .eq('code', assignment.subject_code)
          .single();

        if (!subjectData) {
          console.log(`  ⊘ Subject ${assignment.subject_code} not found`);
          continue;
        }

        // Get faculty user ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .ilike('email', assignment.faculty_email)
          .single();

        if (!userData) {
          console.log(`  ⊘ Faculty ${assignment.faculty_email} not found`);
          continue;
        }

        // Get faculty record
        const { data: facultyData } = await supabase
          .from('faculty')
          .select('id')
          .eq('user_id', userData.id)
          .single();

        if (!facultyData) {
          console.log(`  ⊘ Faculty record not found for ${assignment.faculty_email}`);
          continue;
        }

        // Create assignment
        const { error: assignError } = await supabase
          .from('faculty_subjects')
          .insert({
            faculty_id: facultyData.id,
            subject_id: subjectData.id,
            academic_year: assignment.academic_year
          });

        if (assignError && !assignError.message.includes('duplicate')) {
          console.error(`  ✗ Failed to assign:`, assignError.message);
        } else {
          console.log(`  ✓ Assigned ${assignment.faculty_email} → ${assignment.subject_code}`);
        }
      } catch (err) {
        console.error(`  ✗ Error assigning faculty:`, err.message);
      }
    }

    // Step 5: Create Bulk Students
    console.log('\n👨‍🎓 Step 5: Creating 100 Bulk Students (2023 Batch, Semester 6)...');
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const student of bulkStudents) {
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
          } else {
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
          console.error(`  ✗ Failed to create user record:`, userError.message);
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
          console.error(`  ✗ Failed to create student record:`, studentError.message);
          continue;
        }

        createdCount++;
        if (createdCount % 10 === 0) {
          console.log(`  ✓ Created ${createdCount} students...`);
        }
      } catch (err) {
        console.error(`  ✗ Error creating student ${student.email}:`, err.message);
      }
    }

    console.log(`\n✅ Successfully created ${createdCount} students`);
    if (skippedCount > 0) {
      console.log(`⊘ Skipped ${skippedCount} students (already existed)`);
    }

    console.log('\n🎉 BULK DATA CREATION COMPLETE!');
    console.log('================================================');
    console.log(`  ✅ Faculty Created: ${Object.keys(facultyMap).length}`);
    console.log(`  ✅ Subjects Created: ${cseSubjects.length + aimlSubjects.length}`);
    console.log(`  ✅ Faculty-Subject Assignments: ${subjectAssignments.length}`);
    console.log(`  ✅ Students Created: ${createdCount}`);
    console.log('================================================\n');

    console.log('📧 LOGIN CREDENTIALS (Sample Students):');
    console.log('  CSE Student 1: student01@srit.ac.in / srit1234 (Roll: 234G1A3301)');
    console.log('  CSE Student 50: student50@srit.ac.in / srit1234 (Roll: 234G1A3350)');
    console.log('  AI/ML Student 1: ml_student01@srit.ac.in / srit1234 (Roll: 234G5A0401)');
    console.log('  AI/ML Student 50: ml_student50@srit.ac.in / srit1234 (Roll: 234G5A0450)');
    console.log('\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
createBulkData();
