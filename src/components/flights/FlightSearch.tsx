import { CalendarToday, Search } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LocationOption, PassengerCounts } from "../../lib/models/flight";
import { formatDate, toLocationOptions } from "../../lib/utils";
import { searchAirport } from "../../services/flight-api";
import { MOCK_DATA } from "../../services/mock-data";
import { FlightAutocomplete } from "./FlightAutoComplete";
import FlightDatePicker from "./FlightDatePicker";

const classes = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First",
};

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

interface FlightSearchPrefill {
  tripType?: string;
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infantsSeat?: number;
  infantsLap?: number;
  flightClass?: string;
}

interface FlightSearchProps {
  isDarkMode: boolean;
  prefill?: FlightSearchPrefill;
}

// Module-level cache for LocationOption objects
const locationOptionCache: Record<string, LocationOption> = {};

const getLocationOptionById = (id: string | undefined): LocationOption | null => {
  if (!id) return null;
  if (locationOptionCache[id]) return locationOptionCache[id];
  // fallback to mock data for now
  const options = toLocationOptions(MOCK_DATA.data);
  return options.find((opt) => opt.id === id) || null;
};

const FlightSearch = ({ isDarkMode, prefill }: FlightSearchProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tripType, setTripType] = useState(prefill?.tripType || "oneway");
  const [from, setFrom] = useState<LocationOption | null>(getLocationOptionById(prefill?.from));
  const [to, setTo] = useState<LocationOption | null>(getLocationOptionById(prefill?.to));
  const [passengerCounts, setPassengerCounts] = useState({
    adults: prefill?.adults ?? 1,
    children: prefill?.children ?? 0,
    infantsSeat: prefill?.infantsSeat ?? 0,
    infantsLap: prefill?.infantsLap ?? 0,
  });
  const [flightClass, setFlightClass] = useState(
    prefill?.flightClass && Object.keys(classes).includes(prefill.flightClass) ? prefill.flightClass : "economy",
  );
  const [tripTypeOpen, setTripTypeOpen] = useState(false);
  const [tripTypeFocus, setTripTypeFocus] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [classFocus, setClassFocus] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(
    prefill?.departureDate ? new Date(prefill.departureDate) : null,
  );
  const [returnDate, setReturnDate] = useState<Date | null>(prefill?.returnDate ? new Date(prefill.returnDate) : null);
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback to API if not found in cache or mock data
  useEffect(() => {
    const fetchAndCache = async (id: string, setter: (opt: LocationOption) => void) => {
      if (locationOptionCache[id]) {
        setter(locationOptionCache[id]);
        return;
      }
      const [skyId] = id.split("_");
      const res = await searchAirport(skyId);
      if (res.status && res.data) {
        const options = toLocationOptions(res.data);
        const match = options.find((opt) => opt.id === id);
        if (match) {
          locationOptionCache[id] = match;
          setter(match);
        }
      }
    };
    if (!from && prefill?.from) {
      fetchAndCache(prefill.from, setFrom);
    }
    if (!to && prefill?.to) {
      fetchAndCache(prefill.to, setTo);
    }
    // eslint-disable-next-line
  }, [prefill?.from, prefill?.to]);

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!from || !to || !departureDate) {
        setLoading(false);
        setError("Please select origin, destination, and departure date.");
        return;
      }
      // Cache the selected locations for future prefill
      locationOptionCache[from.id] = from;
      locationOptionCache[to.id] = to;
      // Build query params
      const params = new URLSearchParams({
        tripType,
        from: from.id,
        to: to.id,
        departureDate: formatDate(departureDate),
        ...(tripType === "round" && returnDate ? { returnDate: formatDate(returnDate) } : {}),
        flightClass,
        adults: String(passengerCounts.adults),
        children: String(passengerCounts.children),
        infantsSeat: String(passengerCounts.infantsSeat),
        infantsLap: String(passengerCounts.infantsLap),
      });
      navigate(`/search?${params.toString()}`);
    } catch (err) {
      console.error("Flight search error:", err);
      setError("An error occurred while searching for flights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {loading && <LinearProgress sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 2000 }} />}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          borderRadius: 3,
          maxWidth: 950,
          width: "inherit",
          mx: "auto",
          mt: { xs: 1, sm: 2, md: -7 },
          position: "relative",
          zIndex: 2,
          background: theme.palette.background.paper,
        }}>
        {/* Top controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 2 },
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
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
              <MenuItem value="multi">Multi-city</MenuItem>
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
              {Object.entries(classes).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Main search row */}
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: "wrap", md: "nowrap" },
            flexDirection: { xs: "column", md: "row" },
            position: "relative",
            width: "100%",
          }}>
          <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" }, maxWidth: "100%", minWidth: 0 }}>
            <FlightAutocomplete type="whereFrom" placeholder="From" value={from} onChange={(opt) => setFrom(opt)} />
          </Box>
          {/* Swap button */}
          <IconButton
            onClick={handleSwap}
            sx={{ border: "1px solid #e0e0e0", mx: { xs: 0, md: 1 }, my: { xs: 1, md: 0 } }}>
            <SwapHorizIcon />
          </IconButton>
          {/* To */}
          <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" }, maxWidth: "100%", minWidth: 0 }}>
            <FlightAutocomplete
              type="whereTo"
              placeholder="To"
              value={to}
              onChange={(v: LocationOption | null) => v && setTo(v)}
            />
          </Box>
          {/* Date picker */}
          <Box
            ref={(el: HTMLElement | null) => setDatePickerAnchor(el)}
            sx={{
              px: 2,
              minHeight: 53,
              width: { xs: "90%", md: "auto" },
              maxWidth: { xs: "320px", lg: "100%" },
              border: `1px solid ${isDarkMode ? "#6b6b6b" : "#9a9a9a"}`,
              borderRadius: 1,
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: { xs: 1, md: 0 },
              minWidth: 0,
              "&:hover": {
                borderColor: isDarkMode ? "#fff" : "#9a9a9a",
              },
            }}
            onClick={() => setDatePickerOpen(true)}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ fontSize: 20, mr: 1 }} />
              {getDateRangeText() === "" && (
                <Typography variant="caption" color="text.secondary">
                  {tripType === "oneway" ? "Departure" : "Departure - Return"}
                </Typography>
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {getDateRangeText()}
              </Typography>
            </Box>
          </Box>
          <FlightDatePicker
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            anchorEl={datePickerAnchor}
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
              handleTripTypeChange(type);
            }}
            searchParams={{
              originSkyId: from?.skyId,
              destinationSkyId: to?.skyId,
              originEntityId: from?.entityId,
              destinationEntityId: to?.entityId,
            }}
            showPrices={true}
            fetchPrices={true}
          />
        </Box>

        {/* Floating Search Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            mt: { xs: 2, md: 3 },
            width: "100%",
          }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 8,
              px: { xs: 2, md: 3 },
              py: 1.2,
              fontWeight: 600,
              boxShadow: 3,
              position: { xs: "static", md: "absolute" },
              top: { md: 8 },
              zIndex: 10,
              backgroundColor: "primary.main",
              width: { xs: "100%", sm: "auto" },
              maxWidth: 320,
            }}
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={loading}>
            Explore
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default FlightSearch;
