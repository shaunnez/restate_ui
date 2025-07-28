"use client";
import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers";

import { Create } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import StatusList from "@components/StatusList";
import { useSelect } from "@refinedev/core";

export const AssetsCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm({ refineCoreProps: { resource: "assets" } });

  const {
    options: supplierOptions,
    queryResult: { isLoading: isLoadingSuppliers },
  } = useSelect<any>({
    resource: "suppliers",
    hasPagination: false,
    // filters: [{ field: "make_id", operator: "eq", value: item?.make_id }],
    // @ts-ignore
    optionLabel: "name",
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

  const [site_id, barcode] = watch(["site_id", "barcode"]);

  const selectedSite = siteData?.data?.find((x) => x.id === site_id);

  const availablePos =
    selectedSite && selectedSite.purchase_order_numbers
      ? selectedSite.purchase_order_numbers.split(",")
      : [];

  const defaultSite = siteOptions.find((x) => x.value === getValues("site_id"));

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

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("old_id", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
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
          type="text"
          label="Serial no"
          name="serial_number"
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            {...register("barcode")}
            error={!!(errors as any)?.barcode}
            helperText={(errors as any)?.barcode?.message}
            margin="normal"
            fullWidth
            type="text"
            label="Barcode"
            name="barcode"
          />
          {barcode && (
            <img
              style={{ cursor: "pointer", marginLeft: "16px" }}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                barcode || "666"
              }`}
              height={64}
              onClick={(e) => {
                window.open(
                  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                    barcode || "666"
                  }`
                );
              }}
            />
          )}
        </div>

        {supplierOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingSuppliers}
            options={supplierOptions}
            isOptionEqualToValue={(option, value) =>
              value === undefined ||
              option?.value?.toString() === (value?.value ?? value)?.toString()
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
              />
            )}
          />
        )}

        {siteOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingSites}
            options={siteOptions}
            isOptionEqualToValue={(option, value) =>
              value === undefined ||
              option?.value?.toString() === (value?.value ?? value)?.toString()
            }
            onChange={(event, value, reason) => {
              if (value?.value !== undefined) {
                setValue("site_id", value.value);
              } else {
                setValue("site_id", null);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Site" margin="normal" fullWidth />
            )}
          />
        )}

        {siteOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            // @ts-ignore
            options={availablePos}
            onChange={(event, value, reason) => {
              setValue("purchase_order_number", value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Reference"
                margin="normal"
                name="purchase_order_number"
                fullWidth
              />
            )}
          />
        )}

        <TextField
          {...register("purchased_price")}
          error={!!(errors as any)?.purchase_price}
          helperText={(errors as any)?.purchase_price?.message}
          margin="normal"
          fullWidth
          type="number"
          label="Purchased Price"
          InputLabelProps={{ shrink: true }}
          name="purchased_price"
        />

        <br />
        <DateTimePicker
          label="Purchased Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("purchased_date", value);
          }}
        />

        <br />
        <StatusList
          options={[
            { value: 0, label: "Unknown" },
            { value: 1, label: "In service" },
            { value: 2, label: "Out of service" },
            { value: 3, label: "Needs Maintenance" },
            { value: 4, label: "Obsolete" },
          ]}
          onChange={(e: any) => {
            setValue("status", e);
          }}
        />

        <br />
        <DateTimePicker
          label="Tagging Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("tagging_date", value);
          }}
        />
        <br />
        <DateTimePicker
          label="Future Tagging Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("future_tagging_date", value);
          }}
        />
        <br />
        <DateTimePicker
          label="Service Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("service_date", value);
          }}
        />
        <br />
        <DateTimePicker
          label="Future Tagging Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("future_service_date", value);
          }}
        />
      </Box>
    </Create>
  );
};

export default AssetsCreate;
