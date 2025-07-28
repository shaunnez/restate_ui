"use client";

import { authProvider } from "src/authProvider";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";

import StatusList from "@components/StatusList";
import GoogleMaps from "@components/GoogleMapsAutocomplete";

export default function AddressesCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
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
          type="text"
          label="Lng"
          name="lng"
        />
        <StatusList
          onChange={(e: any) => {
            setValue("status", e);
          }}
        />
      </Box>
    </Create>
  );
}
