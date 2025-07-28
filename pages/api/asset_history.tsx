import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../../src/utils/supabase/constants";

export const dynamic = "force-static";

export const runtime = "nodejs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: true,
      },
    });
    const { data, error } = await supabaseClient
      .from("site_assets")
      .insert(req.body)
      .select();
    // console.log("insert site_assets", data, error);
    res.status(200).json({ success: true });
  } catch (ex) {
    res.status(500).json({ success: false });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
