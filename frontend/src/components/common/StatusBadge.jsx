import React from "react";

export const BedStatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case "available":
        return { label: "Available", className: "badge-available", dot: "#10b981" };
      case "occupied":
        return { label: "Occupied", className: "badge-occupied", dot: "#3b82f6" };
      case "cleaning":
        return { label: "Sanitizing", className: "badge-cleaning", dot: "#f59e0b" };
      case "maintenance":
        return { label: "Maintenance", className: "badge-maintenance", dot: "#64748b" };
      case "isolation":
        return { label: "Isolation", className: "badge-isolation", dot: "#8b5cf6" };
      case "reserved":
        return { label: "Reserved", className: "badge-ai", dot: "#6366f1" };
      default:
        return { label: status || "Unknown", className: "badge-secondary", dot: "#94a3b8" };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      <span className="badge-dot" style={{ backgroundColor: config.dot }} />
      {config.label}
    </span>
  );
};

export const PatientAcuityBadge = ({ acuity, score }) => {
  const getAcuityConfig = () => {
    if (score === 1 || acuity?.toLowerCase().includes("critical") || acuity?.toLowerCase().includes("level 1")) {
      return { label: "Level 1: Critical", className: "badge-critical", dot: "#ef4444" };
    }
    if (score === 2 || acuity?.toLowerCase().includes("severe") || acuity?.toLowerCase().includes("level 2")) {
      return { label: "Level 2: Severe", className: "badge-cleaning", dot: "#f59e0b" };
    }
    if (score === 3 || acuity?.toLowerCase().includes("moderate") || acuity?.toLowerCase().includes("level 3")) {
      return { label: "Level 3: Moderate", className: "badge-occupied", dot: "#3b82f6" };
    }
    return { label: "Level 4: Stable", className: "badge-available", dot: "#10b981" };
  };

  const config = getAcuityConfig();

  return (
    <span className={`badge ${config.className}`}>
      <span className="badge-dot" style={{ backgroundColor: config.dot }} />
      {config.label}
    </span>
  );
};

export const TransferStatusBadge = ({ status }) => {
  let className = "badge-available";
  if (status.includes("Approved") || status.includes("Reserved")) className = "badge-ai";
  if (status.includes("Transit")) className = "badge-cleaning";
  if (status.includes("Pending") || status.includes("Awaiting")) className = "badge-occupied";
  if (status.includes("Completed")) className = "badge-available";

  return (
    <span className={`badge ${className}`}>
      {status}
    </span>
  );
};

export default { BedStatusBadge, PatientAcuityBadge, TransferStatusBadge };
