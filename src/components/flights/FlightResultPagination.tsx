import React from "react";
import { Box, Pagination, Button } from "@mui/material";

interface FlightResultPaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  mode?: "pagination" | "loadMore";
}

const FlightResultPagination: React.FC<FlightResultPaginationProps> = ({
  count,
  page,
  pageSize,
  onPageChange,
  mode = "pagination",
}) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  if (mode === "loadMore") {
    const hasMore = page * pageSize < count;
    return hasMore ? (
      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="outlined" onClick={() => onPageChange(page + 1)}>
          View more flights
        </Button>
      </Box>
    ) : null;
  }

  return (
    <Box display="flex" justifyContent="center" mt={3}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
};

export default FlightResultPagination;
