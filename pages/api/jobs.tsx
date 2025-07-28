import { NextApiRequest, NextApiResponse } from "next";
import moment, { MomentInput } from "moment";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../../src/utils/supabase/constants";

export const dynamic = "force-static";

export const runtime = "nodejs";

interface ContactDto {
  uuid: string;
  edit_date: string;
  name: string;
  website: string;
  abn_number: string;
  address: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postcode: string;
  address_country: string;
  billing_address: string;
  active: number;
  is_individual: number;
  badges: string;
  fax_number: string;
  tax_rate_uuid: string;
  customfield_payment_terms: string;
  payment_terms: string;
  parent_company_uuid: string;
}

interface CompanyContactDto {
  edit_date: string;
  active: number;
  is_primary_contact: string;
  company_uuid: string;
  first: string;
  last: string;
  email: string;
  phone: string;
  mobile: string;
  type: string;
  uuid: string;
}

interface JobDto {
  uuid: string;
  active: number;
  date: string;
  job_address: string;
  billing_address: string;
  status: string;
  quote_date: string;
  work_order_date: string;
  work_done_description: string;
  lng: number;
  lat: number;
  generated_job_id: string;
  completion_date: string;
  completion_actioned_by_uuid: string;
  unsuccessful_date: string;
  payment_date: string;
  payment_method: string;
  payment_amount: number;
  payment_actioned_by_uuid: string;
  edit_date: string;
  geo_is_valid: number;
  payment_note: string;
  ready_to_invoice: string;
  ready_to_invoice_stamp: string;
  company_uuid: string;
  geo_country: string;
  geo_postcode: string;
  geo_state: string;
  geo_city: string;
  geo_street: string;
  geo_number: string;
  payment_processed: number;
  payment_processed_stamp: string;
  payment_received: number;
  payment_received_stamp: string;
  total_invoice_amount: string;
  job_is_scheduled_until_stamp: string;
  category_uuid: string;
  queue_uuid: string;
  queue_expiry_date: string;
  badges: string;
  invoice_sent: boolean;
  purchase_order_number: string;
  invoice_sent_stamp: string;
  active_network_request_uuid: string;
  queue_assigned_staff_uuid: string;
  quote_sent_stamp: string;
  quote_sent: boolean;
  related_knowledge_articles: boolean;
  job_description: string;
  created_by_staff_uuid: string;
}

const importCategories = async (syncDate: MomentInput) => {
  try {
    const categoryResults = await axios.get<any[]>(
      "https://api.servicem8.com/api_1.0/category.json",
      {
        auth: {
          username: "nimblecatnz@gmail.com",
          password: "N1mbleC4t",
        },
      }
    );

    if (categoryResults && categoryResults.data.length > 0) {
      const insertData = (
        syncDate
          ? categoryResults.data.filter((x) => {
              if (moment(x.edit_date).isAfter(syncDate)) {
                return true;
              } else {
                return false;
              }
            })
          : categoryResults.data
      ).map((x) => ({
        id: x.uuid,
        name: x.name,
        color: x.colour,

        updated_at: moment().toISOString(),
      }));

      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
        db: {
          schema: "public",
        },
        auth: {
          persistSession: true,
        },
      });

      const { data, error } = await supabaseClient
        .from("categories")
        .upsert(insertData);
      console.log("categories", insertData.length, error);
    }
    return true;
  } catch (ex) {
    return false;
  }
};

const importCustomers = async (syncDate: MomentInput) => {
  try {
    const companyResults = await axios.get<ContactDto[]>(
      "https://api.servicem8.com/api_1.0/company.json",
      {
        auth: {
          username: "nimblecatnz@gmail.com",
          password: "N1mbleC4t",
        },
      }
    );

    const companyContactResults = await axios.get<CompanyContactDto[]>(
      "https://api.servicem8.com/api_1.0/companycontact.json?%24filter=active%20eq%20'1'",
      {
        auth: {
          username: "nimblecatnz@gmail.com",
          password: "N1mbleC4t",
        },
      }
    );

    let customers = [];
    if (
      companyResults &&
      companyResults.data.length > 0 &&
      companyContactResults &&
      companyContactResults.data.length > 0
    ) {
      const compResults = syncDate
        ? companyResults.data.filter((x) => {
            if (moment(x.edit_date).isAfter(syncDate)) {
              return true;
            } else {
              return false;
            }
          })
        : companyResults.data;
      const contResults = syncDate
        ? companyContactResults.data.filter((x) => {
            if (moment(x.edit_date).isAfter(syncDate)) {
              return true;
            } else {
              return false;
            }
          })
        : companyContactResults.data;
      customers = compResults.map((x) => {
        let contacts = contResults.filter((y) => y.company_uuid === x.uuid);
        let contact = contacts.length > 0 ? contacts[0] : null;
        if (contacts.length > 1 && contacts.find((y) => y.type === "BILLING")) {
          // @ts-ignore
          contact = contacts.find((y) => y.type === "BILLING");
        }
        return {
          id: x.uuid,
          name: x.name || "",
          address: x.address.replaceAll("\n", ",") || "",
          description: "",
          notes: "",
          email: contact?.email || "",
          phone: contact?.phone || "",
          mobile: contact?.mobile || "",
          first_name: contact?.first || "",
          last_name: contact?.last || "",
          status: 1,
          updated_at: moment().toISOString(),
        };
      });

      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
        db: {
          schema: "public",
        },
        auth: {
          persistSession: true,
        },
      });
      const { data, error } = await supabaseClient
        .from("customers")
        .upsert(customers);
      console.log("customers", customers.length, error);
    }
    return true;
  } catch (ex) {
    return false;
  }
};

