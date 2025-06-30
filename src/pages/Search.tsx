import React from "react";
import { useLocation } from "react-router-dom";
import FlightSearch from "../components/flights/FlightSearch";
import FlightResult from "../components/flights/FlightResult";
import { parseSearchParams } from "../lib/utils";

const Search: React.FC = () => {
  const location = useLocation();
  const prefill = parseSearchParams(location.search);
  return (
    <div style={{ padding: "6rem 0" }}>
      <FlightSearch isDarkMode={false} prefill={prefill} />
      <FlightResult searchParams={prefill} />
    </div>
  );
};

export default Search;
