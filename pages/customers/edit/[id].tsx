import React, { useState } from "react";
import {
  DateField,
  Edit,
  EditButton,
  useAutocomplete,
  useDataGrid,
  List,
} from "@refinedev/mui";
import { Autocomplete, Box, Tab, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import moment from "moment";
import StatusList from "components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { useParsed } from "@refinedev/core";
import { useRouter } from "next/router";

export const CustomerEdit = (props: any) => {
  const {
    saveButtonProps,
    refineCore: { formLoading, queryResult },
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const item = queryResult?.data?.data as any;

  const [tabValue, setTabValue] = useState("1");
  React.useEffect(() => {
    setValue("updated_at", moment());
  }, [item]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <TabContext value={tabValue}>
        <TabList
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <Tab label="Sites" value="1" />
          <Tab label="Edit" value="2" />
        </TabList>
        <TabPanel value="1">
          <CustomerSites />
        </TabPanel>
        <TabPanel value="2">
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            {/* <TextField
              {...register("id", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.id}
              helperText={(errors as any)?.id?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Id"
              name="id"
              disabled
            /> */}

            <TextField
              {...register("name", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Name"
              name="name"
            />
            <TextField
              {...register("first_name")}
              error={!!(errors as any)?.first_name}
              helperText={(errors as any)?.first_name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Contact First Name"
              name="first_name"
            />
            <TextField
              {...register("last_name")}
              error={!!(errors as any)?.last_name}
              helperText={(errors as any)?.last_name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Contact Last Name"
              name="last_name"
            />
            <TextField
              {...register("email")}
              error={!!(errors as any)?.email}
              helperText={(errors as any)?.email?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Contact Email"
              name="email"
            />

            <TextField
              {...register("phone")}
              error={!!(errors as any)?.phone}
              helperText={(errors as any)?.phone?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Contact Phone"
              name="phone"
            />

            <TextField
              {...register("mobile")}
              error={!!(errors as any)?.mobile}
              helperText={(errors as any)?.mobile?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Contact Mobile"
              name="mobile"
            />

            <TextField
              {...register("description")}
              error={!!(errors as any)?.description}
              helperText={(errors as any)?.description?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Description"
              name="description"
            />

            <TextField
              {...register("notes")}
              error={!!(errors as any)?.notes}
              helperText={(errors as any)?.notes?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Notes"
              name="notes"
            />

            <TextField
              {...register("address")}
              error={!!(errors as any)?.address}
              helperText={(errors as any)?.address?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Address"
              name="address"
            />

            {item && (
              <StatusList
                value={item?.status}
                onChange={(e: any) => {
                  setValue("status", e);
                }}
              />
            )}

            <br />
            <DateTimePicker
              label="Created at"
              value={moment(item?.created_at)}
              format="DD/MM/YYYY HH:mm"
              disabled
            />

            <br />
            <DateTimePicker
              label="Updated at"
              value={moment(item?.updated_at)}
              format="DD/MM/YYYY HH:mm"
              disabled
            />
          </Box>
        </TabPanel>
      </TabContext>
    </Edit>
  );
};

const CustomerSites = () => {
  const { id } = useParsed();
  const router = useRouter();
  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: false,
    liveMode: "auto",
    resource: "sites",
    filters: {
      permanent: [
        {
          field: "customer_id",
          operator: "eq",
          value: id,
        },
      ],
    },
    meta: {
      select:
        "*, categories(name), customers(name), addresses(description), site_assets(id, check_in, check_out)",
    },
    sorters: { initial: [{ field: "created_at", order: "asc" }] },
  });

  const columns = React.useMemo<any>(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }: any) {
          return (
            <>
              <EditButton
                hideText
                recordItemId={row.id}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/sites/edit/" + row.id);
                }}
              />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
      {
        field: "job_id",
        headerName: "Job Id",
        minWidth: 100,
      },
      {
        field: "category_id",
        flex: 1,
        minWidth: 150,
        headerName: "Category",
        renderCell: (params: any) => {
          return params.row.categories?.name;
        },
      },
      {
        field: "customer_id",
        flex: 1,
        minWidth: 250,
        headerName: "Customer",
        renderCell: (params: any) => {
          return params.row.customers?.name;
        },
      },
      {
        field: "addresses.description",
        flex: 1,
        minWidth: 400,
        editable: true,
        headerName: "Address",
        renderCell: (params: any) => {
          return params.row.addresses?.description;
        },
      },
      {
        field: "site_assets.id",
        flex: 1,
        minWidth: 400,
        headerName: "Assets on Site",
        sortable: false,
        filterable: false,
        renderCell: (params: any) => {
          return params.row.site_assets.filter((x: any) => x.check_out === null)
            ?.length;
        },
      },
      {
        field: "status",
        headerName: "Status",
        type: "singleSelect",
        valueOptions: [
          { label: "Unknown", value: 0 },
          { label: "Active", value: 1 },
          { label: "Inactive", value: 2 },
          { label: "Deleted", value: 3 },
        ],
        valueFormatter: (params: any) => {
          return params.value;
        },
        renderCell: function render({ value }: any) {
          return ["Unknown", "Active", "Inactive", "Deleted"][value];
        },
      },
      {
        field: "created_at",
        flex: 1,
        headerName: "Created At",

        minWidth: 180,
        renderCell: function render({ value }: any) {
          return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
        },
      },
      {
        field: "updated_at",
        flex: 1,
        headerName: "Updated At",

        minWidth: 180,
        renderCell: function render({ value }: any) {
          return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
        },
      },
    ],
    []
  );

  const columnKey = "customerColumnsInner";
  let columnVisibilityModel = {};
  // @ts-ignore
  if (
    typeof window !== "undefined" &&
    window?.sessionStorage?.getItem(columnKey)
  ) {
    columnVisibilityModel = JSON.parse(
      // @ts-ignore
      window?.sessionStorage.getItem(columnKey) as string
    );
  }

  return (
    <DataGrid
      {...dataGridProps}
      columns={columns}
      autoHeight
      onColumnVisibilityModelChange={(newModel) => {
        window?.sessionStorage.setItem(columnKey, JSON.stringify(newModel));
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/customers")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};

export default CustomerEdit;
