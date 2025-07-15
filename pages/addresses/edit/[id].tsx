import React from "react";
import { Edit } from "@refinedev/mui";
import { Autocomplete, Box, TextField, TextareaAutosize } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import moment from "moment";
import StatusList from "components/StatusList";
import { DateTimePicker } from "@mui/x-date-pickers";
// @ts-ignore
import GoogleMaps from "components/GoogleMapsAutocomplete";

export const AddressesEdit = (props: any) => {
  const {
    saveButtonProps,
    refineCore: { queryResult, formLoading },
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const item = queryResult?.data?.data as any;

  React.useEffect(() => {
    setValue("updated_at", moment());
  }, [item]);
  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
        {/* <TextField
          {...register("label")}
          error={!!(errors as any)?.label}
          helperText={(errors as any)?.label?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Label"
          name="label"
        /> */}

        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            background: "#ccc",
            width: "100%",
            height: "1px",
          }}
        />
        <GoogleMaps
          callback={(data: any) => {
            setValue("description", data.formatted_address);
            setValue("number", data.street_number);
            setValue("street", data.street);
            setValue("state", data.state);
            setValue("city", data.city);
            setValue("postcode", data.postcode);
            setValue("country", data.country);
            setValue("lat", data.lat ? Number(data.lat) : null);
            setValue("lng", data.lng ? Number(data.lng) : null);
            console.log(256, data);
          }}
        />

        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            background: "#ccc",
            width: "100%",
            height: "1px",
          }}
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

        <TextField
          {...register("number")}
          error={!!(errors as any)?.number}
          helperText={(errors as any)?.number?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Street Number"
          name="number"
        />

        <TextField
          {...register("street")}
          error={!!(errors as any)?.street}
          helperText={(errors as any)?.street?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Street"
          name="street"
        />

        <TextField
          {...register("city")}
          error={!!(errors as any)?.city}
          helperText={(errors as any)?.city?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="City"
          name="city"
        />

        <TextField
          {...register("state")}
          error={!!(errors as any)?.state}
          helperText={(errors as any)?.state?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="State"
          name="state"
        />

        <TextField
          {...register("postcode")}
          error={!!(errors as any)?.postcode}
          helperText={(errors as any)?.postcode?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Postal code"
          name="postcode"
        />

        <TextField
          {...register("country")}
          error={!!(errors as any)?.country}
          helperText={(errors as any)?.country?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Country"
          name="country"
        />

        <TextField
          {...register("lat")}
          error={!!(errors as any)?.lat}
          helperText={(errors as any)?.lat?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Lat"
          name="lat"
        />

        <TextField
          {...register("lng")}
          error={!!(errors as any)?.lng}
          helperText={(errors as any)?.lng?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Lng"
          name="lng"
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
        destination: `${redirectTo}?to=${encodeURIComponent("/customers")}`,
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

export default AddressesEdit;
