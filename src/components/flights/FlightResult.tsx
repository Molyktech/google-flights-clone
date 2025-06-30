import React, { useState } from "react";
import FlightFilters from "./FlightFilters";
import FlightResultList from "./FlightResultList";
import FlightResultPagination from "./FlightResultPagination";
import { searchFlightsComplete } from "../../services/flight-api";
import type { Itinerary, SearchFlightResponse } from "../../lib/models/flight";
import { formatToISODateString } from "../../lib/utils";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FlightsEmptyState from "./FlightsEmptyState";

interface FlightResultProps {
  searchParams: {
    tripType?: string;
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    infantsSeat?: number;
    infantsLap?: number;
    flightClass?: string;
  };
}

const PAGE_SIZE = 4;

const FlightResult: React.FC<FlightResultProps> = ({ searchParams }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  React.useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
          setError("Missing search parameters.");
          setItineraries([]);
          setLoading(false);
          return;
        }
        const res: SearchFlightResponse = await searchFlightsComplete({
          originSkyId: searchParams.from.split("_")[0],
          destinationSkyId: searchParams.to.split("_")[0],
          originEntityId: searchParams.from.split("_")[1],
          destinationEntityId: searchParams.to.split("_")[1],
          date: formatToISODateString(searchParams.departureDate) || "",
          returnDate: formatToISODateString(searchParams.returnDate) || undefined,
          cabinClass: searchParams.flightClass || "economy",
          adults: searchParams.adults || 1,
          // Optionally add children, infants, etc.
        });
        if (res.status === false) {
          let errorMsg: string | undefined;
          const msg = (res as unknown as { message?: unknown }).message;
          if (typeof msg === "string") {
            errorMsg = msg;
          } else if (Array.isArray(msg)) {
            const firstError = msg[0];
            errorMsg =
              typeof firstError === "string"
                ? firstError
                : typeof firstError === "object" && firstError !== null
                  ? (Object.values(firstError)[0] as string)
                  : "Unknown error";
          }
          if (errorMsg) {
            setError(errorMsg);
            setSnackbarOpen(true);
            setItineraries([]);
            setLoading(false);
            return;
          }
        }
        const data = res.data as SearchFlightResponse["data"];
        if (res.status && data && !Array.isArray(data) && data.itineraries) {
          setItineraries(data.itineraries);
        } else {
          setError("No results found.");
        }
      } catch {
        setError("Failed to fetch flight results.");
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [searchParams]);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, itineraries.length));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setError(null);
  };

  if (loading) return <div style={{ padding: "3rem 0", textAlign: "center" }}>Loading flights…</div>;
  if (error && itineraries.length === 0)
    return (
      <>
        <FlightsEmptyState message={error} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity="error" onClose={handleSnackbarClose} sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </>
    );

  return (
    <div style={{ padding: "3rem 0", width: "100%", maxWidth: "100%", margin: "0 auto" }}>
      <FlightFilters />
      <FlightResultList itineraries={itineraries} page={1} pageSize={visibleCount} />
      <FlightResultPagination
        count={itineraries.length}
        page={1}
        pageSize={visibleCount}
        onPageChange={handleViewMore}
        mode="loadMore"
      />
    </div>
  );
};

export default FlightResult;
