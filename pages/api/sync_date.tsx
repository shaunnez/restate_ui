import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import moment from "moment";

const SUPABASE_URL = "https://lxsdaxzcxazbvbxcxbxw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c2RheHpjeGF6YnZieGN4Ynh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM1MDE2MDksImV4cCI6MTk5OTA3NzYwOX0.zeWYUibz8eC47QfMGIsYJv1o-E8bKteUmdT_au8Pnlk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data: syncDates } = await supabase.from("sync_date").select();

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
