import { GetServerSideProps } from "next";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

import { Create } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import moment from "moment";
import StatusList from "components/StatusList";
import { useSelect } from "@refinedev/core";

export const AssetsCreate = () => {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm({ refineCoreProps: { resource: "assets" } });

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
    // filters: [{ field: "make_id", operator: "eq", value: item?.make_id }],
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

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Description"
          name="description"
        />

        {typeOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingTypes}
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
              option?.value?.toString() === (value?.value ?? value)?.toString()
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                margin="normal"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}

        {makeOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingMakes}
            options={makeOptions}
            isOptionEqualToValue={(option, value) =>
              value === undefined ||
              option?.value?.toString() === (value?.value ?? value)?.toString()
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
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}

        {modelOptions.length > 0 && (
          <Autocomplete
            fullWidth
            disablePortal
            loading={isLoadingModels}
            options={modelOptions}
            isOptionEqualToValue={(option, value) =>
              value === undefined ||
              option?.value?.toString() === (value?.value ?? value)?.toString()
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
                InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Consumption"
          name="consumption"
        />
        <StatusList
          onChange={(e: any) => {
            setValue("status", e);
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
        destination: `${redirectTo}?to=${encodeURIComponent("/assets")}`,
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

export default AssetsCreate;
