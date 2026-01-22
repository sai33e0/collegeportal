import supabase from './src/config/supabase.js';

const demoSubjects = [
  // Semester 1 - Computer Science
  { subject_code: 'CS101', subject_name: 'Programming Fundamentals', department_id: 1, semester_id: 1 },
  { subject_code: 'CS102', subject_name: 'Mathematics - I', department_id: 1, semester_id: 1 },
  { subject_code: 'CS103', subject_name: 'Digital Logic', department_id: 1, semester_id: 1 },
  { subject_code: 'CS104', subject_name: 'English Communication', department_id: 1, semester_id: 1 },

  // Semester 2 - Computer Science
  { subject_code: 'CS201', subject_name: 'Data Structures', department_id: 1, semester_id: 2 },
  { subject_code: 'CS202', subject_name: 'Mathematics - II', department_id: 1, semester_id: 2 },
  { subject_code: 'CS203', subject_name: 'Computer Architecture', department_id: 1, semester_id: 2 },
  { subject_code: 'CS204', subject_name: 'Web Technologies', department_id: 1, semester_id: 2 },

  // Semester 3 - Computer Science
  { subject_code: 'CS301', subject_name: 'Algorithms', department_id: 1, semester_id: 3 },
  { subject_code: 'CS302', subject_name: 'Database Management Systems', department_id: 1, semester_id: 3 },
  { subject_code: 'CS303', subject_name: 'Operating Systems', department_id: 1, semester_id: 3 },
  { subject_code: 'CS304', subject_name: 'Software Engineering', department_id: 1, semester_id: 3 },

  // Semester 4 - Computer Science
  { subject_code: 'CS401', subject_name: 'Compiler Design', department_id: 1, semester_id: 4 },
  { subject_code: 'CS402', subject_name: 'Computer Networks', department_id: 1, semester_id: 4 },
  { subject_code: 'CS403', subject_name: 'Web Development', department_id: 1, semester_id: 4 },
  { subject_code: 'CS404', subject_name: 'Machine Learning', department_id: 1, semester_id: 4 },

  // Semester 5 - Computer Science
  { subject_code: 'CS501', subject_name: 'Artificial Intelligence', department_id: 1, semester_id: 5 },
  { subject_code: 'CS502', subject_name: 'Cloud Computing', department_id: 1, semester_id: 5 },
  { subject_code: 'CS503', subject_name: 'Cybersecurity', department_id: 1, semester_id: 5 },
  { subject_code: 'CS504', subject_name: 'Mobile Application Development', department_id: 1, semester_id: 5 },

  // Semester 6 - Computer Science
  { subject_code: 'CS601', subject_name: 'Big Data Analytics', department_id: 1, semester_id: 6 },
  { subject_code: 'CS602', subject_name: 'Internet of Things', department_id: 1, semester_id: 6 },
  { subject_code: 'CS603', subject_name: 'Blockchain Technology', department_id: 1, semester_id: 6 },
  { subject_code: 'CS604', subject_name: 'Advanced Web Development', department_id: 1, semester_id: 6 },

  // Semester 7 - Computer Science
  { subject_code: 'CS701', subject_name: 'Deep Learning', department_id: 1, semester_id: 7 },
  { subject_code: 'CS702', subject_name: 'Natural Language Processing', department_id: 1, semester_id: 7 },
  { subject_code: 'CS703', subject_name: 'Computer Vision', department_id: 1, semester_id: 7 },
  { subject_code: 'CS704', subject_name: 'Project Management', department_id: 1, semester_id: 7 },

  // Semester 8 - Computer Science
  { subject_code: 'CS801', subject_name: 'Capstone Project', department_id: 1, semester_id: 8 },
  { subject_code: 'CS802', subject_name: 'Internship', department_id: 1, semester_id: 8 },
  { subject_code: 'CS803', subject_name: 'Advanced Topics in CS', department_id: 1, semester_id: 8 },
  { subject_code: 'CS804', subject_name: 'Professional Ethics', department_id: 1, semester_id: 8 },
];

async function createDemoSubjects() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  Creating Demo Subjects');
  console.log('═══════════════════════════════════════════\n');

  let createdCount = 0;
  let skippedCount = 0;

  for (const subject of demoSubjects) {
    try {
      // Check if subject already exists
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject.subject_code)
        .single();

      if (existingSubject) {
        console.log(`⊘ ${subject.subject_code} - ${subject.subject_name} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create subject
      const { data, error } = await supabase
        .from('subjects')
        .insert([subject])
        .select()
        .single();

      if (error) {
        console.error(`✗ Failed to create subject ${subject.subject_code}:`, error.message);
        continue;
      }

      console.log(`✓ ${subject.subject_code} - ${subject.subject_name} (Sem ${subject.semester_id})`);
      createdCount++;
    } catch (error) {
      console.error(`✗ Error creating subject ${subject.subject_code}:`, error.message);
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log(`✓ Subject creation completed!`);
  console.log(`  Created: ${createdCount} | Skipped: ${skippedCount}`);
  console.log('═══════════════════════════════════════════\n');

  process.exit(0);
}

createDemoSubjects().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
