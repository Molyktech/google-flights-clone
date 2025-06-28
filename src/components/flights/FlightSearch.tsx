import { CalendarToday } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useState } from "react";
import type { LocationOption, PassengerCounts } from "../../lib/models/flight";
import { formatDate } from "../../lib/utils";
import { FlightAutocomplete } from "./FlightAutoComplete";
import FlightDatePicker from "./FlightDatePicker";

const classes = ["Economy", "Premium Economy", "Business", "First"];

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (v: PassengerCounts) => void;
}

function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [draft, setDraft] = useState(value);
  const [focus, setFocus] = useState(false);
  const open = Boolean(anchorEl);

  const total = draft.adults + draft.children + draft.infantsSeat + draft.infantsLap;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDraft(value);
    setAnchorEl(event.currentTarget);
    setFocus(true);
  };
  // const handleClose = () => {
  //   setAnchorEl(null);
  //   setFocus(false);
  // };
  const handleDone = () => {
    onChange(draft);
    setAnchorEl(null);
    setFocus(false);
  };
  const handleCancel = () => {
    setAnchorEl(null);
    setFocus(false);
  };
  const handleChange = (key: keyof typeof draft, delta: number) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      if (key === "adults" && next.adults < 1) next.adults = 1;
      return next;
    });
  };

  // Use the same style logic as the selects
  const filledStyle = {
    background: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.09)",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    boxShadow: "none",
    transition: "background 0.2s",
    minWidth: 100,
    textTransform: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    color: theme.palette.text.primary,
    height: 40,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 400,
    fontSize: "1rem",
    gap: 1,
    outline: "none",
    "&:focus": { outline: "none", borderBottom: `2px solid ${theme.palette.primary.main}` },
  };
  const standardStyle = {
    background: "none",
    minWidth: 100,
    textTransform: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    color: theme.palette.text.primary,
    height: 40,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 400,
    fontSize: "1rem",
    outline: "none",
    gap: 1,
    "&:focus": { outline: "none" },
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        sx={open || focus ? filledStyle : standardStyle}
        disableElevation
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              transition: "transform 0.2s",
              transform: open ? "rotate(-180deg)" : "rotate(0deg)",
              ml: 0.5,
              fontSize: 22,
            }}
          />
        }
        startIcon={<PersonOutlineIcon fontSize="small" />}>
        {total}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            minWidth: 320,
            p: 0,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            mt: 1,
          },
        }}>
        <Divider sx={{ mb: 0.5 }} />
        <List dense disablePadding sx={{ p: 2, pt: 1 }}>
          <ListItem>
            <ListItemText primary="Adults" secondary="" />

            <Button size="small" onClick={() => handleChange("adults", -1)} disabled={draft.adults <= 1}>
              -
            </Button>
            <Typography component="span" sx={{ mx: 1 }}>
              {draft.adults}
            </Typography>
            <Button size="small" onClick={() => handleChange("adults", 1)}>
              +
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText primary="Children" secondary="Aged 2–11" />

            <Button size="small" onClick={() => handleChange("children", -1)} disabled={draft.children <= 0}>
              -
            </Button>
            <Typography component="span" sx={{ mx: 1 }}>
              {draft.children}
            </Typography>
            <Button size="small" onClick={() => handleChange("children", 1)}>
              +
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText primary="Infants" secondary="In seat" />

            <Button size="small" onClick={() => handleChange("infantsSeat", -1)} disabled={draft.infantsSeat <= 0}>
              -
            </Button>
            <Typography component="span" sx={{ mx: 1 }}>
              {draft.infantsSeat}
            </Typography>
            <Button size="small" onClick={() => handleChange("infantsSeat", 1)}>
              +
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText primary="Infants" secondary="On lap" />

            <Button size="small" onClick={() => handleChange("infantsLap", -1)} disabled={draft.infantsLap <= 0}>
              -
            </Button>
            <Typography component="span" sx={{ mx: 1 }}>
              {draft.infantsLap}
            </Typography>
            <Button size="small" onClick={() => handleChange("infantsLap", 1)}>
              +
            </Button>
          </ListItem>
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, px: 2, pb: 1 }}>
          <Button onClick={handleCancel} color="primary" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleDone} color="primary" variant="contained" sx={{ textTransform: "none" }}>
            Done
          </Button>
        </Box>
      </Popover>
    </>
  );
}

