import React from "react";

interface FlightsEmptyStateProps {
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const FlightsEmptyState: React.FC<FlightsEmptyStateProps> = ({
  message = "No flights found.",
  onAction,
  actionLabel,
}) => {
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛬</div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#334155" }}>{message}</h2>
      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: "1.5rem",
            background: "#2563eb",
            color: "#fff",
            padding: "0.6rem 1.5rem",
            borderRadius: "999px",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default FlightsEmptyState;
