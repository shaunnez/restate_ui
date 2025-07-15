import React, { useState } from "react";
import { DateField, Edit, EditButton, useDataGrid } from "@refinedev/mui";
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

export const SuppliersEdit = (props: any) => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
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
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <TabContext value={tabValue}>
        <TabList
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <Tab label="Assets" value="1" />
          <Tab label="Edit" value="2" />
        </TabList>
        <TabPanel value="1">
          <SupplierAssets />
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
                valueAsNumber: true,
              })}
              error={!!(errors as any)?.id}
              helperText={(errors as any)?.id?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="number"
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
              {...register("branch")}
              error={!!(errors as any)?.branch}
              helperText={(errors as any)?.branch?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Branch"
              name="branch"
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

const SupplierAssets = () => {
  const router = useRouter();
  const { id } = useParsed();
  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: false,
    liveMode: "auto",
    resource: "assets",
    filters: {
      permanent: [
        {
          field: "supplier_id",
          operator: "eq",
          value: id,
        },
      ],
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
                  router.push("/assets/edit/" + row.id);
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
        field: "old_id",
        flex: 1,
        headerName: "PNumber",
        minWidth: 80,
        renderCell: (params: any) => {
          return params.row.old_id;
        },
      },

      {
        field: "serial_number",
        flex: 1,
        headerName: "Serial No",
        minWidth: 120,
        renderCell: (params: any) => {
          return params.row.serial_number;
        },
      },
      {
        field: "barcode",
        flex: 1,
        headerName: "Barcode",
        minWidth: 120,
        renderCell: (params: any) => {
          return params.row.barcode;
        },
      },
      {
        field: "category",
        flex: 1,
        minWidth: 200,
        headerName: "Category",
        renderCell: (params: any) => {
          return params.row.category;
        },
      },
      {
        field: "make",
        flex: 1,
        minWidth: 200,
        headerName: "Make",
        renderCell: (params: any) => {
          return params.row.make;
        },
      },
      {
        field: "model",
        flex: 1,
        minWidth: 200,
        headerName: "Model",
        renderCell: (params: any) => {
          return params.row.model;
        },
      },
      {
        field: "type",
        flex: 1,
        minWidth: 200,
        headerName: "Type",
        renderCell: (params: any) => {
          return params.row.type;
        },
      },
      {
        field: "classification",
        flex: 1,
        minWidth: 200,
        headerName: "Classification",
        renderCell: (params: any) => {
          return params.row.classification;
        },
      },
      {
        field: "status",
        flex: 1,
        headerName: "Status",
        minWidth: 120,
        filterable: false,
        renderCell: function render(params: any) {
          return [
            "Unknown",
            "In service",
            "Out of service",
            "Maintenance",
            "Obsolete",
          ][params?.row?.assets?.status];
        },
      },
      {
        field: "purchased_price",
        flex: 1,
        headerName: "Purchased Price",
        minWidth: 150,
        type: "number",
        renderCell: (params: any) => {
          return params.row.purchased_price
            ? `$${params.row.purchased_price?.toLocaleString()}`
            : "";
        },
      },
      {
        field: "purchased_date",
        flex: 1,
        headerName: "Purchased Date",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
      {
        field: "tagging_date",
        flex: 1,
        headerName: "Tagging Date",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
      {
        field: "calibration_date",
        flex: 1,
        headerName: "Calibration Date",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
      {
        field: "status",
        flex: 1,
        headerName: "Status",
        minWidth: 100,
        type: "singleSelect",
        valueOptions: [
          { label: "Unknown", value: 0 },
          { label: "In service", value: 1 },
          { label: "Out of service", value: 2 },
          { label: "Needs Maintenance", value: 3 },
          { label: "Obsolete", value: 4 },
        ],
        valueFormatter: (params: any) => {
          return params.value;
        },
        renderCell: function render({ value }: any) {
          return [
            "Unknown",
            "In service",
            "Out of service",
            "Needs Maintenance",
            "Obsolete",
          ][value];
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

  const columnKey = "supplerColumnsInner";
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

export default SuppliersEdit;
