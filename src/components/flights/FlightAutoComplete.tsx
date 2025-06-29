// components/FlightAutocomplete/index.tsx
"use client";
import { Flight as FlightIcon, LocationOnOutlined, TripOrigin } from "@mui/icons-material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  ClickAwayListener,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";
import { useFlightSuggestions } from "../../hooks/useFlightSuggestions";
import type { LocationOption } from "../../lib/models/flight";

export function getLocationIcon(type: string): JSX.Element {
  switch (type) {
    case "AIRPORT":
      return <FlightIcon fontSize="small" />;
    case "CITY":
      return <LocationCityIcon fontSize="small" />;
    case "COUNTRY":
      return <PublicIcon fontSize="small" />;
    default:
      return <LocationOnIcon fontSize="small" />;
  }
}

export const FlightAutocomplete: React.FC<{
  type: "whereFrom" | "whereTo";

  placeholder: string;
  value: LocationOption | null;
  onChange: (v: LocationOption | null) => void;
  disabled?: boolean;
}> = ({ type, placeholder, value, onChange, disabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [, setOpen] = useState(false);
  const { options, loading } = useFlightSuggestions(inputValue);

  useEffect(() => {
    if (options.length > 0 && inputValue.length >= 2) {
      setOpen(true);
    }
  }, [options, inputValue]);

  const handleSelect = (opt: LocationOption) => {
    setInputValue(opt.suggestionTitle);
    onChange(opt);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width: "100%", flex: 1 }}>
        <Autocomplete
          //   open={open && !!options.length}
          //   onOpen={() => {
          //     if (inputValue.length >= 2 && options.length > 0) {
          //       setOpen(true);
          //     }
          //   }}
          //   onClose={() => setOpen(false)}
          value={value === null ? undefined : value}
          onChange={(_, newVal) => newVal && handleSelect(newVal)}
          inputValue={inputValue}
          onInputChange={(_, v, r) => {
            if (r === "input") {
              setInputValue(v);
              setOpen(v.length >= 2 && !!options.length);
            }
          }}
          options={options}
          groupBy={(opt) => opt.subtitle}
          getOptionLabel={(opt) => (opt.parentId ? "  " + opt.suggestionTitle : opt.suggestionTitle)}
          loading={loading}
          disabled={disabled}
          filterOptions={(x) => x}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          clearOnBlur={false}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              // label={label}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment:
                  type === "whereFrom" ? (
                    <TripOrigin
                      sx={{
                        mr: 1,

                        fontSize: "1rem",
                      }}
                    />
                  ) : (
                    <LocationOnOutlined
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                endAdornment: loading ? <CircularProgress size={20} /> : params.InputProps.endAdornment,
              }}
            />
          )}
          renderOption={(props, opt) => (
            <ListItem {...props} key={opt.id} sx={{ ml: opt.entityType === "AIRPORT" ? 4 : 1 }}>
              <ListItemIcon>{getLocationIcon(opt.entityType)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <Typography fontWeight={500}>{opt.name}</Typography> */}
                    <Typography fontWeight={500}>{opt.suggestionTitle}</Typography>
                    <Chip label={opt.code} size="small" />
                  </Box>
                }
                secondary={
                  <Typography variant="body2">{opt.entityType === "CITY" ? opt.subtitle : undefined}</Typography>
                }
              />
            </ListItem>
          )}
          renderGroup={({ key, children }) => (
            <li key={key}>
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>{children}</ul>
            </li>
          )}
          PaperComponent={(paperProps) => <Paper {...paperProps} sx={{ mt: 1, maxHeight: 400, overflowY: "auto" }} />}
          noOptionsText={loading ? "Searching…" : inputValue.length < 2 ? "Type 2+ characters" : "No locations found"}
        />
      </Box>
    </ClickAwayListener>
  );
};
