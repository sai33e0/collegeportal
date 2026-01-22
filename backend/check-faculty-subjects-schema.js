import supabase from './src/config/supabase.js';

async function checkSchema() {
  try {
    console.log('\nChecking faculty_subjects table schema...\n');
    
    // Try to fetch one row to see columns
    const { data, error } = await supabase
      .from('faculty_subjects')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error.message);
    } else {
      if (data && data.length > 0) {
        console.log('faculty_subjects table columns:');
        console.log(Object.keys(data[0]));
        console.log('\nSample row:');
        console.log(data[0]);
      } else {
        console.log('No faculty_subjects found.');
      }
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
  
  process.exit(0);
}

checkSchema();
