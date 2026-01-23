import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSchemas() {
  try {
    console.log('Checking students table...');
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(1);

    if (studentsError) {
      console.error('Students error:', studentsError);
    } else if (students && students.length > 0) {
      console.log('Students columns:', Object.keys(students[0]));
      console.log('Sample:', students[0]);
    }

    console.log('\nChecking subjects table...');
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);

    if (subjectsError) {
      console.error('Subjects error:', subjectsError);
    } else if (subjects && subjects.length > 0) {
      console.log('Subjects columns:', Object.keys(subjects[0]));
      console.log('Sample:', subjects[0]);
    } else {
      console.log('No subjects found');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSchemas();
