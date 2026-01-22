import supabase from './src/config/supabase.js';

const demoSemesters = [
  { semester_no: 1, academic_year: '2023-2024', is_active: true },
  { semester_no: 2, academic_year: '2023-2024', is_active: true },
  { semester_no: 3, academic_year: '2023-2024', is_active: true },
  { semester_no: 4, academic_year: '2023-2024', is_active: true },
  { semester_no: 5, academic_year: '2024-2025', is_active: false },
  { semester_no: 6, academic_year: '2024-2025', is_active: false },
  { semester_no: 7, academic_year: '2024-2025', is_active: false },
  { semester_no: 8, academic_year: '2024-2025', is_active: false },
];

async function createDemoSemesters() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  Creating Demo Semesters');
  console.log('═══════════════════════════════════════════\n');

  let createdCount = 0;
  let skippedCount = 0;

  for (const semester of demoSemesters) {
    try {
      // Check if semester already exists
      const { data: existingSemester } = await supabase
        .from('semesters')
        .select('id')
        .eq('semester_no', semester.semester_no)
        .single();

      if (existingSemester) {
        console.log(`⊘ Semester ${semester.semester_no} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create semester
      const { data, error } = await supabase
        .from('semesters')
        .insert([semester])
        .select()
        .single();

      if (error) {
        console.error(`✗ Failed to create semester ${semester.semester_no}:`, error.message);
        continue;
      }

      console.log(`✓ Semester ${semester.semester_no} (${semester.academic_year}) created`);
      createdCount++;
    } catch (error) {
      console.error(`✗ Error creating semester:`, error.message);
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log(`✓ Semester creation completed!`);
  console.log(`  Created: ${createdCount} | Skipped: ${skippedCount}`);
  console.log('═══════════════════════════════════════════\n');

  process.exit(0);
}

createDemoSemesters().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
