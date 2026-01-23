import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkFacultySubjects() {
  try {
    console.log('Checking faculty_subjects table...');
    const { data, error } = await supabase
      .from('faculty_subjects')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
    } else if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample:', data[0]);
    } else {
      console.log('No faculty_subjects found. Checking schema...');
      
      // Try inserting without academic_year
      const { data: testData, error: testError } = await supabase
        .from('faculty_subjects')
        .insert({
          faculty_id: 1,
          subject_id: 1
        })
        .select();
      
      if (testError) {
        console.error('Insert test error:', testError);
      } else {
        console.log('Insert successful!', testData);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkFacultySubjects();
