const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('Fetching users...');
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }
  
  const users = usersData.users;
  console.log(`Found ${users.length} users in auth.users`);

  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id');
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return;
  }
  
  const profileIds = new Set(profiles.map(p => p.id));
  console.log(`Found ${profileIds.size} profiles in public.profiles`);

  let missingCount = 0;
  for (const user of users) {
    if (!profileIds.has(user.id)) {
      missingCount++;
      console.log(`User ${user.id} (${user.email}) is missing a profile. Inserting...`);
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Missing Name',
        contribution_percent: user.user_metadata?.contribution_percent || 10,
        subscription_plan: user.user_metadata?.subscription_plan || 'monthly'
      });
      if (insertError) {
        console.error(`Failed to insert profile for ${user.id}:`, insertError);
      } else {
        console.log(`Profile created for ${user.id}`);
      }
    }
  }

  if (missingCount === 0) {
    console.log('All users have profiles.');
  }

  // Also check if we can insert a score as a test
  console.log('Finished syncing profiles.');
}

main().catch(console.error);
