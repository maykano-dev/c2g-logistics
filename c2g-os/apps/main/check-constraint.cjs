const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL="(.*)"/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY="(.*)"/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraint() {
  const { data, error } = await supabase.rpc('execute_sql', { 
    query_text: `
      SELECT pg_get_constraintdef(c.oid) AS constraint_def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'employees' AND c.conname = 'valid_staff_role';
    `
  });
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

checkConstraint();
