import React from "react";
import { Chip, Container, Divider, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  Language as LanguageIcon,
  Payments as PaymentsIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const footerData = [
    { label: "Language: English (United Kingdom)", icon: <LanguageIcon /> },
    { label: "Location: United Kingdom", icon: <LocationOnOutlinedIcon /> },
    { label: "Currency: GBP", icon: <PaymentsIcon /> },
  ];

  return (
    <Container maxWidth="lg">
      <Grid
        container
        sx={{
          py: 5,
          gap: 2,
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}>
        <Grid size={12}>
          <Divider sx={{ my: 1, borderColor: theme.palette.text.primary }} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
          {footerData?.map((item, index) => (
            <Chip key={index} label={item?.label} icon={item.icon} variant="outlined" />
          ))}
        </Grid>

        <Grid
          size={{ xs: 12, md: 10 }}
          sx={{
            py: 2,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap",
            flexWrap: "wrap",
            color: theme.palette.primary.main,
          }}>
          {["About", "Privacy", "Terms", "Join user studies", "Feedback", "Help Centre"].map((text, idx) => (
            <Link key={idx} href="#" color={theme.palette.primary.main} underline="hover">
              {text}
            </Link>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <Typography
            sx={{
              fontSize: "15px",
              color: theme.palette.secondary.main,
            }}>
            Displayed currencies may differ from the currencies used to purchase flights.{" "}
            <Link href="#" color={theme.palette.primary.light} sx={{ cursor: "pointer" }}>
              Learn more
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
