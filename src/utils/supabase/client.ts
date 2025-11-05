import { createBrowserClient } from "@supabase/ssr"; 
import { supabase } from '..../node_modules/@supabase/supabase-js/src/SupabaseClient.ts'

async function testConnection() {
  const { data, error } = await supabase.from('your_table_name').select('*')
  if (error) {
    console.error('Supabase connection failed:', error)
  } else {
    console.log('Supabase connection successful:', data)
  }
}

testConnection()



export const supabaseBrowserClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: "public",
    },
    auth: { persistSession: true },
  }
);
