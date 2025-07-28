"use client";

import { useState } from "react";
import { DateField, Edit, EditButton, useDataGrid } from "@refinedev/mui";
import { Autocomplete, Box, TextField, Tab } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import StatusList from "@components/StatusList";
import { useParsed, useSelect } from "@refinedev/core";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useRouter } from "next/router";
import { List } from "@refinedev/mui";

export const AssetsEdit = (props: any) => {
  const { id } = useParsed();
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({ refineCoreProps: { resource: "asset_groups", id } });

  const item = queryResult?.data?.data as any;
  const [tabValue, setTabValue] = useState("1");

  const {
    options: makeOptions,
    queryResult: { isLoading: isLoadingMakes },
  } = useSelect<any>({
    resource: "asset_makes",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
    defaultValue: item?.make_id,
    meta: {
      select: "id, name",
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    options: modelOptions,
    queryResult: { isLoading: isLoadingModels },
  } = useSelect<any>({
    resource: "asset_models",
    hasPagination: false,
    // filters: [{ field: "make_id", operator: "eq", value: item?.make_id }],
    // @ts-ignore
    optionLabel: "name",
    defaultValue: item?.model_id,
    meta: {
      select: "id, name",
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const {
    options: typeOptions,
    queryResult: { isLoading: isLoadingTypes },
  } = useSelect<any>({
    resource: "asset_types",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
    defaultValue: item?.type_id,
    meta: {
      select: "id, name",
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const defaultType = typeOptions.find((x) => x.value === getValues("type_id"));
  const defaultMake = makeOptions.find((x) => x.value === getValues("make_id"));
  const defaultModel = modelOptions.find(
    (x) => x.value === getValues("model_id")
  );

  React.useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, isLoadingMakes, isLoadingModels, isLoadingTypes]);

  return (
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
        <GroupAssets />
      </TabPanel>
      <TabPanel value="2">
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            <TextField
              {...register("id", {
                required: "This field is required",
                valueAsNumber: true,
              })}
              error={!!(errors as any)?.id}
              helperText={(errors as any)?.id?.message}
              margin="normal"
              fullWidth
              type="number"
              label="Id"
              name="id"
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              {...register("name", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
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
              type="text"
              label="Description"
              name="description"
            />

            {typeOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingTypes}
                defaultValue={
                  defaultType
                    ? {
                        label: defaultType?.label,
                        value: defaultType?.value,
                      }
                    : null
                }
                options={typeOptions}
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("type_id", value.value);
                  } else {
                    setValue("type_id", null);
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )}

            {makeOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingMakes}
                defaultValue={
                  defaultMake
                    ? {
                        label: defaultMake?.label,
                        value: defaultMake?.value,
                      }
                    : null
                }
                options={makeOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("make_id", value.value);
                  } else {
                    setValue("make_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Make"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )}

            {modelOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingModels}
                defaultValue={
                  defaultModel
                    ? {
                        label: defaultModel?.label,
                        value: defaultModel?.value,
                      }
                    : null
                }
                options={modelOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("model_id", value.value);
                  } else {
                    setValue("model_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Model"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )}

            <TextField
              {...register("plant")}
              error={!!(errors as any)?.plant}
              helperText={(errors as any)?.plant?.message}
              margin="normal"
              fullWidth
              type="text"
              label="Plant"
              name="plant"
            />

            <TextField
              {...register("consumption")}
              error={!!(errors as any)?.consumption}
              helperText={(errors as any)?.consumption?.message}
              margin="normal"
              fullWidth
              type="text"
              label="Consumption"
              name="consumption"
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
        </Edit>
      </TabPanel>
    </TabContext>
  );
};

const GroupAssets = () => {
  const { id } = useParsed();
  const router = useRouter();

  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    resource: "assets",
    meta: {
      select: "*",
    },
    sorters: { initial: [{ field: "id", order: "asc" }] },
    filters: {
      permanent: [
        {
          field: "asset_group_id",
          operator: "eq",
          value: id,
        },
      ],
    },
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
        field: "id",
        flex: 1,
        headerName: "ID",
        minWidth: 80,
      },
      {
        field: "serial_number",
        flex: 1,
        headerName: "Serial No",
        minWidth: 120,
      },

      {
        field: "supplier_id",
        flex: 1,
        minWidth: 150,
        headerName: "Supplier",
        renderCell: (params: any) => {
          return params.row.suppliers?.name;
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
    []
  );

  const columnKey = "assetGroupColumns2";
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
    <List title={"Assets"} breadcrumb={null}>
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

export default AssetsEdit;
