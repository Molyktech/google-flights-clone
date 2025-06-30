import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const background = isDarkMode
    ? "linear-gradient(135deg, #18181b 0%, #27272a 100%)"
    : "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)";
  const headingColor = isDarkMode ? "#f1f5f9" : "#1e293b";
  const textColor = isDarkMode ? "#cbd5e1" : "#64748b";
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background,
        padding: "2rem",
      }}>
      <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>🛫</div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: headingColor, marginBottom: "0.5rem" }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: "1.25rem", color: textColor, marginBottom: "2rem", textAlign: "center", maxWidth: 400 }}>
        Oops! The page you are looking for doesn&apos;t exist or has been moved.
        <br />
        Let&apos;s get you back to exploring flights!
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          background: isDarkMode ? "#2563eb" : "#2563eb",
          color: "#fff",
          padding: "0.75rem 2rem",
          borderRadius: "999px",
          fontSize: "1rem",
          fontWeight: 600,
          border: "none",
          boxShadow: isDarkMode ? "0 2px 8px rgba(37,99,235,0.15)" : "0 2px 8px rgba(37,99,235,0.08)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