const importAddressesAndJobs = async (syncDate: MomentInput) => {
  try {
    const statusMap = [
      "Unknown",
      "Work Order",
      "Quote",
      "Completed",
      "Unsuccessful",
    ];

    const jobResults = await axios.get<JobDto[]>(
      "https://api.servicem8.com/api_1.0/job.json",
      {
        auth: {
          username: "nimblecatnz@gmail.com",
          password: "N1mbleC4t",
        },
      }
    );

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      db: {
        schema: "public",
      },
      auth: {
        persistSession: true,
      },
    });
    const { data: existingAddressData } = await supabaseClient
      .from("addresses")
      .select();

    let sites = [] as any[];
    let addresses = [] as any[];
    if (jobResults && jobResults.data.length > 0) {
      const jResults = syncDate
        ? jobResults.data.filter((x) => {
            if (moment(x.edit_date).isAfter(syncDate)) {
              return true;
            } else {
              return false;
            }
          })
        : jobResults.data;

      sites = jResults.map((x, i) => {
        const jobStatus =
          statusMap.indexOf(x.status) > -1 ? statusMap.indexOf(x.status) : 0;
        const address = {
          street: x.geo_street,
          state: x.geo_state,
          city: x.geo_city,
          country: x.geo_country,
          postcode: x.geo_postcode,
          number: x.geo_number,
          lat: x.lat,
          lng: x.lng,
          label: "",
          status: 1,
          description: `${x.geo_number ? x.geo_number + " " : ""}${
            x.geo_street ? x.geo_street + ", " : ""
          }${x.geo_city ? x.geo_city + ", " : ""}${
            x.geo_state ? x.geo_state + ", " : ""
          }${x.geo_postcode ? x.geo_postcode + ", " : ""}${
            x.geo_country ? x.geo_country + "" : ""
          }`,
        };
        const match = existingAddressData?.find(
          (y) => y.description === address.description
        );
        const match2 = addresses.find(
          (y) => y.description === address.description
        );
        if (!match && !match2 && address.street) {
          addresses.push(address);
        }

        const site = {
          id: x.uuid,
          name: `Job ${x.generated_job_id}`,
          description: x.job_description,
          job_id: x.generated_job_id,
          status: jobStatus,
          // owner_id: null, // supplier
          customer_id: x.company_uuid ? x.company_uuid : null,
          category_id: x.category_uuid ? x.category_uuid : null,
          address_description: address.description,
          created_at: moment(x.date, "YYYY-MM-DD").isValid()
            ? moment(x.date, "YYYY-MM-DD").toISOString()
            : moment().toISOString(),
          updated_at: moment().toISOString(),
        };
        return site;
      });

      const { error } = await supabaseClient
        .from("addresses")
        .upsert(addresses);
      console.log("addresses", addresses.length, error);

      const { data: existingAddressData2 } = await supabaseClient
        .from("addresses")
        .select();

      sites.forEach((x) => {
        const match = existingAddressData2?.find(
          (y) => y.description === x.address_description
        );
        if (match && match.id) {
          x.address_id = match.id;
        } else {
          x.address_id = null;
        }
        delete x.address_description;
      });

      const { data: siteData, error: siteError } = await supabaseClient
        .from("sites")
        .upsert(sites.filter((x) => x.id))
        .select();
      console.log("sites", sites.length, siteError);
    }
    return true;
  } catch (ex) {
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let syncDate = null;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
    },
  });
  if (req.query.syncType === "current") {
    const { data: syncDates } = await supabaseClient.from("sync_date").select();
    if (syncDates && syncDates.length > 0) {
      syncDate = moment(syncDates[0].sync_date, "DD-MM-YYYY");
    }
  }
  await importCategories(syncDate);
  await importCustomers(syncDate);
  await importAddressesAndJobs(syncDate);

  const hmm = await supabaseClient
    .from("sync_date")
    .upsert({ id: 1, sync_date: moment().format("DD-MM-YYYY") });
  res.status(200).json({ result: true });
}

export const config = {
  api: {
    responseLimit: false,
  },
};
