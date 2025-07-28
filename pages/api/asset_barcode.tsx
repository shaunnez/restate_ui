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
  console.log("in the api");
  try {
    const payload = {
      id: req.body.id,
      barcode: req.body.barcode,
      updated_at: moment().toISOString(),
    };

    if (!payload.id || !payload.barcode) {
      throw Error("Requires id and barcode");
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: true,
      },
    });
    const { data, error } = await supabaseClient
      .from("assets")
      .update(payload)
      .eq("id", payload.id)
      .select();

    if (error?.message) {
      console.log("error", error);
      throw Error();
    }
    // if status === 'UNKNOWN'
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
