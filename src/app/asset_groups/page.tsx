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

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { GetServerSideProps } from "next";
import { useExport, useSelect, useCreate } from "@refinedev/core";

export const AssetGroupsList = () => {
  const [open, setOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const [modalTypeStr, setModalTypeStr] = React.useState("");

  const { mutate } = useCreate();
  const handleDialogSave = async (theType: string, theValue: string) => {
    mutate({
      resource: theType,
      values: {
        name: theValue,
      },
    });
  };

  const { triggerExport, isLoading: exportLoading } = useExport<any>({
    pageSize: 1000,
    resource: "asset_groups",
  });
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    sorters: { initial: [{ field: "created_at", order: "asc" }] },
    resource: "asset_groups",
  });

  const {
    options: makeOptions,
    queryResult: { isLoading: isLoadingMakes },
  } = useSelect<any>({
    resource: "asset_makes",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
  });

  const {
    options: modelOptions,
    queryResult: { isLoading: isLoadingModels },
  } = useSelect<any>({
    resource: "asset_models",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
  });

  const {
    options: typeOptions,
    queryResult: { isLoading: isLoadingTypes },
  } = useSelect<any>({
    resource: "asset_types",
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
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 200,
      },
      {
        field: "type_id",
        flex: 1,
        headerName: "Type",
        type: "singleSelect",
        minWidth: 150,
        valueOptions: typeOptions,
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ row }: any) {
          if (isLoadingTypes) {
            return "Loading...";
          }
          const category = typeOptions.find(
            (item: any) => item?.value?.toString() === row?.type_id.toString()
          );
          return category?.label;
        },
      },
      {
        field: "make_id",
        flex: 1,
        headerName: "Make",
        minWidth: 150,
        type: "singleSelect",
        valueOptions: makeOptions,
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ row }: any) {
          if (isLoadingMakes) {
            return "Loading...";
          }
          const category = makeOptions.find(
            (item: any) => item?.value?.toString() === row?.make_id.toString()
          );
          return category?.label;
        },
      },
      {
        field: "model_id",
        flex: 1,
        headerName: "Model",
        minWidth: 150,
        type: "singleSelect",
        valueOptions: modelOptions,
        valueFormatter: (params: any) => {
          return params?.value;
        },
        renderCell: function render({ row }: any) {
          if (isLoadingModels) {
            return "Loading...";
          }
          const category = modelOptions.find(
            (item: any) => item?.value?.toString() === row?.model_id.toString()
          );
          return category?.label;
        },
      },
      {
        field: "plant",
        flex: 1,
        headerName: "Plant",
        minWidth: 100,
      },
      {
        field: "consumption",
        flex: 1,
        headerName: "Consumption",
        minWidth: 120,
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
          return params?.value;
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
    [
      makeOptions,
      modelOptions,
      typeOptions,
      isLoadingMakes,
      isLoadingModels,
      isLoadingTypes,
    ]
  );

  const columnKey = "assetGroupsColumns";
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
          <Button
            color="secondary"
            onClick={(e) => {
              setModalType("asset_type");
              setModalTypeStr("Type");
              setOpen(true);
            }}
          >
            Add Type
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              setModalType("asset_makes");
              setModalTypeStr("Make");
              setOpen(true);
            }}
          >
            Add Make
          </Button>
          <Button
            color="secondary"
            onClick={(e) => {
              setModalType("asset_models");
              setModalTypeStr("Model");
              setOpen(true);
            }}
          >
            Add Model
          </Button>
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
      <FormDialog
        open={open}
        setOpen={setOpen}
        type={modalType}
        type_label={modalTypeStr}
        handleSave={handleDialogSave}
      />
    </List>
  );
};

function FormDialog({ type, type_label, open, setOpen, handleSave }: any) {
  const [field, setField] = React.useState("");

  const save = () => {
    handleSave(type, field);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new {type_label}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setField(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              save();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
        destination: `${redirectTo}?to=${encodeURIComponent("/asset_groups")}`,
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

export default AssetGroupsList;
