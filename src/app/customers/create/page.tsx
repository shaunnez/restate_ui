"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";

import StatusList from "@components/StatusList";

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
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Name"
          name="name"
        />
        <TextField
          {...register("first_name")}
          error={!!(errors as any)?.first_name}
          helperText={(errors as any)?.first_name?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Contact First Name"
          name="first_name"
        />
        <TextField
          {...register("last_name")}
          error={!!(errors as any)?.last_name}
          helperText={(errors as any)?.last_name?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Contact Last Name"
          name="last_name"
        />
        <TextField
          {...register("email")}
          error={!!(errors as any)?.email}
          helperText={(errors as any)?.email?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Contact Email"
          name="email"
        />

        <TextField
          {...register("phone")}
          error={!!(errors as any)?.phone}
          helperText={(errors as any)?.phone?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Contact Phone"
          name="phone"
        />

        <TextField
          {...register("mobile")}
          error={!!(errors as any)?.mobile}
          helperText={(errors as any)?.mobile?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Contact Mobile"
          name="mobile"
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
          {...register("notes")}
          error={!!(errors as any)?.notes}
          helperText={(errors as any)?.notes?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Notes"
          name="notes"
        />

        <TextField
          {...register("address")}
          error={!!(errors as any)?.address}
          helperText={(errors as any)?.address?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Address"
          name="address"
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
