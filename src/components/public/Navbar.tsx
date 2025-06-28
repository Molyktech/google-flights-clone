import { AppBar, Toolbar, IconButton, Tooltip, Box, Divider, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NightlightIcon from "@mui/icons-material/Nightlight";
import AppsIcon from "@mui/icons-material/Apps";
import GoogleDarkIcon from "../../assets/images/google_logo_dark.svg";
import GoogleLightIcon from "../../assets/images/google_logo_light.svg";
import { useTheme as useThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  return (
    <AppBar
      position="sticky"
      sx={{
        "& .MuiToolbar-root": {
          backgroundColor: isDarkMode ? "#202125" : "white",

          boxShadow: isDarkMode ? "none" : "1px solid #e0e0e0",
        },
      }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" edge="start" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <IconButton sx={{ "&:hover": { backgroundColor: "transparent" } }}>
            <Link to="/">
              <img
                data-test="logo"
                src={isDarkMode ? GoogleDarkIcon : GoogleLightIcon}
                alt="Google Logo"
                style={{
                  marginTop: ".6rem",
                }}
              />
            </Link>
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, sm: 0.5, md: 1.5 },
          }}>
          <Tooltip title={`Change appearance to ${isDarkMode ? "light" : "dark"} mode`}>
            <IconButton
              sx={{ display: "flex", alignItems: "center", color: theme.palette.text.primary, outline: "none" }}
              onClick={toggleTheme}>
              {isDarkMode ? <LightModeOutlinedIcon /> : <NightlightIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Google apps" sx={{ display: { xs: "none", sm: "block" } }}>
            <IconButton sx={{ display: "flex", alignItems: "center" }}>
              <AppsIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            sx={{
              textTransform: "capitalize",
              backgroundColor: theme.palette.primary.main,
            }}>
            Sign in
          </Button>
        </Box>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

export default Navbar;
