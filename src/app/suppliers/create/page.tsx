"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";

import StatusList from "@components/StatusList";

const SuppliersCreate = () => {
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
          {...register("branch")}
          error={!!(errors as any)?.branch}
          helperText={(errors as any)?.branch?.message}
          margin="normal"
          fullWidth
          type="text"
          label="Branch"
          name="branch"
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

export default SuppliersCreate;
