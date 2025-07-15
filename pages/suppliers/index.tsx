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

export const SupplierList = () => {
  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
  });
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    sorters: { initial: [{ field: "name", order: "asc" }] },
    meta: {
      select: "*, assets(count)",
    },
  });

  const columnKey = "supplierColumns";
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
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 200,
      },
      {
        field: "description",
        flex: 1,
        headerName: "Description",
        minWidth: 200,
      },
      {
        field: "branch",
        flex: 1,
        headerName: "Branch",
        minWidth: 250,
      },
      {
        field: "assets[0].count",
        flex: 1,
        headerName: "Assets",
        minWidth: 250,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => {
          return params.row.assets[0].count;
        },
      },
      {
        field: "status",
        flex: 1,
        headerName: "Status",
        minWidth: 250,
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
        destination: `${redirectTo}?to=${encodeURIComponent("/suppliers")}`,
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

export default SupplierList;
