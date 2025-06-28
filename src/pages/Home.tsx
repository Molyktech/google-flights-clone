import { Box, Container } from "@mui/material";
import FlightSearch from "../components/flights/FlightSearch";
import Hero from "../components/public/Hero";
import { useTheme as useThemeContext } from "../context/ThemeContext";

const Home = () => {
  const { isDarkMode } = useThemeContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <Hero isDarkMode={isDarkMode} />
      <Box sx={{ maxWidth: 1024, display: "flex", flexDirection: "column", width: "100%" }}>
        <FlightSearch />
      </Box>
    </Container>
  );
};

export default Home;
