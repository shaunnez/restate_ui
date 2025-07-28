"use client";

import React from "react";
import {
  useDataGrid,
  EditButton,
  List,
  DateField,
  ExportButton,
} from "@refinedev/mui";
import { DataGrid } from "@mui/x-data-grid";
import { useExport, useSelect } from "@refinedev/core";

export const AssetList = () => {
  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
  });

  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    resource: "assets",
    meta: {
      select: "*, suppliers(name), sites(name)",
    },
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const {
    options: supplierOptions,
    queryResult: { isLoading: supplierLoading },
  } = useSelect<any>({
    resource: "suppliers",
    hasPagination: false,
    meta: {
      select: "id, name",
    },
    // @ts-ignore
    optionLabel: "name",
  });

  const {
    options: siteOptions,
    queryResult: { isLoading: sitesLoading },
  } = useSelect<any>({
    resource: "sites",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
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
        field: "old_id",
        flex: 1,
        headerName: "PNumber",
        minWidth: 80,
      },
      {
        field: "serial_number",
        flex: 1,
        headerName: "Serial No",
        minWidth: 120,
      },
      {
        field: "barcode",
        flex: 1,
        headerName: "Barcode",
        minWidth: 120,
      },
      {
        field: "category",
        flex: 1,
        headerName: "Category",
        minWidth: 200,
      },
      {
        field: "make",
        flex: 1,
        headerName: "Make",
        minWidth: 200,
      },
      {
        field: "model",
        flex: 1,
        headerName: "Model",
        minWidth: 200,
      },

      {
        field: "type",
        flex: 1,
        headerName: "Type",
        minWidth: 200,
      },
      {
        field: "classification",
        flex: 1,
        headerName: "Classification",
        minWidth: 200,
      },
      {
        field: "supplier_id",
        flex: 1,
        minWidth: 150,
        headerName: "Supplier",
        // sortable: false,
        type: "singleSelect",
        valueOptions: supplierOptions,
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ row }: any) {
          if (supplierLoading) {
            return "Loading...";
          }
          const supplier = supplierOptions.find(
            (item) => item.value.toString() === row.supplier_id?.toString()
          );
          return supplier?.label;
        },
      },
      {
        field: "site_id",
        flex: 1,
        minWidth: 150,
        headerName: "Site",
        // sortable: false,
        type: "singleSelect",
        valueOptions: siteOptions,
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ row }: any) {
          if (sitesLoading) {
            return "Loading...";
          }
          const site = siteOptions.find(
            (item) => item.value.toString() === row.site_id?.toString()
          );
          return site?.label;
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
          return params?.value;
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
            return <DateField value={value} format="DD/MM/YYYY" />;
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
            return <DateField value={value} format="DD/MM/YYYY" />;
          }
          return null;
        },
      },
      {
        field: "future_tagging_date",
        flex: 1,
        headerName: "Future Tagging Date",
        minWidth: 180,

        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY" />;
          }
          return null;
        },
      },
      {
        field: "service_date",
        flex: 1,
        headerName: "Service Date",
        minWidth: 180,

        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY" />;
          }
          return null;
        },
      },
      {
        field: "future_service_date",
        flex: 1,
        headerName: "Future Service Date",
        minWidth: 180,

        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY" />;
          }
          return null;
        },
      },
      {
        field: "plant",
        flex: 1,
        headerName: "Plant",
        minWidth: 120,
      },
      {
        field: "consumption",
        flex: 1,
        headerName: "Consumption",
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
    ],
    [supplierOptions, supplierLoading, sitesLoading, siteOptions]
  );

  const columnKey = "assetColumns";
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

export default AssetList;
