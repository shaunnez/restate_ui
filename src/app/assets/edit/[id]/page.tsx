"use client";
import React from "react";
import { DateField, Edit, EditButton, List, useDataGrid } from "@refinedev/mui";
import { Autocomplete, Box, Button, Tab, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import moment from "moment";
import StatusList from "@components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useParsed, useSelect, useGetIdentity } from "@refinedev/core";
import { DataGrid } from "@mui/x-data-grid";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useRouter } from "next/navigation";
import axios from "axios";

export const AssetEdit = (props: any) => {
  const { id } = useParsed();
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading, mutationResult },
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
    watch,
  } = useForm({ refineCoreProps: { resource: "assets", id, action: "edit" } });

  const item = queryResult?.data?.data as any;
  const [tabValue, setTabValue] = React.useState("1");

  const {
    options: supplierOptions,
    queryResult: { isLoading: isLoadingSuppliers },
  } = useSelect<any>({
    resource: "suppliers",
    hasPagination: false,
    // filters: [{ field: "make_id", operator: "eq", value: item?.make_id }],
    // @ts-ignore
    optionLabel: "name",
    // defaultValue: item?.supplier,
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
    options: siteOptions,
    queryResult: { isLoading: isLoadingSites, data: siteData },
  } = useSelect<any>({
    resource: "sites",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "name",
    defaultValue: item?.site_id,
    meta: {
      select: "id, name, job_id, purchase_order_numbers",
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
    filters: [{ field: "status", operator: "ne", value: 4 }],
  });

  const defaultSupplier = supplierOptions.find(
    (x) => x.value === getValues("supplier_id")
  );

  const [
    site_id,
    purchased_date,
    tagging_date,
    future_tagging_date,
    service_date,
    future_service_date,
  ] = watch([
    "site_id",
    "purchased_date",
    "tagging_date",
    "future_tagging_date",
    "service_date",
    "future_service_date",
  ]);

  const selectedSite = siteData?.data?.find((x) => x.id === site_id);

  const availablePos =
    selectedSite && selectedSite.purchase_order_numbers
      ? selectedSite.purchase_order_numbers.split(",")
      : [];

  const defaultSite = siteOptions.find((x) => x.value === getValues("site_id"));

  const { data: user } = useGetIdentity();

  React.useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, isLoadingSuppliers, isLoadingSites]);

  React.useEffect(() => {
    if (availablePos.length === 0) {
      setValue("purchase_order_number", "");
      if (document.querySelector('input[name="purchase_order_number"]')) {
        // @ts-ignore
        document.querySelector('input[name="purchase_order_number"]').value =
          "";
      }
    }
  }, [availablePos]);

  React.useEffect(() => {
    if (mutationResult?.status === "success") {
      const vars = mutationResult?.variables?.values as any;
      const hasDiff =
        vars.site_id !== item.site_id ||
        vars.purchase_order_number !== item.purchase_order_number;
      if (hasDiff) {
        const data = {
          asset_id: vars?.id,
          site_id: vars?.site_id,
          purchase_order_number: vars?.purchase_order_number,
          // @ts-ignore
          email: user?.name,
        };
        axios.post("/api/asset_history", data);
      }

      const hasDiff2 =
        vars.tagging_date !== item.tagging_date ||
        vars.service_date !== item.service_date;
      if (hasDiff2) {
        const data = {
          asset_id: vars?.id,
          serviced_date:
            vars.tagging_date !== item.tagging_date
              ? vars.tagging_date
              : vars.service_date,
          notes:
            vars.tagging_date !== item.tagging_date ? "New Tag" : "New Service",
          // @ts-ignore
          email: user?.name,
        };
        axios.post("/api/service_history", data);
      }
    }
  }, [mutationResult.status]);

  return (
    <TabContext value={tabValue}>
      <TabList
        onChange={(event, newValue) => {
          setTabValue(newValue);
        }}
      >
        <Tab label="Asset Site History" value="1" />
        <Tab label="Service History Records" value="2" />
        <Tab label="Edit" value="3" />
      </TabList>

      <TabPanel value="1">
        <SiteAssets />
      </TabPanel>
      <TabPanel value="2">
        <ServiceHistoryRecords />
      </TabPanel>
      <TabPanel value="3">
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
            autoComplete="off"
          >
            {/* <TextField
              {...register("id")}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="ID"
              name="id"
              disabled
            /> */}
            <TextField
              {...register("old_id", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="PNumber"
              name="old_id"
            />
            <TextField
              {...register("make", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Make"
              name="make"
            />

            <TextField
              {...register("model", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Model"
              name="model"
            />

            <TextField
              {...register("category", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Category"
              name="category"
            />

            <TextField
              {...register("type", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Type"
              name="type"
            />

            <TextField
              {...register("classification", {
                required: "This field is required",
              })}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Classification"
              name="classification"
            />

            <TextField
              {...register("serial_number")}
              error={!!(errors as any)?.serial_number}
              helperText={(errors as any)?.serial_number?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Serial Number"
              name="serial_number"
            />

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                {...register("barcode")}
                error={!!(errors as any)?.barcode}
                helperText={(errors as any)?.serial_number?.message}
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Barcode"
                name="barcode"
              />

              <img
                style={{ cursor: "pointer", marginLeft: "16px" }}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${getValues(
                  "barcode"
                )}`}
                height={64}
                onClick={(e) => {
                  window.open(
                    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${getValues(
                      "barcode"
                    )}`
                  );
                }}
              />

              <iframe id="theIframe" style={{ display: "none" }} />
            </div>

            {supplierOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingSuppliers}
                defaultValue={
                  defaultSupplier
                    ? {
                        label: defaultSupplier?.label,
                        value: defaultSupplier?.value,
                      }
                    : null
                }
                options={supplierOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("supplier_id", value.value);
                  } else {
                    setValue("supplier_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            {siteOptions.length > 0 && (
              <Autocomplete
                fullWidth
                disablePortal
                loading={isLoadingSites}
                defaultValue={
                  defaultSite
                    ? {
                        label: defaultSite?.label,
                        value: defaultSite?.value,
                      }
                    : null
                }
                options={siteOptions}
                isOptionEqualToValue={(option, value) =>
                  value === undefined ||
                  option?.value?.toString() ===
                    (value?.value ?? value)?.toString()
                }
                onChange={(event, value, reason) => {
                  if (value?.value !== undefined) {
                    setValue("site_id", value.value);
                  } else {
                    setValue("site_id", null);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Site"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            <Autocomplete
              fullWidth
              disablePortal
              defaultValue={item?.purchase_order_number}
              // @ts-ignore
              options={availablePos}
              onChange={(event, value, reason) => {
                setValue("purchase_order_number", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="References"
                  margin="normal"
                  name="purchase_order_number"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <TextField
              {...register("purchased_price")}
              error={!!(errors as any)?.purchase_price}
              helperText={(errors as any)?.purchase_price?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="number"
              label="Purchased Price"
              name="purchased_price"
            />

            <br />
            <DateTimePicker
              label="Purchased Date"
              value={moment(purchased_date)}
              format="DD/MM/YYYY HH:mm"
              onChange={(value) => {
                setValue("purchased_date", value);
              }}
            />

            <br />
            <TextField
              {...register("plant")}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Plant"
              name="plant"
            />
            <br />
            <TextField
              {...register("consumption")}
              error={!!(errors as any)?.name}
              helperText={(errors as any)?.name?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Consumption"
              name="consumption"
            />

            <br />
            {item && (
              <StatusList
                options={[
                  { value: 0, label: "Unknown" },
                  { value: 1, label: "In service" },
                  { value: 2, label: "Out of service" },
                  { value: 3, label: "Needs Maintenance" },
                  { value: 4, label: "Obsolete" },
                ]}
                value={item?.status}
                onChange={(e: any) => {
                  setValue("status", e);
                }}
              />
            )}
            <br />

            <br />
            <DateTimePicker
              label="Tagging Date"
              value={moment(tagging_date)}
              format="DD/MM/YYYY HH:mm"
              onChange={(value) => {
                setValue("tagging_date", value);
              }}
            />
            <br />
            <DateTimePicker
              label="Future Tagging Date"
              value={moment(future_tagging_date)}
              format="DD/MM/YYYY HH:mm"
              onChange={(value) => {
                setValue("future_tagging_date", value);
              }}
            />
            <br />
            <DateTimePicker
              label="Service Date"
              value={moment(service_date)}
              format="DD/MM/YYYY HH:mm"
              onChange={(value) => {
                setValue("service_date", value);
              }}
            />
            <br />
            <DateTimePicker
              label="Future Service Date"
              value={moment(future_service_date)}
              format="DD/MM/YYYY HH:mm"
              onChange={(value) => {
                setValue("future_service_date", value);
              }}
            />
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
    resource: "site_assets",
    sorters: { initial: [{ field: "created_on", order: "desc" }] },
    meta: {
      select:
        "*, sites( job_id, addresses(description)), assets(id, old_id, make, model, category, type, classification, serial_number, barcode, status)",
    },
    filters: {
      permanent: [
        {
          field: "asset_id",
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
                href={`/sites/edit/${row.site_id}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/sites/edit/" + row.site_id);
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
        field: "assets.old_id",
        flex: 1,
        minWidth: 120,
        headerName: "PNumber",
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
        field: "sites.job_id",
        flex: 1,
        headerName: "Site",
        minWidth: 100,
        renderCell: (params: any) => {
          return params.row.sites?.job_id;
        },
      },
      {
        field: "purchase_order_number",
        flex: 1,
        headerName: "Reference",
        minWidth: 140,
      },
      {
        field: "sites.addresses.description",
        flex: 2,
        headerName: "Address",
        minWidth: 300,
        renderCell: (params: any) => {
          return params.row.sites?.addresses?.description;
        },
      },
      {
        field: "email",
        flex: 1,
        headerName: "User",
        minWidth: 180,
      },
      {
        field: "created_on",
        flex: 1,
        headerName: "Moved",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
    ],
    []
  );

  const columnKey = "siteAssetColumns2";
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
      title={"Site Asset "}
      breadcrumb={null}
      canCreate={false}
      // headerButtons={({ defaultButtons }) => (
      //   <Button
      //     color="primary"
      //     variant="contained"
      //     onClick={(e) => {
      //       window.open("/site_assets/create");
      //     }}
      //   >
      //     Add Site Asset
      //   </Button>
      // )}
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

const ServiceHistoryRecords = () => {
  const { id } = useParsed();

  const router = useRouter();

  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: false,
    liveMode: "auto",
    resource: "service_history_records",
    sorters: { initial: [{ field: "created_at", order: "asc" }] },
    filters: {
      permanent: [
        {
          field: "asset_id",
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
                  router.push("/service_history_records/edit/" + row.id);
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
        field: "serviced_date",
        flex: 1,
        headerName: "Serviced Date",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          } else {
            return null;
          }
        },
      },
      {
        field: "email",
        flex: "1",
        headerName: "User",
        minWidth: 180,
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
        field: "notes",
        flex: "1",
        headerName: "Notes",
        minWidth: 350,
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

  const columnKey = "serviceHistoryRecordColumns2";
  let columnVisibilityModel = {};
  if (
    typeof window !== "undefined" &&
    window?.sessionStorage?.getItem(columnKey)
  ) {
    columnVisibilityModel = JSON.parse(
      window?.sessionStorage.getItem(columnKey) as string
    );
  }

  return (
    <List
      title={"Service History Records"}
      breadcrumb={null}
      headerButtons={({ defaultButtons }) => (
        <Button
          color="primary"
          variant="contained"
          onClick={(e) => {
            window.open("/service_history_record/create");
          }}
        >
          Add Service History Record
        </Button>
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

export default AssetEdit;
