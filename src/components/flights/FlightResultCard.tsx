import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import type { Itinerary } from "../../lib/models/flight";

interface FlightResultCardProps {
  itinerary: Itinerary;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ itinerary, expanded, onChange }) => {
  const mainLeg = itinerary.legs[0];
  const returnLeg = itinerary.legs[1];
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      sx={{
        mb: 2,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "none",
        border: "1px solid #e3e6e8",
        "&.Mui-expanded, &.Mui-focused, &.MuiAccordion-root:focus, &.MuiAccordion-root:focus-visible": {
          boxShadow: "none",
          outline: "none",
          borderColor: "#e3e6e8",
        },
        "& .MuiAccordionSummary-root": {
          outline: "none",
        },
        "& .MuiAccordionSummary-root:focus, & .MuiAccordionSummary-root:focus-visible": {
          outline: "none",
        },
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ bgcolor: "background.paper", px: { xs: 1, md: 3 }, py: { xs: 1, md: 2 } }}>
        <Grid container alignItems="center" spacing={{ xs: 2, md: 2 }} sx={{ width: "100%" }}>
          {/* First column: displayCode and name, always visible */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <FlightTakeoffIcon color="primary" />
              <Typography fontWeight={600} fontSize={{ xs: 16, md: 18 }} sx={{ whiteSpace: "nowrap" }}>
                {mainLeg.origin.displayCode} - {mainLeg.destination.displayCode}
              </Typography>
            </Box>
            <Tooltip title={mainLeg.origin.name + " → " + mainLeg.destination.name} placement="top" arrow>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: { xs: "none", sm: "block" },
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {mainLeg.origin.name} → {mainLeg.destination.name}
              </Typography>
            </Tooltip>
          </Grid>
          {/* Remaining columns, spaced out */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }} sx={{ ml: { md: 2 } }}>
            <Typography fontWeight={500} fontSize={{ xs: 15, md: 16 }}>
              {mainLeg.departure.slice(11, 16)} - {mainLeg.arrival.slice(11, 16)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.floor(mainLeg.durationInMinutes / 60)} hrs {mainLeg.durationInMinutes % 60} min
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography fontWeight={500} fontSize={{ xs: 15, md: 16 }}>
              {mainLeg.stopCount === 0 ? "Non-stop" : `${mainLeg.stopCount} stop${mainLeg.stopCount > 1 ? "s" : ""}`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <Typography fontWeight={500} fontSize={{ xs: 15, md: 16 }} color="primary.main">
              {itinerary.price.formatted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              round trip
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <Typography fontWeight={500} fontSize={{ xs: 15, md: 16 }}>
              554 kg CO2e
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +10% emissions
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.default", px: { xs: 1, md: 3 }, py: { xs: 1, md: 2 } }}>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Flight details
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Outbound:
            </Typography>
            <Typography variant="body2">
              {mainLeg.origin.name} → {mainLeg.destination.name} ({mainLeg.departure.slice(0, 10)})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mainLeg.departure.slice(11, 16)} - {mainLeg.arrival.slice(11, 16)} |{" "}
              {mainLeg.carriers.marketing[0]?.name}
            </Typography>
          </Box>
          {returnLeg && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight={500}>
                Return:
              </Typography>
              <Typography variant="body2">
                {returnLeg.origin.name} → {returnLeg.destination.name} ({returnLeg.departure.slice(0, 10)})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {returnLeg.departure.slice(11, 16)} - {returnLeg.arrival.slice(11, 16)} |{" "}
                {returnLeg.carriers.marketing[0]?.name}
              </Typography>
            </Box>
          )}
        </Box>
        <Button variant="contained" color="primary" sx={{ mt: 2, width: { xs: "100%", sm: "auto" } }}>
          Select flight
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightResultCard;
