import React from "react";
import { Autocomplete, Box, TextField, TextareaAutosize } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// @ts-ignore
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";

const GOOGLE_MAPS_API_KEY = "AIzaSyDnqaI9lrw8c7JyvKvdxx-F2lp6MsaH080";

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

export function GoogleMaps({ callback }: any) {
  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo<any>(
    () =>
      debounce(
        (request: any, callback: (results?: readonly PlaceType[]) => void) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        400
      ),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      { input: inputValue, region: "nz" },
      (results?: readonly PlaceType[]) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }
          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  React.useEffect(() => {
    if (value) {
      // @ts-ignore
      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        // @ts-ignore
        { placeId: value?.place_id },
        function (results: any, status: any) {
          if (status === "OK") {
            const place = results[0];
            const outputAddress = {
              street_number: "",
              street: "",
              postcode: "",
              city: "",
              state: "",
              country: "",
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              formatted_address: place.formatted_address,
              place_id: place.place_id,
            } as any;
            for (const component of place.address_components as any[]) {
              // @ts-ignore remove once typings fixed
              const componentType = component.types[0];
              switch (componentType) {
                case "street_number": {
                  outputAddress.street_number = component.long_name;
                  break;
                }

                case "route": {
                  outputAddress.street = component.short_name;
                  break;
                }

                case "postal_code": {
                  outputAddress.postcode = component.long_name;
                  break;
                }

                case "locality":
                  outputAddress.city = component.long_name;
                  break;

                case "administrative_area_level_1": {
                  outputAddress.state = component.long_name;
                  break;
                }

                case "country":
                  outputAddress.country = component.long_name;
                  break;
              }
            }

            callback(outputAddress);
          }
        }
      );
    }
  }, [value]);

  return (
    <Autocomplete
      id="google-map-demo"
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        // @ts-ignore
        setValue(newValue, autocompleteService.current);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Google Address Search"
        />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part: any, index: any) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

export default GoogleMaps;
