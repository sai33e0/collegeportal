import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkFacultySchema() {
  try {
    // Try to get one faculty record to see the columns
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Faculty columns:', data);
      if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkFacultySchema();
