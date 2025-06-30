import React from "react";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const filterLabels = ["Stops", "Airlines", "Bags", "Price", "Times", "Emissions", "Connecting airports", "Duration"];

const FlightFilters: React.FC = () => {
  // For demo, all menus are closed. You can add state for each filter if needed.
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1, sm: 1.5 },
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 1 },
        borderBottom: "2px solid #e3e6e8",
        bgcolor: "background.paper",
        overflowX: "auto",
        whiteSpace: "nowrap",
        width: "100%",
        minHeight: 56,
        flexWrap: "wrap",
      }}>
      <Button
        startIcon={<FilterListIcon sx={{ fontSize: 20 }} />}
        sx={{ color: "#1967d2", fontWeight: 500, minWidth: 0, px: 1.5 }}
        size="small">
        All filters
      </Button>
      {filterLabels.map((label) => (
        <Button
          key={label}
          variant="outlined"
          size="small"
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            textTransform: "none",
            bgcolor: "background.paper",
            borderColor: "#e3e6e8",
            color: "text.primary",
            minWidth: { xs: 90, sm: 120 },
            px: { xs: 1, sm: 2 },
            "&:hover": { borderColor: "#b3b3b3", bgcolor: "#f5f7fa" },
          }}>
          {label}
        </Button>
      ))}
    </Box>
  );
};

export default FlightFilters;
