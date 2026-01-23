import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function assignStudentsToRama() {
  try {
    console.log('🎯 Starting student and subject assignments for Rama...\n');

    // 1. Find Rama in faculty table
    console.log('1️⃣ Finding Rama in faculty...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, full_name, role_id')
      .ilike('full_name', '%rama%')
      .eq('role_id', 2); // Faculty role

    if (userError) {
      console.error('Error finding Rama:', userError);
      return;
    }

    if (!users || users.length === 0) {
      console.log('❌ Rama not found in users table. Creating Rama...');
      
      // Create Rama as faculty
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'rama@srit.ac.in',
        password: 'srit1234',
        email_confirm: true
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return;
      }

      // Add to users table
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: 'Rama Krishna',
          role_id: 2 // Faculty
        });

      if (userInsertError) {
        console.error('Error inserting user:', userInsertError);
        return;
      }

      // Add to faculty table
      const { error: facultyError } = await supabase
        .from('faculty')
        .insert({
          user_id: authData.user.id,
          employee_id: 'FAC001',
          department_id: 1, // CSE
          designation: 'Assistant Professor'
        });

      if (facultyError) {
        console.error('Error inserting faculty:', facultyError);
        return;
      }

      console.log('✅ Rama created successfully!');
      users.push({ id: authData.user.id, full_name: 'Rama Krishna', role_id: 2 });
    }

    const ramaUserId = users[0].id;
    console.log(`✅ Found Rama: ${users[0].full_name} (ID: ${ramaUserId})`);

    // 2. Get Rama's faculty record
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('id, department_id')
      .eq('user_id', ramaUserId)
      .single();

    if (facultyError) {
      console.error('Error getting faculty record:', facultyError);
      return;
    }

    const ramaFacultyId = facultyData.id;
    const ramaDeptId = facultyData.department_id;
    console.log(`✅ Rama Faculty ID: ${ramaFacultyId}, Department: ${ramaDeptId}\n`);

    // 3. Get or create subjects for 6th semester CSE
    console.log('2️⃣ Getting/Creating subjects for 6th semester CSE...');
    const semesterId = 6; // Semester 6 ID from semesters table
    const subjects = [
      { subject_code: 'CS601', subject_name: 'Machine Learning', department_id: ramaDeptId || 1, semester_id: semesterId },
      { subject_code: 'CS602', subject_name: 'Cloud Computing', department_id: ramaDeptId || 1, semester_id: semesterId },
      { subject_code: 'CS603', subject_name: 'Cyber Security', department_id: ramaDeptId || 1, semester_id: semesterId },
      { subject_code: 'CS604', subject_name: 'Mobile Application Development', department_id: ramaDeptId || 1, semester_id: semesterId }
    ];

    const createdSubjects = [];
    for (const subject of subjects) {
      // Check if subject exists
      const { data: existing } = await supabase
        .from('subjects')
        .select('id, subject_code, subject_name')
        .eq('subject_code', subject.subject_code)
        .single();

      if (existing) {
        console.log(`   ℹ️  Subject exists: ${existing.subject_code} - ${existing.subject_name}`);
        createdSubjects.push(existing);
      } else {
        // Create subject
        const { data: newSubject, error: subjectError } = await supabase
          .from('subjects')
          .insert(subject)
          .select()
          .single();

        if (subjectError) {
          console.error(`   ❌ Error creating subject ${subject.subject_code}:`, subjectError);
        } else {
          console.log(`   ✅ Created subject: ${newSubject.subject_code} - ${newSubject.subject_name}`);
          createdSubjects.push(newSubject);
        }
      }
    }

    console.log(`\n✅ Total subjects available: ${createdSubjects.length}\n`);

    // 4. Assign subjects to Rama (faculty_subjects)
    console.log('3️⃣ Assigning subjects to Rama...');
    for (const subject of createdSubjects) {
      // Check if assignment exists
      const { data: existing } = await supabase
        .from('faculty_subjects')
        .select('id')
        .eq('faculty_id', ramaFacultyId)
        .eq('subject_id', subject.id)
        .single();

      if (existing) {
        console.log(`   ℹ️  Already assigned: ${subject.subject_code}`);
      } else {
        const { error: assignError } = await supabase
          .from('faculty_subjects')
          .insert({
            faculty_id: ramaFacultyId,
            subject_id: subject.id
          });

        if (assignError) {
          console.error(`   ❌ Error assigning ${subject.subject_code}:`, assignError);
        } else {
          console.log(`   ✅ Assigned: ${subject.subject_code} - ${subject.subject_name}`);
        }
      }
    }

    // 5. Get students from admission year 2023 (which makes them in 6th semester in 2026)
    console.log('\n4️⃣ Finding students from 2023 batch (6th semester)...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, roll_no, user_id, users(full_name)')
      .eq('admission_year', 2023)
      .eq('department_id', ramaDeptId || 1)
      .limit(30); // Get 30 students

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return;
    }

    console.log(`✅ Found ${students.length} students from 2023 batch\n`);

    console.log(`\n✅ Assignment complete!`);
    console.log(`   📊 Students: ${students.length}`);
    console.log(`   📚 Subjects: ${createdSubjects.length}`);
    console.log(`   👨‍🏫 Faculty: Rama Krishna\n`);

    // 6. Summary
    console.log('📋 SUMMARY:');
    console.log('━'.repeat(50));
    console.log(`Faculty: ${users[0].full_name}`);
    console.log(`Faculty ID: ${ramaFacultyId}`);
    console.log(`Department: ${ramaDeptId ? `ID ${ramaDeptId}` : 'CSE (ID 1)'}`);
    console.log(`Semester: 6 (2023 batch)`);
    console.log(`\nSubjects assigned to Rama:`);
    createdSubjects.forEach(s => console.log(`  - ${s.subject_code}: ${s.subject_name}`));
    console.log(`\nStudents from 2023 batch (${students.length}):`);
    students.forEach(s => console.log(`  - ${s.roll_no}: ${s.users?.full_name || 'N/A'}`));
    console.log('━'.repeat(50));
    console.log('\n✅ Rama can now teach these subjects to the students!');
    console.log('📝 Note: Students are assigned to subjects through faculty_subjects mapping.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

assignStudentsToRama();
