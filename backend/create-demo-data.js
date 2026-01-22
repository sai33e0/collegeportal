import supabase from './src/config/supabase.js';

// Demo faculty data
const demoFaculty = [
  { email: 'rajesh.kumar@srit.ac.in', password: 'srit1234', full_name: 'Dr. Rajesh Kumar', emp_id: 'FAC001', dept_id: 1, designation: 'Associate Professor' },
  { email: 'priya.sharma@srit.ac.in', password: 'srit1234', full_name: 'Dr. Priya Sharma', emp_id: 'FAC002', dept_id: 1, designation: 'Assistant Professor' },
  { email: 'arun.patel@srit.ac.in', password: 'srit1234', full_name: 'Prof. Arun Patel', emp_id: 'FAC003', dept_id: 1, designation: 'Professor' },
  { email: 'neha.gupta@srit.ac.in', password: 'srit1234', full_name: 'Dr. Neha Gupta', emp_id: 'FAC004', dept_id: 2, designation: 'Assistant Professor' },
];

// Demo student data with emails
const demoStudents = [
  { email: 'student1@srit.ac.in', password: 'srit1234', full_name: 'Rahul Kumar', roll_no: '21CS1A0501', dept_id: 1, semester: 6, year: 2021 },
  { email: 'student2@srit.ac.in', password: 'srit1234', full_name: 'Priya Singh', roll_no: '21CS1A0502', dept_id: 1, semester: 6, year: 2021 },
  { email: 'student3@srit.ac.in', password: 'srit1234', full_name: 'Amit Desai', roll_no: '21CS1A0503', dept_id: 1, semester: 6, year: 2021 },
  { email: 'student4@srit.ac.in', password: 'srit1234', full_name: 'Divya Nair', roll_no: '21EC1A0401', dept_id: 2, semester: 6, year: 2021 },
];

// Subject assignments
const subjectAssignments = [
  // CSE Faculty assignments
  { faculty_email: 'rajesh.kumar@srit.ac.in', subject_code: 'CS301', academic_year: '2024-25' },
  { faculty_email: 'priya.sharma@srit.ac.in', subject_code: 'CS302', academic_year: '2024-25' },
  { faculty_email: 'arun.patel@srit.ac.in', subject_code: 'CS303', academic_year: '2024-25' },
  // ECE Faculty assignments
  { faculty_email: 'neha.gupta@srit.ac.in', subject_code: 'EC301', academic_year: '2024-25' },
];

// Marks data (internal1, internal2, lab, assignment)
const marksData = [
  // Rahul Kumar - Student 1
  { student_roll: '21CS1A0501', subject_code: 'CS301', marks: { internal1: 24, internal2: 23, lab: 18, assignment: 9 } },
  { student_roll: '21CS1A0501', subject_code: 'CS302', marks: { internal1: 22, internal2: 20, lab: 17, assignment: 8 } },
  { student_roll: '21CS1A0501', subject_code: 'CS303', marks: { internal1: 23, internal2: 22, lab: 19, assignment: 9 } },
  // Priya Singh - Student 2
  { student_roll: '21CS1A0502', subject_code: 'CS301', marks: { internal1: 25, internal2: 24, lab: 20, assignment: 10 } },
  { student_roll: '21CS1A0502', subject_code: 'CS302', marks: { internal1: 23, internal2: 22, lab: 18, assignment: 9 } },
  { student_roll: '21CS1A0502', subject_code: 'CS303', marks: { internal1: 24, internal2: 23, lab: 19, assignment: 10 } },
  // Amit Desai - Student 3
  { student_roll: '21CS1A0503', subject_code: 'CS301', marks: { internal1: 20, internal2: 19, lab: 16, assignment: 8 } },
  { student_roll: '21CS1A0503', subject_code: 'CS302', marks: { internal1: 21, internal2: 20, lab: 17, assignment: 8 } },
  { student_roll: '21CS1A0503', subject_code: 'CS303', marks: { internal1: 22, internal2: 21, lab: 18, assignment: 9 } },
  // Divya Nair - Student 4 (ECE)
  { student_roll: '21EC1A0401', subject_code: 'EC301', marks: { internal1: 23, internal2: 22, lab: 17, assignment: 9 } },
];

