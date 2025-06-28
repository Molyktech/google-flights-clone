import { createTheme } from "@mui/material/styles";
export const createCustomTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
      secondary: { main: "#4caf50", light: "#81c784", dark: "#388e3c" },
      background: {
        default: isDark ? "#202124" : "#ffffff",
        paper: isDark ? "#1e2328" : "#ffffff",
      },
      text: {
        primary: isDark ? "#e8eaed" : "#202124",
        secondary: isDark ? "#9aa0a6" : "#5f6368",
      },
      divider: isDark ? "#3c4043" : "#e0e0e0",
    },
    typography: {
      fontFamily: '"Google Sans","Roboto","Arial",sans-serif',
      h6: { fontWeight: 500 },
      body1: { fontSize: "0.875rem" },
      body2: { fontSize: "0.75rem" },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 24, fontWeight: 500 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 16, fontWeight: 500 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  });
