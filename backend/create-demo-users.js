import supabase from './src/config/supabase.js';

const demoUsers = [
  {
    email: 'admin@srit.com',
    password: 'srit1234',
    role_id: 6,
    full_name: 'Admin User'
  },
  {
    email: 'faculty1@srit.com',
    password: 'srit1234',
    role_id: 2,
    full_name: 'Dr. Rajesh Kumar'
  },
  {
    email: '234g1a33i0@srit.ac.in',
    password: 'srit1234',
    role_id: 1,
    full_name: 'Rahul Kumar'
  }
];

async function createDemoUsers() {
  console.log('Creating demo users...\n');

  for (const user of demoUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.email)
        .single();

      if (existingUser) {
        console.log(`✓ User ${user.email} already exists`);
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`✗ Failed to create auth user ${user.email}:`, authError.message);
        continue;
      }

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          role_id: user.role_id,
          full_name: user.full_name
        });

      if (userError) {
        console.error(`✗ Failed to create user record ${user.email}:`, userError.message);
        // Cleanup: delete auth user if user record creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        continue;
      }

      console.log(`✓ Created ${['Student', 'Faculty', 'Admin'][user.role_id === 1 ? 0 : user.role_id === 2 ? 1 : 2]} user: ${user.email}`);

      // Create role-specific records
      if (user.role_id === 1) {
        // Create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            roll_no: '234G1A33I0',
            department_id: 1,
            section: 'A',
            admission_year: 2023,
            semester: 1
          });
        if (studentError) {
          console.error(`  ⚠ Warning: Failed to create student record:`, studentError.message);
        } else {
          console.log(`  └─ Student record created`);
        }
      } else if (user.role_id === 2) {
        // Create faculty record
        const { error: facultyError } = await supabase
          .from('faculty')
          .insert({
            user_id: authData.user.id,
            department_id: 1,
            employee_id: 'FAC001'
          });
        if (facultyError) {
          console.error(`  ⚠ Warning: Failed to create faculty record:`, facultyError.message);
        } else {
          console.log(`  └─ Faculty record created`);
        }
      }
    } catch (error) {
      console.error(`✗ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('\n✓ Demo user creation completed!');
  process.exit(0);
}

createDemoUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
