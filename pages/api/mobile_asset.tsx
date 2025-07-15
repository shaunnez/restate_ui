import { NextApiRequest, NextApiResponse } from "next";
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
  try {
    const payload = { ...req.body, updated_at: moment().toISOString() };
    const metadata = { ...req.body.metadata };
    delete payload.metadata;
    delete payload.confirmed;
    delete payload.isValid;
    delete payload.suppliers;
    delete payload.sites;

    if (!payload.serial_number || !payload.barcode) {
      throw Error("Requires serial_number and barcode");
    }
    console.log("saving asset", payload, metadata);

    const { data, error } = await supabase
      .from("assets")
      .upsert(payload)
      .select();
    console.log("saving asset results", data, error);

    const payload2 = {
      asset_id: payload.id,
      site_id: payload.site_id,
      purchase_order_number: payload.purchase_order_number || "",
      email: metadata.email,
      created_on: moment().toISOString(),
    };

    console.log("inserting site asset", payload2);
    const { data: data2, error: error2 } = await supabase
      .from("site_assets")
      .insert(payload2)
      .select();
    console.log("insert site_assets results", data2, error2);

    if (metadata.reason) {
      const payload3 = {
        asset_id: payload?.id,
        serviced_date: moment().toISOString(),
        notes:
          metadata.type === "tagging"
            ? `Tagging: ${metadata.reason}`
            : `Service: ${metadata.reason}`,
        // @ts-ignore
        email: metadata.email,
        material_cost: metadata.materialCosts
          ? Number(metadata.materialCosts)
          : 0,
        third_party_cost: metadata.costsIncurred
          ? Number(metadata.costsIncurred)
          : 0,
        created_at: moment().toISOString(),
        updated_at: moment().toISOString(),
      };

      const { data: data3, error: error3 } = await supabase
        .from("service_history_records")
        .insert(payload3)
        .select();

      console.log("insert service_history_records", data3, error3);
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
