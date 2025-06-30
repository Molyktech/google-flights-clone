import { AttachMoney, Cancel, CheckCircle, ExpandMore, Schedule, TrendingDown } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { destinations, popularDestinations, faqs, flightRoutes } from "../../lib/constants/flights";

const usefulTools = [
  {
    icon: <TrendingDown color="primary" />,
    title: "Find the cheapest days to fly",
    description: "Use price prediction and historical data to find the cheapest time to book your flight.",
  },
  {
    icon: <AttachMoney color="primary" />,
    title: "See how prices compare with other booking sites",
    description: "Price history and trend data show you when to wait and when to book.",
  },
  {
    icon: <Schedule color="primary" />,
    title: "Track prices for a trip",
    description: "Get notified when prices drop for routes or flights you're interested in.",
  },
];

const FlightDeals: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [, setSelectedDestination] = useState<number | null>(null);
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        {/* Header */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 400,
            color: "white",
          }}>
          Find cheap flights from Lagos to anywhere
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12 }}>
            <Paper
              sx={{
                height: 400,

                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="%23334155" stroke-width="0.5"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%" height="100%" fill="url(%23grid)" /%3E%3C/svg%3E")',
              }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}>
                <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>
                  Interactive World Map
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Explore destinations
                </Typography>
              </Box>

              {/* Sample destination markers */}
              <Box sx={{ position: "absolute", top: "30%", left: "20%" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#22c55e",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box sx={{ position: "absolute", top: "40%", left: "60%" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#22c55e",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box sx={{ position: "absolute", top: "60%", left: "45%" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: "#ef4444",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, width: "100%" }}>
              {destinations.map((destination) => (
                <Card
                  key={destination.id}
                  sx={{
                    bgcolor: "transparent",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                    "&:hover": {
                      bgcolor: "#334155",
                      transform: "translateY(-1px)",
                    },
                  }}
                  onClick={() => setSelectedDestination(destination.id)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ height: 120, objectFit: "cover" }}
                      image={destination.image}
                      alt={destination.city}
                    />
                    <CardContent sx={{ flex: 1, py: 1, px: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {destination.city}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                        {destination.country}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
                        {destination.duration}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#22c55e", fontWeight: 500, mt: 0.5 }}>
                        {destination.price}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Useful Tools Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 4, fontWeight: 400 }}>
            Useful tools to help you find the best deals
          </Typography>

          <Grid container spacing={3} sx={{ mb: 8 }}>
            {usefulTools.map((tool, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: isDarkMode ? "#1e293b" : "#ffffff",

                    border: "none",
                    boxShadow: "none",
                  }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>{tool.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                        {tool.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        {tool.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Insightful Tools Info */}
          <Paper
            sx={{
              p: 3,
              mt: 3,
              boxShadow: "none",
              border: "none",
            }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Insightful tools help you choose your trip dates
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
              Save money on flights with our prediction tools - you&#39;ll know whether to book or wait for a better
              deal.
            </Typography>
            <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Cancel sx={{ color: "#ef4444", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Wait
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "#22c55e", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Book now
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Popular Destinations */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 4, fontWeight: 400, color: "white" }}>
            Popular destinations from Lagos
          </Typography>

          <Grid container spacing={2}>
            {popularDestinations.map((dest, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                <Card
                  sx={{
                    bgcolor: isDarkMode ? "#1e293b" : "#ffffff",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    position: "relative",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                    border: "none",
                    boxShadow: "none",
                  }}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={dest.image}
                      alt={dest.city}
                      sx={{ objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(30, 35, 43, 0.4)",
                        color: "#fff",
                        py: 0.5,
                        px: 1,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}>
                      {dest.city}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 4, fontWeight: 400, color: theme.palette.text.primary }}>
            Frequently asked questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                bgcolor: "transparent",
                color: theme.palette.text.primary,
                mb: 1,
                "&:before": { display: "none" },
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
                outline: "none",
                "&:focus": {
                  outline: "none",
                },
                "&.Mui-expanded": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}>
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: theme.palette.text.primary }} />}
                sx={{
                  "& .MuiAccordionSummary-content": { margin: "12px 0" },
                  outline: "none",
                  boxShadow: "none",
                  "&:focus": { outline: "none" },
                }}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Popular Routes */}
        <Box>
          <Typography variant="h5" component="h3" sx={{ mb: 4, fontWeight: 400, color: "white" }}>
            Find cheap flights on popular routes
          </Typography>

          <Grid container spacing={2}>
            {flightRoutes.map((route, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Link
                  href="#"
                  sx={{
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}>
                  {route}
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FlightDeals;
