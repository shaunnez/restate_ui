import { Autocomplete, TextField } from "@mui/material";

export const StatusList = (props: any) => {
  const options = props?.options || [
    { value: 0, label: "Unknown" },
    { value: 1, label: "Active" },
    { value: 2, label: "Inactive" },
    { value: 3, label: "Deleted" },
  ];
  return (
    <Autocomplete
      fullWidth
      disablePortal
      isOptionEqualToValue={(option, value) =>
        value === undefined ||
        option?.value?.toString() === (value?.value ?? value)?.toString()
      }
      defaultValue={
        options.find((x: any) => x.value === props?.value)
          ? options.find((x: any) => x.value === props?.value)
          : options[1]
      }
      options={options}
      onChange={(event, value, reason) => {
        if (value.value) {
          props.onChange(value.value);
        } else {
          props.onChange(null);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Status"
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
};

export default StatusList;
