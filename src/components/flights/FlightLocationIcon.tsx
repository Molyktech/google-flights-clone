import { Flight as FlightIcon } from "@mui/icons-material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import type { JSX } from "react";

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
