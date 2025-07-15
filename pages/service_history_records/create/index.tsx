import { MuiCreateInferencer } from "@refinedev/inferencer/mui";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

import { Create } from "@refinedev/mui";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import StatusList from "components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import { useSelect } from "@refinedev/core";

export const SuppliersCreate = () => {
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
          InputLabelProps={{ shrink: true }}
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
              <TextField
                {...params}
                label="Asset"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}

        <TextField
          {...register("material_cost")}
          error={!!(errors as any)?.material_cost}
          helperText={(errors as any)?.material_cost?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Material Cost"
          name="material_cost"
        />

        <TextField
          {...register("third_party_cost")}
          error={!!(errors as any)?.third_party_cost}
          helperText={(errors as any)?.third_party_cost?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Third Party Cost"
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

export default SuppliersCreate;
