import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  DateField,
  ExportButton,
} from "@refinedev/mui";
import { DataGrid } from "@mui/x-data-grid";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useExport } from "@refinedev/core";

export const AddressList = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    sorters: { initial: [{ field: "created_at", order: "asc" }] },
  });

  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
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
              <EditButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },

      {
        field: "description",
        flex: 1,
        headerName: "Description",
        minWidth: 200,
      },
      {
        field: "number",
        flex: 1,
        headerName: "Street No",
        minWidth: 100,
      },
      {
        field: "street",
        flex: 1,
        headerName: "Street",
        minWidth: 200,
      },
      {
        field: "city",
        flex: 1,
        headerName: "City",
        minWidth: 150,
      },
      {
        field: "state",
        flex: 1,
        headerName: "State",
        minWidth: 150,
      },
      {
        field: "postcode",
        flex: 1,
        headerName: "Postal code",
        minWidth: 100,
      },
      {
        field: "country",
        flex: 1,
        headerName: "Country",
        minWidth: 150,
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
      {
        field: "status",
        flex: 1,
        headerName: "Status",
        minWidth: 100,
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
    ],
    []
  );

  const columnKey = "addressesColumns";
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
    <List
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}{" "}
          <ExportButton onClick={triggerExport} loading={exportLoading} />
        </>
      )}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        initialState={{
          columns: {
            columnVisibilityModel,
          },
        }}
        onColumnVisibilityModelChange={(newModel) => {
          window?.sessionStorage.setItem(columnKey, JSON.stringify(newModel));
        }}
      />
    </List>
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
        destination: `${redirectTo}?to=${encodeURIComponent("/addresses")}`,
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

export default AddressList;
