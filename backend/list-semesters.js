import supabase from './src/config/supabase.js';

async function listSemesters() {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('\nAvailable Semesters in Database:\n');
      console.log('ID | Semester No | Academic Year | Active');
      console.log('───────────────────────────────────────────');
      data.forEach(sem => {
        console.log(`${sem.id}  | ${sem.semester_no}            | ${sem.academic_year}    | ${sem.is_active}`);
      });
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
  
  process.exit(0);
}

listSemesters();