// Fee structure for students (semester-wise)
const feeData = [
  { student_roll: '21CS1A0501', tuition_fee: 120000, lab_fee: 15000, other_fee: 10000, paid: 80000, due: 65000 },
  { student_roll: '21CS1A0502', tuition_fee: 120000, lab_fee: 15000, other_fee: 10000, paid: 145000, due: 0 },
  { student_roll: '21CS1A0503', tuition_fee: 120000, lab_fee: 15000, other_fee: 10000, paid: 100000, due: 45000 },
  { student_roll: '21EC1A0401', tuition_fee: 120000, lab_fee: 12000, other_fee: 10000, paid: 120000, due: 22000 },
];

async function createDemoData() {
  console.log('🚀 Starting demo data creation...\n');

  try {
    // Step 1: Create Faculty Users
    console.log('📚 Step 1: Creating Faculty Users...');
    const facultyMap = {};
    
    for (const faculty of demoFaculty) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: faculty.email,
          password: faculty.password,
          email_confirm: true
        });

        if (authError) {
          if (authError.message.includes('already exists')) {
            console.log(`  ⊘ Faculty ${faculty.email} already exists`);
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
          await supabase.auth.admin.deleteUser(authData.user.id);
          continue;
        }

        // Create faculty record
        const { data: facultyData, error: facultyError } = await supabase
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

        facultyMap[faculty.email] = facultyData?.id || faculty.emp_id;
        console.log(`  ✓ Created Faculty: ${faculty.full_name} (${faculty.email})`);
      } catch (err) {
        console.error(`  ✗ Error creating faculty ${faculty.email}:`, err.message);
      }
    }

    // Step 2: Create Student Users
    console.log('\n👨‍🎓 Step 2: Creating Student Users...');
    const studentMap = {};
    
    for (const student of demoStudents) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: student.email,
          password: student.password,
          email_confirm: true
        });

        if (authError) {
          if (authError.message.includes('already exists')) {
            console.log(`  ⊘ Student ${student.email} already exists`);
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
          await supabase.auth.admin.deleteUser(authData.user.id);
          continue;
        }

        // Create student record
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            roll_no: student.roll_no,
            dept_id: student.dept_id,
            semester: student.semester,
            year_of_admission: student.year
          })
          .select()
          .single();

        if (studentError && !studentError.message.includes('duplicate')) {
          console.error(`  ✗ Failed to create student record:`, studentError.message);
          continue;
        }

        studentMap[student.roll_no] = studentData?.id || student.roll_no;
        console.log(`  ✓ Created Student: ${student.full_name} (${student.roll_no})`);
      } catch (err) {
        console.error(`  ✗ Error creating student ${student.email}:`, err.message);
      }
    }

    // Step 3: Assign Faculty to Subjects
    console.log('\n📖 Step 3: Assigning Faculty to Subjects...');
    
    for (const assignment of subjectAssignments) {
      try {
        // Get faculty ID by email
        const { data: facultyData } = await supabase
          .from('faculty')
          .select('id')
          .eq('user_id', 
            (await supabase
              .from('users')
              .select('id')
              .eq('full_name', demoFaculty.find(f => f.email === assignment.faculty_email)?.full_name)
              .single()).data?.id
          )
          .single();

        // Get subject ID by code
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id')
          .eq('code', assignment.subject_code)
          .single();

        if (!subjectData) {
          console.log(`  ⊘ Subject ${assignment.subject_code} not found - skipping assignment`);
          continue;
        }

        // Create faculty-subject assignment
        const { error: assignError } = await supabase
          .from('faculty_subjects')
          .insert({
            faculty_id: facultyData?.id,
            subject_id: subjectData.id,
            academic_year: assignment.academic_year
          });

        if (assignError && !assignError.message.includes('duplicate')) {
          console.error(`  ✗ Failed to assign:`, assignError.message);
          continue;
        }

        console.log(`  ✓ Assigned ${assignment.faculty_email} → ${assignment.subject_code}`);
      } catch (err) {
        console.error(`  ✗ Error assigning faculty:`, err.message);
      }
    }

    // Step 4: Add Student Marks
    console.log('\n📝 Step 4: Adding Student Marks...');
    
    for (const markEntry of marksData) {
      try {
        // Get student ID
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('roll_no', markEntry.student_roll)
          .single();

        // Get subject ID
        const { data: subjectData } = await supabase
          .from('subjects')
          .select('id')
          .eq('code', markEntry.subject_code)
          .single();

        if (!studentData || !subjectData) {
          console.log(`  ⊘ Student/Subject not found for ${markEntry.student_roll} - ${markEntry.subject_code}`);
          continue;
        }

        // Add marks for each exam type
        const examTypes = [
          { type: 'internal1', marks: markEntry.marks.internal1, max: 25 },
          { type: 'internal2', marks: markEntry.marks.internal2, max: 25 },
          { type: 'lab', marks: markEntry.marks.lab, max: 20 },
          { type: 'assignment', marks: markEntry.marks.assignment, max: 10 }
        ];

        for (const exam of examTypes) {
          const { error } = await supabase
            .from('marks')
            .insert({
              student_id: studentData.id,
              subject_id: subjectData.id,
              exam_type: exam.type,
              marks_obtained: exam.marks,
              max_marks: exam.max,
              published: true
            });

          if (error && !error.message.includes('duplicate')) {
            console.error(`    ✗ Failed to add ${exam.type} marks:`, error.message);
          }
        }

        console.log(`  ✓ Added marks for ${markEntry.student_roll} - ${markEntry.subject_code}`);
      } catch (err) {
        console.error(`  ✗ Error adding marks:`, err.message);
      }
    }

    // Step 5: Add Fee Details
    console.log('\n💰 Step 5: Adding Fee Details...');
    
    for (const fee of feeData) {
      try {
        // Get student ID
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('roll_no', fee.student_roll)
          .single();

        if (!studentData) {
          console.log(`  ⊘ Student ${fee.student_roll} not found - skipping fee entry`);
          continue;
        }

        // Create or update fee record
        const { error } = await supabase
          .from('fees')
          .insert({
            student_id: studentData.id,
            tuition_fee: fee.tuition_fee,
            lab_fee: fee.lab_fee,
            other_fee: fee.other_fee,
            amount_paid: fee.paid,
            amount_due: fee.due,
            semester: 6,
            academic_year: '2024-25'
          });

        if (error && !error.message.includes('duplicate')) {
          console.error(`  ✗ Failed to add fee:`, error.message);
          continue;
        }

        console.log(`  ✓ Added fees for ${fee.student_roll} (Paid: ₹${fee.paid}, Due: ₹${fee.due})`);
      } catch (err) {
        console.error(`  ✗ Error adding fees:`, err.message);
      }
    }

    console.log('\n✅ Demo data creation completed!');
    console.log('\n📋 Summary:');
    console.log(`  Faculty created: ${Object.keys(facultyMap).length}`);
    console.log(`  Students created: ${Object.keys(studentMap).length}`);
    console.log(`  Faculty-Subject assignments: ${subjectAssignments.length}`);
    console.log(`  Marks entries: ${marksData.length * 4}`);
    console.log(`  Fee records: ${feeData.length}`);
    console.log('\n🔐 Demo Credentials:');
    console.log('  Admin: admin@srit.com / srit1234');
    demoFaculty.forEach(f => console.log(`  Faculty: ${f.email} / srit1234`));
    demoStudents.forEach(s => console.log(`  Student: ${s.email} / srit1234`));

  } catch (error) {
    console.error('❌ Error during data creation:', error);
  }
}

createDemoData();
