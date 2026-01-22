import supabase from './src/config/supabase.js';

async function checkSchema() {
  console.log('Checking database schema...\n');

  // Check students table
  console.log('1. Testing students table:');
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select('*')
    .limit(1);
  
  if (studentError) {
    console.log('   ✗ Error:', studentError.message);
  } else {
    console.log('   ✓ Students table OK');
    if (studentData && studentData.length > 0) {
      console.log('   Columns:', Object.keys(studentData[0]).join(', '));
    }
  }

  // Check faculty table
  console.log('\n2. Testing faculty table:');
  const { data: facultyData, error: facultyError } = await supabase
    .from('faculty')
    .select('*')
    .limit(1);
  
  if (facultyError) {
    console.log('   ✗ Error:', facultyError.message);
  } else {
    console.log('   ✓ Faculty table OK');
    if (facultyData && facultyData.length > 0) {
      console.log('   Columns:', Object.keys(facultyData[0]).join(', '));
    } else {
      console.log('   Note: No faculty records exist yet');
      // Try to get table structure another way
      console.log('   Attempting empty insert to check columns...');
      const { error: insertError } = await supabase
        .from('faculty')
        .insert({});
      if (insertError) {
        console.log('   Expected error (reveals column requirements):', insertError.message);
      }
    }
  }

  // Check subjects table
  console.log('\n3. Testing subjects table:');
  const { data: subjectData, error: subjectError } = await supabase
    .from('subjects')
    .select('*')
    .limit(1);
  
  if (subjectError) {
    console.log('   ✗ Error:', subjectError.message);
  } else {
    console.log('   ✓ Subjects table OK');
    if (subjectData && subjectData.length > 0) {
      console.log('   Columns:', Object.keys(subjectData[0]).join(', '));
    }
  }

  // Check departments table
  console.log('\n4. Testing departments table:');
  const { data: deptData, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .limit(1);
  
  if (deptError) {
    console.log('   ✗ Error:', deptError.message);
  } else {
    console.log('   ✓ Departments table OK');
    if (deptData && deptData.length > 0) {
      console.log('   Columns:', Object.keys(deptData[0]).join(', '));
    }
  }

  console.log('\n✓ Schema check complete!\n');
  process.exit(0);
}

checkSchema().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
