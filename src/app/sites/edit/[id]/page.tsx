"use client";

import { useState } from "react";
import { DateField, Edit, EditButton, useDataGrid } from "@refinedev/mui";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Tab,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import StatusList from "@components/StatusList";
import { useCreate, useSelect } from "@refinedev/core";
import { useParsed } from "@refinedev/core";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useRouter } from "next/navigation";
import { List } from "@refinedev/mui";

function FormDialog({ open, setOpen, handleSave }: any) {
  const [field, setField] = React.useState("");
  const save = () => {
    handleSave(field);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new Category</DialogTitle>
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

const SiteEdit = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const item = queryResult?.data?.data;
  const [tabValue, setTabValue] = useState("1");

  const {
    options: customerOptions,
    queryResult: { isLoading: isLoadingCustomers },
  } = useSelect<any>({
    resource: "customers",
    // @ts-ignore
    optionLabel: "name",
    // defaultValue: item?.customer_id,
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
    options: categoryOptions,
    queryResult: { isLoading: isLoadingCategories },
  } = useSelect<any>({
    resource: "categories",
    // @ts-ignore
    optionLabel: "name",
    // defaultValue: item?.category_id,
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
    options: addressOptions,
    queryResult: { isLoading: isLoadingAddresses },
  } = useSelect<any>({
    resource: "addresses",
    // @ts-ignore
    optionLabel: "description",
    // defaultValue: item?.address_id,
    sorters: [
      {
        field: "description",
        order: "asc",
      },
    ],
    meta: {
      select: "id, description",
    },
  });

  const defaultCustomer = customerOptions.find(
    (x) => x.value === getValues("customer_id")
  );

  const defaultCategory = categoryOptions.find(
    (x) => x.value === getValues("category_id")
  );

  const defaultAddress = addressOptions.find(
    (x) => x.value === getValues("address_id")
  );

  const { mutate } = useCreate();

  const handleDialogSave = async (theValue: string) => {
    mutate({
      resource: "categories",
      values: {
        name: theValue,
      },
    });
  };

  React.useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, isLoadingAddresses, isLoadingCategories, isLoadingCustomers]);

  return (
    <TabContext value={tabValue}>
      <TabList
        onChange={(event, newValue) => {
          setTabValue(newValue);
        }}
      >
        <Tab label="Site Assets" value="1" />
        <Tab label="Edit" value="2" />
      </TabList>
      <TabPanel value="1">
        <SiteAssets />
      </TabPanel>
      <TabPanel value="2">
        <Edit
          isLoading={formLoading}
          saveButtonProps={saveButtonProps}
          headerButtons={({ defaultButtons }) => (
            <>
              {defaultButtons}{" "}
              <Button
                color="secondary"
                onClick={(e) => {
                  setOpen(true);
                }}
              >
                Add Category
              </Button>
            </>
          )}
        >
          <FormDialog
            open={open}
            setOpen={setOpen}
            handleSave={handleDialogSave}
          />
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
              {...register("job_id", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.job_id}
              helperText={(errors as any)?.job_id?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Job Id"
              name="job_id"
            />

            <TextField
              {...register("purchase_order_numbers")}
              error={!!(errors as any)?.purchase_order_numbers}
              helperText={(errors as any)?.purchase_order_numbers?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Reference (comma seperated)"
              name="reference"
              placeholder="e.g. P123123,P55555,PXXXXXX"
              onChange={(e) => {
                const val = (e.target.value || "")
                  .toString()
                  .replaceAll(/ /g, "");
                setValue("purchase_order_numbers", val);
              }}
            />

            <TextareaAutosize
              {...register("description", {
                required: "This field is required",
              })}
              placeholder="Description"
              name="description"
              minRows={3}
            />

            {categoryOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingCategories}
                defaultValue={
                  defaultCategory
                    ? {
                        label: defaultCategory?.label,
                        value: defaultCategory?.value,
                      }
                    : null
                }
                options={categoryOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("category_id", value.value);
                  } else {
                    setValue("category_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            {customerOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingCustomers}
                defaultValue={
                  defaultCustomer
                    ? {
                        label: defaultCustomer?.label,
                        value: defaultCustomer?.value,
                      }
                    : null
                }
                options={customerOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("customer_id", value.value);
                  } else {
                    setValue("customer_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            {addressOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingAddresses}
                defaultValue={
                  defaultAddress
                    ? {
                        label: defaultAddress?.label,
                        value: defaultAddress?.value,
                      }
                    : null
                }
                options={addressOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("address_id", value.value);
                  } else {
                    setValue("address_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            {item && (
              <StatusList
                options={[
                  { value: 0, label: "Unknown" },
                  { value: 1, label: "Work Order" },
                  { value: 2, label: "Quote" },
                  { value: 3, label: "Completed" },
                  { value: 4, label: "Unsuccessful" },
                ]}
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

const SiteAssets = () => {
  const { id } = useParsed();

  const router = useRouter();
  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: false,
    liveMode: "auto",
    resource: "assets",
    meta: {
      select: "*",
    },
    sorters: { initial: [{ field: "id", order: "asc" }] },
    filters: {
      permanent: [
        {
          field: "site_id",
          operator: "eq",
          value: id,
        },
      ],
    },
  });

  const {
    options: supplierOptions,
    queryResult: { isLoading: supplierLoading },
  } = useSelect<any>({
    resource: "suppliers",
    meta: {
      select: "id, name",
    },
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
              <EditButton
                hideText
                recordItemId={row.id}
                href={`/assets/edit/${row.id}`}
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
            "Needs Maintenance",
            "Obsolete",
          ][params?.row?.assets?.status];
        },
      },
      {
        field: "purchase_order_number",
        flex: 1,
        headerName: "Site Reference",
        minWidth: 180,
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
          return params.value;
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
    ],
    [supplierOptions, supplierLoading]
  );

  const columnKey = "sitesColumnsInner";
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
      title={"Site Assets"}
      breadcrumb={null}
      headerButtons={({ defaultButtons }) => (
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              window.open("/assets/create");
            }}
          >
            Add Asset
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
    </List>
  );
};

export default SiteEdit;
