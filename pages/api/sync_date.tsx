import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../../src/utils/supabase/constants";

export const dynamic = "force-static";

export const runtime = "nodejs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
    },
  });
  const { data: syncDates } = await supabaseClient.from("sync_date").select();

  let output = moment().format("DD-MM-YYYY");
  if (syncDates && syncDates.length > 0) {
    output = syncDates[0].sync_date;
  }
  res.status(200).json({ sync_date: output });
}

export const config = {
  api: {
    responseLimit: false,
  },
};
