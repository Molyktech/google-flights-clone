import React, { useState } from "react";
import FlightResultCard from "./FlightResultCard";
import type { Itinerary } from "../../lib/models/flight";

interface FlightResultListProps {
  itineraries: Itinerary[];
  page: number;
  pageSize: number;
}

const FlightResultList: React.FC<FlightResultListProps> = ({ itineraries, page, pageSize }) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedItineraries = itineraries.slice(startIdx, endIdx);

  return (
    <div style={{ padding: "0", margin: 0 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
          padding: "16px 0 0 0",
        }}>
        {pagedItineraries.map((itinerary) => (
          <FlightResultCard
            key={itinerary.id}
            itinerary={itinerary}
            expanded={expanded === itinerary.id}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? itinerary.id : false)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlightResultList;
