"use client";
import { Create } from "@refinedev/mui";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import { useSelect } from "@refinedev/core";

export const ServiceHistoryRecordsCreate = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({ refineCoreProps: { resource: "service_history_records" } });

  const item = queryResult?.data?.data as any;

  const {
    options: assetOptions,
    queryResult: { isLoading: isLoadingAssets, data },
  } = useSelect<any>({
    resource: "assets",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "serial_number",
    meta: {
      select:
        "id, old_id, serial_number, make, model, category, type, classification",
    },
    sorters: [
      {
        field: "serial_number",
        order: "asc",
      },
    ],
  });

  React.useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, isLoadingAssets]);

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("notes")}
          error={!!(errors as any)?.notes}
          helperText={(errors as any)?.notes?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Notes"
          name="notes"
        />

        {assetOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingAssets}
            // @ts-ignore
            options={data?.data?.map((x) => {
              const label = [];
              if (x.make) {
                label.push(x.make);
              }
              if (x.model) {
                label.push(x.model);
              }
              if (x.category) {
                label.push(x.category);
              }
              if (x.type) {
                label.push(x.type);
              }
              if (x.classification) {
                label.push(x.classification);
              }
              return {
                label: label.join(", ") + " (" + x.old_id + ")",
                value: x.id,
              };
            })}
            isOptionEqualToValue={(option, value) =>
              value === undefined ||
              option?.value?.toString() === (value?.value ?? value)?.toString()
            }
            onChange={(event, value, reason) => {
              if (value?.value !== undefined) {
                setValue("asset_id", value.value);
              } else {
                setValue("asset_id", null);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Asset" margin="normal" fullWidth />
            )}
          />
        )}

        <TextField
          {...register("material_cost")}
          error={!!(errors as any)?.material_cost}
          helperText={(errors as any)?.material_cost?.message}
          margin="normal"
          fullWidth
          type="number"
          label="Material Cost"
          InputLabelProps={{ shrink: true }}
          name="material_cost"
        />

        <TextField
          {...register("third_party_cost")}
          error={!!(errors as any)?.third_party_cost}
          helperText={(errors as any)?.third_party_cost?.message}
          margin="normal"
          fullWidth
          type="number"
          label="Third Party Cost"
          InputLabelProps={{ shrink: true }}
          name="third_party_cost"
        />

        <br />
        <DateTimePicker
          label="Serviced Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value: any) => {
            setValue("serviced_date", value);
          }}
        />
      </Box>
    </Create>
  );
};

export default ServiceHistoryRecordsCreate;
