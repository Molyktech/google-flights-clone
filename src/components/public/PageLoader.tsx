import React from "react";
import { Box } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const PageLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        zIndex: 2000,
      }}>
      <FlightTakeoffIcon
        sx={{
          fontSize: 80,
          color: "primary.main",
          animation: "fly 1.2s infinite cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <style>
        {`
          @keyframes fly {
            0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0.7; }
            30% { transform: translateY(-20px) scale(1.1) rotate(-5deg); opacity: 1; }
            60% { transform: translateY(-40px) scale(1.15) rotate(0deg); opacity: 1; }
            100% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 0.7; }
          }
        `}
      </style>
    </Box>
  );
};

export default PageLoader;
