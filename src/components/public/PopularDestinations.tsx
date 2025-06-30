import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip } from "@mui/material";

const destinations = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    price: "$542",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "City of Light",
  },
  {
    id: 2,
    city: "Tokyo",
    country: "Japan",
    price: "$789",
    image: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Modern metropolis",
  },
  {
    id: 3,
    city: "London",
    country: "United Kingdom",
    price: "$623",
    image: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Historic capital",
  },
  {
    id: 4,
    city: "New York",
    country: "United States",
    price: "$321",
    image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The Big Apple",
  },
  {
    id: 5,
    city: "Dubai",
    country: "UAE",
    price: "$856",
    image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Luxury destination",
  },
  {
    id: 6,
    city: "Sydney",
    country: "Australia",
    price: "$967",
    image: "https://images.pexels.com/photos/783682/pexels-photo-783682.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Harbor city",
  },
];

const PopularDestinations: React.FC = () => {
  return (
    <Box sx={{ py: 8, px: 2, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 1,
          fontWeight: 400,
          color: "text.primary",
          textAlign: "center",
        }}>
        Popular destinations
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "text.secondary",
          textAlign: "center",
        }}>
        Discover trending destinations for your next getaway
      </Typography>

      <Grid container spacing={3}>
        {destinations.map((destination) => (
          <Grid key={destination.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}>
              <CardMedia
                component="img"
                height="200"
                image={destination.image}
                alt={destination.city}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                      {destination.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {destination.country}
                    </Typography>
                  </Box>
                  <Chip label={destination.price} color="primary" size="small" sx={{ fontWeight: 500 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {destination.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularDestinations;
