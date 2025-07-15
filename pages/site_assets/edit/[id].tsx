import React from "react";
import { Edit } from "@refinedev/mui";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import moment from "moment";
import StatusList from "components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useParsed, useSelect } from "@refinedev/core";

export const SiteAssetEdit = (props: any) => {
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
    watch,
  } = useForm({ refineCoreProps: { resource: "site_assets", id } });

  const item = queryResult?.data?.data as any;

  const {
    options: assetOptions,
    queryResult: { isLoading: isLoadingAssets, data },
  } = useSelect<any>({
    resource: "assets",
    hasPagination: false,
    // @ts-ignore
    optionLabel: "serial_number",
    defaultValue: item?.asset_id,
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
    // @ts-ignore
    optionLabel: "job_id",
    defaultValue: item?.site_id,
    // meta: {
    //   select:
    //     "id, serial_number, asset(name, asset_types(name), asset_makes(name), asset_models(name)), sites(name)",
    // },
    sorters: [
      {
        field: "job_id",
        order: "asc",
      },
    ],
  });

  const defaultAsset = data?.data.find(
    (x) => x.id === getValues("asset_id") || item?.asset_id
  );
  const defaultSite = siteOptions.find(
    (x) => x.value === getValues("site_id") || item?.site_id
  );

  const [site_id] = watch(["site_id"]);
  const selectedSite = siteData?.data?.find((x) => x.id === site_id);

  const availablePos =
    selectedSite && selectedSite.purchase_order_numbers
      ? selectedSite.purchase_order_numbers.split(",")
      : [];

  React.useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, isLoadingAssets, isLoadingSites]);

  return (
    <Edit
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      resource="site_assets"
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
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
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

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
        <br />

        <TextField
          {...register("check_in_user")}
          error={!!(errors as any)?.check_in_user}
          helperText={(errors as any)?.check_in_user?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Check in user"
          name="check_in_user"
        />

        <br />

        <DateTimePicker
          label="Check In Date"
          value={item?.check_in ? moment(item?.check_in) : ""}
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
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Check out user"
          name="check_out_user"
        />

        <br />

        <DateTimePicker
          label="Check Out Date"
          value={item?.check_out ? moment(item?.check_out) : ""}
          format="DD/MM/YYYY HH:mm"
          onChange={(value) => {
            setValue("check_out", value);
          }}
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
        destination: `${redirectTo}?to=${encodeURIComponent("/site_assets")}`,
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

export default SiteAssetEdit;