const FlightSearch = () => {
  const theme = useTheme();
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState<LocationOption | null>(null);
  const [to, setTo] = useState<LocationOption | null>(null);
  const [passengerCounts, setPassengerCounts] = useState({ adults: 1, children: 0, infantsSeat: 0, infantsLap: 0 });
  const [flightClass, setFlightClass] = useState(classes[0]);
  const [tripTypeOpen, setTripTypeOpen] = useState(false);
  const [tripTypeFocus, setTripTypeFocus] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [classFocus, setClassFocus] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const filledStyle = {
    background: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.09)",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    boxShadow: "none",
    transition: "background 0.2s",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  };
  const standardStyle = {
    "& .MuiInputBase-root": { background: "none", borderBottom: "none !important", padding: theme.spacing(0.5) },
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleTripTypeChange = (newTripType: string) => {
    setTripType(newTripType);
    if (newTripType === "oneway") {
      setReturnDate(null);
    }
  };

  const getDateRangeText = () => {
    if (tripType === "oneway") {
      return departureDate ? formatDate(departureDate) : "";
    } else {
      if (departureDate && returnDate) {
        return `${formatDate(departureDate)} - ${formatDate(returnDate)}`;
      } else if (departureDate) {
        return `${formatDate(departureDate)} - Return date`;
      } else {
        return "";
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          maxWidth: 950,
          width: "100%",
          mx: "auto",
          mt: { xs: 2, md: -7 },
          position: "relative",
          zIndex: 2,
          background: theme.palette.background.paper,
        }}>
        {/* Top controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}>
          {/* Trip type */}
          <FormControl size="small" variant="standard" sx={tripTypeOpen || tripTypeFocus ? filledStyle : standardStyle}>
            <Select
              value={tripType}
              input={<Input disableUnderline />}
              onChange={(e) => setTripType(e.target.value)}
              sx={{ minWidth: 100, borderBottom: "none !important" }}
              displayEmpty
              open={tripTypeOpen}
              onOpen={() => setTripTypeOpen(true)}
              onClose={() => setTripTypeOpen(false)}
              onFocus={() => setTripTypeFocus(true)}
              onBlur={() => setTripTypeFocus(false)}>
              <MenuItem value="oneway">One-way</MenuItem>
              <MenuItem value="round">Round-trip</MenuItem>
              <MenuItem value="round">Multi-city</MenuItem>
            </Select>
          </FormControl>
          {/* Passengers */}
          <PassengerSelector value={passengerCounts} onChange={setPassengerCounts} />

          {/* Class */}
          <FormControl size="small" variant="standard" sx={classOpen || classFocus ? filledStyle : standardStyle}>
            <Select
              value={flightClass}
              input={<Input disableUnderline />}
              onChange={(e) => setFlightClass(e.target.value)}
              sx={{ minWidth: 120, borderBottom: "none !important" }}
              open={classOpen}
              onOpen={() => setClassOpen(true)}
              onClose={() => setClassOpen(false)}
              onFocus={() => setClassFocus(true)}
              onBlur={() => setClassFocus(false)}>
              {classes.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Main search row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
            position: "relative",
          }}>
          <FlightAutocomplete type="whereFrom" placeholder="From" value={from} onChange={(opt) => setFrom(opt)} />
          {/* Swap button */}
          <IconButton onClick={handleSwap} sx={{ border: "1px solid #e0e0e0", mx: 1 }}>
            <SwapHorizIcon />
          </IconButton>
          {/* To */}

          <FlightAutocomplete
            type="whereTo"
            placeholder="To"
            value={to}
            onChange={(v: LocationOption | null) => v && setTo(v)}
          />
          {/* Date picker */}

          <Box
            sx={{
              px: 2,
              minHeight: 53,
              width: "100%",
              border: "1px solid #6b6b6b",
              borderRadius: 1,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": { borderColor: "#fff" },
            }}
            onClick={() => setDatePickerOpen(true)}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {tripType === "oneway" ? "Departure" : "Departure - Return"}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {getDateRangeText()}
            </Typography>
          </Box>

          <FlightDatePicker
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            selectedDate={departureDate}
            selectedReturnDate={returnDate}
            onDateSelect={(departure, returnDateSelected) => {
              setDepartureDate(departure);
              if (returnDateSelected) {
                setReturnDate(returnDateSelected);
              } else if (tripType === "One way") {
                setReturnDate(null);
              }
            }}
            tripType={tripType.toLowerCase().replace(" ", "-")}
            onTripTypeChange={(type) => {
              const formatted = type === "one-way" ? "One way" : type === "round-trip" ? "Round trip" : "Multi-city";
              handleTripTypeChange(formatted);
            }}
          />
        </Box>

        {/* Floating Search Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            mt: 3,
          }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 8,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              boxShadow: 3,
              position: "absolute",
              top: 8,
              zIndex: 10,
              backgroundColor: "primary.main",
            }}
            startIcon={<CalendarTodayIcon />}>
            Search
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default FlightSearch;
