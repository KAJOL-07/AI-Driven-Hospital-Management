import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  total = null,
  unit = "",
  icon: Icon,
  trend = null, // e.g. { value: "+4.2%", isPositive: true, text: "vs yesterday" }
  badge = null,
  colorScheme = "primary", // primary, success, danger, warning, purple
  onClick = null
}) => {
  return (
    <div
      className={`stat-card stat-card-${colorScheme} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <div className="stat-value-row">
            <span className="stat-value font-mono">{value}</span>
            {total !== null && (
              <span className="stat-total font-mono">/ {total}</span>
            )}
            {unit && <span className="stat-unit">{unit}</span>}
          </div>
        </div>
        <div className={`stat-icon-box stat-icon-${colorScheme}`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="stat-card-bottom">
        {trend && (
          <div className={`stat-trend ${trend.isPositive ? "trend-up" : "trend-down"}`}>
            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend.value}</span>
            <span className="trend-label text-muted">{trend.text}</span>
          </div>
        )}
        {badge && (
          <span className={`badge badge-${badge.type || "neutral"}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
