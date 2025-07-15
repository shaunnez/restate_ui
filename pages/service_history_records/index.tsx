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

export const ServiceHistoryRecordsList = () => {
  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
    resource: "service_history_records",
  });

  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    resource: "service_history_records",
    meta: {
      select:
        "*, assets(id, old_id, serial_number, barcode, category, make, model, type, classification, type, status)",
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
              <EditButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
      {
        field: "assets.old_id",
        flex: 1,
        headerName: "Asset PNumber",
        minWidth: 150,
        renderCell: (params: any) => {
          return params.row.assets?.old_id;
        },
      },
      {
        field: "assets.serial_number",
        flex: 1,
        headerName: "Asset Serial No",
        minWidth: 180,
        renderCell: (params: any) => {
          return params.row.assets?.serial_number;
        },
      },
      {
        field: "assets.barcode",
        flex: 1,
        headerName: "Asset Barcode",
        minWidth: 160,
        renderCell: (params: any) => {
          return params.row.assets?.barcode;
        },
      },
      {
        field: "assets.category",
        flex: 1,
        minWidth: 200,
        headerName: "Asset Category",
        renderCell: (params: any) => {
          return params.row.assets?.category;
        },
      },
      {
        field: "assets.make",
        flex: 1,
        minWidth: 200,
        headerName: "Asset Make",
        renderCell: (params: any) => {
          return params.row.assets?.make;
        },
      },
      {
        field: "assets.model",
        flex: 1,
        minWidth: 200,
        headerName: "Asset Model",
        renderCell: (params: any) => {
          return params.row.assets?.model;
        },
      },
      {
        field: "assets.type",
        flex: 1,
        minWidth: 200,
        headerName: "Asset Type",
        renderCell: (params: any) => {
          return params.row.assets?.type;
        },
      },
      {
        field: "assets.classification",
        flex: 1,
        minWidth: 200,
        headerName: "Asset Classification",
        renderCell: (params: any) => {
          return params.row.assets?.classification;
        },
      },
      {
        field: "assets.status",
        flex: 1,
        headerName: "Asset Status",
        minWidth: 120,
        filterable: false,
        renderCell: function render(params: any) {
          return [
            "Unknown",
            "In service",
            "Out of service",
            "Needs Maintenance",
            "Obsolete",
          ][params?.row?.assets?.status];
        },
      },
      {
        field: "serviced_date",
        flex: 1,
        headerName: "Serviced Date",
        minWidth: 150,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          } else {
            return null;
          }
        },
      },
      {
        field: "material_cost",
        flex: 1,
        headerName: "Material Cost",
        minWidth: 120,
        type: "number",
        renderCell: (params: any) => {
          return params.row.material_cost
            ? `$${params.row.material_cost?.toLocaleString()}`
            : "";
        },
      },
      {
        field: "third_party_cost",
        flex: 1,
        headerName: "Third Party Cost",
        minWidth: 120,
        type: "number",
        renderCell: (params: any) => {
          return params.row.third_party_cost
            ? `$${params.row.third_party_cost?.toLocaleString()}`
            : "";
        },
      },
      {
        field: "email",
        flex: 1,
        headerName: "Usser",
        minWidth: 180,
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

  const columnKey = "serviceHistoryRecordsInner";
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
        destination: `${redirectTo}?to=${encodeURIComponent(
          "/service_history_records"
        )}`,
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

export default ServiceHistoryRecordsList;
