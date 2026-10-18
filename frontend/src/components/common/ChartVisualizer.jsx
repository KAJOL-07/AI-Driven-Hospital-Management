import React from "react";

// Capacity Forecast Timeline Chart (24h)
export const CapacityTimelineChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const width = 760;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Min and max for Y scale (e.g. 75% to 100%)
  const minY = 75;
  const maxY = 100;

  const getX = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;

  // Generate upper and lower CI polygon path
  const ciPoints = [
    ...data.map((d, i) => `${getX(i)},${getY(d.upperCI)}`),
    ...data.slice().reverse().map((d, i) => `${getX(data.length - 1 - i)},${getY(d.lowerCI)}`)
  ].join(" ");

  // Generate Predicted path
  const predPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.predictedOccupancy)}`)
    .join(" ");

  // Generate Actual path (only where actualOccupancy exists)
  const actualData = data.filter((d) => d.actualOccupancy !== null);
  const actualPath = actualData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.actualOccupancy)}`)
    .join(" ");

  // 90% Warning Threshold line
  const thresholdY = getY(90);

  return (
    <div className="chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: "250px" }}
      >
        <defs>
          <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="surgeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[80, 85, 90, 95, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontFamily="JetBrains Mono, monospace"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* 90% Capacity Warning Threshold */}
        <line
          x1={padding.left}
          y1={thresholdY}
          x2={width - padding.right}
          y2={thresholdY}
          stroke="#f87171"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
        <text
          x={width - padding.right - 5}
          y={thresholdY - 6}
          textAnchor="end"
          fontSize="10"
          fontWeight="600"
          fill="#ef4444"
        >
          Warning Threshold (90%)
        </text>

        {/* Confidence Interval Shaded Area */}
        <polygon points={ciPoints} fill="url(#ciGradient)" />

        {/* Predicted Line (Dashed) */}
        <path
          d={predPath}
          fill="none"
          stroke="url(#surgeGradient)"
          strokeWidth="2.5"
          strokeDasharray="5 4"
        />

        {/* Actual Observed Line (Solid) */}
        {actualPath && (
          <path
            d={actualPath}
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Data Points */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.predictedOccupancy);
          const isCurrent = d.actualOccupancy !== null;

          return (
            <g key={i}>
              {/* X Axis label */}
              <text
                x={cx}
                y={height - 12}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
                fontWeight={isCurrent ? "700" : "400"}
                fontFamily="JetBrains Mono, monospace"
              >
                {d.time}
              </text>

              {/* Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isCurrent ? 5 : 4}
                fill={isCurrent ? "#0284c7" : "#f59e0b"}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Surge alert icon if critical */}
              {d.surgeRisk === "Critical" && (
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#ef4444"
                >
                  ▲ {d.predictedOccupancy}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="chart-legend flex items-center justify-center gap-6 mt-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-primary rounded-full inline-block" />
          <span>Observed Occupancy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-amber-500 rounded-full inline-block border-b border-dashed" />
          <span>AI Predicted Occupancy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-sky-200 opacity-60 rounded inline-block" />
          <span>95% Confidence Bounds</span>
        </div>
      </div>
    </div>
  );
};

// Ward Occupancy Bar Meter
export const WardOccupancyMeter = ({ wards }) => {
  return (
    <div className="ward-bars-grid space-y-3">
      {wards.slice(0, 6).map((ward) => {
        const pct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
        let color = "#10b981";
        if (pct > 80) color = "#f59e0b";
        if (pct > 88) color = "#ef4444";

        return (
          <div key={ward.id} className="ward-bar-item">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-main">{ward.name}</span>
              <span className="font-mono text-muted">
                <strong>{ward.occupiedBeds}</strong>/{ward.totalBeds} ({pct}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Donut Gauge Component
export const DonutOccupancyMeter = ({ value, label = "Occupancy", size = 130 }) => {
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = "#10b981";
  if (value > 80) color = "#f59e0b";
  if (value > 88) color = "#ef4444";

  return (
    <div className="donut-meter-container" style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        className="donut-label-box"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span className="font-mono text-xl font-bold text-main">{value}%</span>
        <span className="text-xs text-muted">{label}</span>
      </div>
    </div>
  );
};

export default { CapacityTimelineChart, WardOccupancyMeter, DonutOccupancyMeter };
