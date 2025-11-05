import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

import { createClient } from "@supabase/supabase-js"; 

    const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: true,
      },
    });

async function testConnection() {
  const { data, error } = await supabaseClient.from('your_table_name').select('*')
  if (error) {
    console.error('Supabase connection failed:', error)
  } else {
    console.log('Supabase connection successful:', data)
  }
}

testConnection()

export async function middleware(request: NextRequest) {
  const result = await updateSession(request);
  return result;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
