"use client";

import { DateTimePicker } from "@mui/x-date-pickers";
import { Create } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";

export const AssetsCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({ refineCoreProps: { resource: "site_assets" } });

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

  const {
    options: siteOptions,
    queryResult: { isLoading: isLoadingSites, data: siteData },
  } = useSelect<any>({
    resource: "sites",
    hasPagination: false,
    filters: [{ field: "status", operator: "ne", value: 4 }],
    // @ts-ignore
    optionLabel: "job_id",
    sorters: [
      {
        field: "job_id",
        order: "asc",
      },
    ],
  });

  const [site_id] = watch(["site_id"]);
  const selectedSite = siteData?.data?.find((x) => x.id === site_id);

  const availablePos =
    selectedSite && selectedSite.purchase_order_numbers
      ? selectedSite.purchase_order_numbers.split(",")
      : [];

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
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
            getOptionLabel={(option) => {
              return option?.label || "";
            }}
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
              fullWidth
            />
          )}
        />

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
        <br />

        <TextField
          {...register("check_in_user")}
          error={!!(errors as any)?.check_in_user}
          helperText={(errors as any)?.check_in_user?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Check in user"
          name="check_in_user"
        />

        <br />

        <DateTimePicker
          label="Check In Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("check_in", value);
          }}
        />

        <br />

        <TextField
          {...register("check_out_user")}
          error={!!(errors as any)?.check_out_user}
          helperText={(errors as any)?.check_out_user?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Check out user"
          name="check_out_user"
        />

        <br />

        <DateTimePicker
          label="Check Out Date"
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("check_out", value);
          }}
        />
      </Box>
    </Create>
  );
};

export default AssetsCreate;
