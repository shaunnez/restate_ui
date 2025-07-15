import React from "react";
import { Edit } from "@refinedev/mui";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import moment from "moment";
import StatusList from "components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useParsed, useSelect, useGetIdentity } from "@refinedev/core";

export const ServiceHistoryRecordEdit = (props: any) => {
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
  } = useForm({ refineCoreProps: { resource: "service_history_records", id } });

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
        "id, old_id, serial_number, status, make, model, category, type, classification",
    },
    sorters: [
      {
        field: "serial_number",
        order: "asc",
      },
    ],
  });

  const defaultAsset = data?.data.find(
    (x) => x.id === getValues("asset_id") || item?.asset_id
  );

  const { data: user } = useGetIdentity();

  React.useEffect(() => {
    if (item) {
      console.log(item, defaultAsset, data?.data, getValues("asset_id"));
      // @ts-ignore
      reset({ ...item, email: user?.name });
    }
  }, [item, isLoadingAssets]);

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
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

        {item && assetOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingAssets}
            defaultValue={
              defaultAsset
                ? {
                    label: defaultAsset.old_id,
                    value: defaultAsset?.id,
                  }
                : null
            }
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
          value={item?.serviced_date ? moment(item?.serviced_date) : ""}
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("serviced_date", value);
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

export default ServiceHistoryRecordEdit;
