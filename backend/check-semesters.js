import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSemesters() {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Semesters:');
      console.table(data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSemesters();
