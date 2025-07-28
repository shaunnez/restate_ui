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
import { useExport, useNotification, useSelect } from "@refinedev/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

export default function SiteList() {
  const [open, setOpen] = React.useState(false);
  const [syncType, setSyncType] = React.useState("current");
  const [syncing, setSyncing] = React.useState(false);
  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    meta: {
      select:
        "*, categories(name), customers(name), addresses(description), assets(id)",
    },
    sorters: { initial: [{ field: "job_id", order: "desc" }] },
  });

  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
  });

  const notification = useNotification();

  const [syncDate, setSyncDate] = React.useState("");

  const {
    options: categoryOptions,
    queryResult: { isLoading: categoryLoading },
  } = useSelect<any>({
    resource: "categories",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
  });

  const {
    options: customerOptions,
    queryResult: { isLoading: customerLoading },
  } = useSelect<any>({
    resource: "customers",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
  });

  const {
    options: addressOptions,
    queryResult: { isLoading: addressLoading },
  } = useSelect<any>({
    resource: "addresses",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "description",
    sorters: [
      {
        field: "description",
        order: "asc",
      },
    ],
  });

  const syncData = async () => {
    setSyncing(true);
    await fetch("/api/jobs?syncType=" + syncType);

    fetch("/api/sync_date")
      .then((results) => results.json())
      .then((results) => {
        setSyncDate(results.sync_date);
        setSyncing(false);
        // @ts-ignore
        notification.open({ message: "Syncing complete", type: "success" });
        window.location.reload();
      });

    // @ts-ignore
  };

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
        field: "job_id",
        headerName: "Job Id",
        minWidth: 100,
      },
      {
        field: "category_id",
        flex: 1,
        minWidth: 150,
        headerName: "Category",
        type: "singleSelect",
        valueOptions: categoryOptions,
        valueFormatter: (params: any) => {
          return params?.value || "";
        },
        renderCell: function render({ row }: any) {
          if (categoryLoading) {
            return "Loading...";
          }
          const category = categoryOptions.find(
            (item) => item.value.toString() === row.category_id?.toString()
          );
          return category?.label;
        },
      },
      {
        field: "customer_id",
        flex: 1,
        minWidth: 250,
        headerName: "Customer",
        type: "singleSelect",
        valueOptions: customerOptions,
        valueFormatter: (params: any) => {
          return params?.value || "";
        },
        renderCell: function render({ row }: any) {
          if (customerLoading) {
            return "Loading...";
          }
          const customer = customerOptions.find(
            (item) => item.value.toString() === row.customer_id?.toString()
          );
          return customer?.label;
        },
      },
      {
        field: "address_id",
        flex: 1,
        minWidth: 400,
        editable: true,
        headerName: "Address",
        type: "singleSelect",
        valueOptions: addressOptions,
        valueFormatter: (params: any) => {
          return params?.value || "";
        },
        renderCell: function render({ row }: any) {
          if (addressLoading) {
            return "Loading...";
          }
          const address = addressOptions.find(
            (item) => item.value.toString() === row.address_id?.toString()
          );
          return address?.label;
        },
      },
      {
        field: "assets.id",
        flex: 1,
        minWidth: 150,
        headerName: "Assets on Site",
        sortable: false,
        filterable: false,
        renderCell: (params: any) => {
          return params.row.assets?.length;
        },
      },
      {
        field: "purchase_order_numbers",
        flex: 1,
        minWidth: 250,
        headerName: "References",
      },
      {
        field: "status",
        headerName: "Status",
        type: "singleSelect",
        valueOptions: [
          { label: "Unknown", value: 0 },
          { label: "Work Order", value: 1 },
          { label: "Quote", value: 2 },
          { label: "Completed", value: 3 },
          { label: "Unsuccessful", value: 4 },
        ],
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ value }: any) {
          return [
            "Unknown",
            "Work Order",
            "Quote",
            "Completed",
            "Unsuccessful",
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
    [
      customerLoading,
      customerOptions,
      addressLoading,
      addressOptions,
      categoryLoading,
      categoryOptions,
    ]
  );

  React.useEffect(() => {
    fetch("/api/sync_date")
      .then((results) => results.json())
      .then((results) => {
        setSyncDate(results.sync_date);
      });
  }, []);

  const columnKey = "sitesColumns1";
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
          <LoadingButton
            loading={syncing}
            variant="contained"
            color="secondary"
            disabled={syncing}
            onClick={(e) => {
              setSyncType("current");
              setOpen(true);
            }}
          >
            Sync Data
          </LoadingButton>
          <LoadingButton
            loading={syncing}
            variant="contained"
            color="warning"
            disabled={syncing}
            onClick={(e) => {
              if (
                window.prompt("Please enter password") ===
                "superstrongpassword123"
              ) {
                setSyncType("all");
                setOpen(true);
              } else {
                // @ts-ignore
                notification.open({
                  message: "Invalid password",
                  type: "error",
                });
              }
            }}
          >
            Sync Data (All Time)
          </LoadingButton>
        </>
      )}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel,
            },
          }}
          onColumnVisibilityModelChange={(newModel) => {
            window?.sessionStorage.setItem(columnKey, JSON.stringify(newModel));
          }}
        />
        <AlertDialog
          open={open}
          setOpen={setOpen}
          date={syncDate}
          allTime={syncType === "all"}
          handleClose={() => {
            syncData();
          }}
        />
      </div>
    </List>
  );
}

function AlertDialog({ open, setOpen, handleClose, allTime, date }: any) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          // setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {allTime ? "Sync All Data from Servicem8" : "Sync Data from " + date}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {allTime
              ? `This will override any existing data you have updated in sites,
            customers, and addresses. Are you sure you want to do this?`
              : `This will add any new sites, customers and addresses from this date: ${date}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              handleClose();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
