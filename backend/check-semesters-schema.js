import supabase from './src/config/supabase.js';

async function checkSemestersSchema() {
  try {
    console.log('Checking semesters table schema...\n');
    
    // Try to fetch one row to see columns
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error.message);
    } else {
      if (data && data.length > 0) {
        console.log('Semesters table columns:');
        console.log(Object.keys(data[0]));
        console.log('\nSample row:');
        console.log(data[0]);
      } else {
        console.log('No semesters found. Creating sample...');
        // Try with just semester_number
        const { data: created, error: createError } = await supabase
          .from('semesters')
          .insert([{ semester_number: 1 }])
          .select();
        
        if (createError) {
          console.error('Create error:', createError.message);
        } else {
          console.log('Created with columns:');
          console.log(Object.keys(created[0]));
          console.log(created[0]);
        }
      }
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
  
  process.exit(0);
}

checkSemestersSchema();
