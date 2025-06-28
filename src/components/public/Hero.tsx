import { Box, Typography } from "@mui/material";
import heroDark from "../../assets/images/hero_dark.svg";
import heroLight from "../../assets/images/hero_light.svg";

const Hero = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: 220, md: 320 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}>
      <img
        src={isDarkMode ? heroDark : heroLight}
        alt="Flights Illustration"
        style={{ width: "100%", height: "auto" }}
      />

      <Typography
        variant="h2"
        fontWeight={700}
        color="text.primary"
        sx={{
          mb: 1,
          textAlign: "center",
          fontSize: { xs: 32, md: 48 },
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
        Flights
      </Typography>
    </Box>
  );
};

export default Hero;
