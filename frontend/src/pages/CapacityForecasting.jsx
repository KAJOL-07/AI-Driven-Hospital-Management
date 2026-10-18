import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { CapacityTimelineChart } from "../components/common/ChartVisualizer";
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sun,
  Activity,
  Layers
} from "lucide-react";

const CapacityForecasting = () => {
  const {
    forecastTimeline,
    sevenDayForecast,
    wards,
    metrics,
    emergencySurgeActive,
    toggleEmergencySurge
  } = useHospital();

  const [timeHorizon, setTimeHorizon] = useState("24h"); // 24h, 48h, 7d
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshForecast = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="capacity-forecasting-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">
                <Sparkles size={13} />
                Predictive AI Engine v3.2
              </span>
              <span className="text-xs text-muted font-mono">Last Synchronized: Real-Time</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Hospital Bed Capacity & Surge Forecasting
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Real-time predictive forecasting using ARIMA time-series regression and historical emergency intake patterns to prevent ward overflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                className={`btn btn-sm ${timeHorizon === "24h" ? "btn-primary" : "btn-secondary bg-transparent border-0"}`}
                onClick={() => setTimeHorizon("24h")}
              >
                24 Hours
              </button>
              <button
                className={`btn btn-sm ${timeHorizon === "48h" ? "btn-primary" : "btn-secondary bg-transparent border-0"}`}
                onClick={() => setTimeHorizon("48h")}
              >
                48 Hours
              </button>
              <button
                className={`btn btn-sm ${timeHorizon === "7d" ? "btn-primary" : "btn-secondary bg-transparent border-0"}`}
                onClick={() => setTimeHorizon("7d")}
              >
                7 Days
              </button>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRefreshForecast}
              disabled={isRefreshing}
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              <span>Recalibrate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Bottleneck Alert Card */}
      <div className="card p-5 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-amber-900">
                Predicted Peak Surge Bottleneck at 16:00 (93% Occupancy)
              </h3>
              <span className="badge badge-critical">Code Yellow Warning</span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Based on ambient weather factors (high humidity / AQI spike) and afternoon emergency triage volume, Medical ICU and Emergency Trauma will experience peak inflow.
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200 flex flex-wrap items-center gap-4 text-xs font-semibold text-amber-950">
              <span>Proactive Mitigation:</span>
              <span className="bg-white/80 px-2.5 py-1 rounded border border-amber-300">
                1. Accelerate 4 planned step-downs from CCU to General Ward
              </span>
              <span className="bg-white/80 px-2.5 py-1 rounded border border-amber-300">
                2. Reserve 3 emergency overflow beds in SICU
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="card p-6">
        <div className="card-header">
          <div>
            <div className="card-title">
              <TrendingUp size={18} className="text-primary" />
              <span>Projected Bed Capacity Trajectory ({timeHorizon === "7d" ? "7-Day Window" : "Next 24-Hour Horizon"})</span>
            </div>
            <p className="text-xs text-muted">
              Solid line: observed occupancy • Dashed line: AI forecast • Blue shaded area: 95% Confidence Bounds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Current Load:</span>
            <span className="font-mono font-bold text-sm text-primary">{metrics.occupancyRate}%</span>
          </div>
        </div>

        <div className="py-2">
          <CapacityTimelineChart data={forecastTimeline} />
        </div>

        {/* Forecast Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted block">Estimated Inflow</span>
            <span className="text-xl font-extrabold font-mono text-sky-600">+64 Patients</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Next 24 Hours</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted block">Estimated Discharges</span>
            <span className="text-xl font-extrabold font-mono text-emerald-600">-38 Patients</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Discharge Pipeline</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted block">Peak ICU Pressure</span>
            <span className="text-xl font-extrabold font-mono text-rose-600">96.5%</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Expected at 16:00</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-muted block">Surge Reserve Status</span>
            <span className="text-xl font-extrabold font-mono text-indigo-600">6 Buffer Beds</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Ready for Deployment</span>
          </div>
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Calendar size={18} className="text-primary" />
            <span>7-Day Predictive Ward Capacity Outlook</span>
          </div>
          <span className="badge badge-ai">Multi-Variable Weather & Epidemic Correlation</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Projected Occupancy</th>
                <th>ICU Expected Load</th>
                <th>Surge Risk Index</th>
                <th>Environmental Factors</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {sevenDayForecast.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-main">{item.day}</td>
                  <td>
                    <span className="font-mono font-bold text-sm text-slate-800">
                      {item.projectedOccupancy}%
                    </span>
                  </td>
                  <td>
                    <span className={`font-mono font-bold text-sm ${item.icuLoad > 90 ? "text-rose-600" : "text-slate-800"}`}>
                      {item.icuLoad}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.surgeIndex.includes("Critical") ? "badge-critical" : item.surgeIndex.includes("High") ? "badge-cleaning" : "badge-available"}`}>
                      {item.surgeIndex}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Sun size={13} className="text-amber-500" />
                      {item.weatherFactor}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CapacityForecasting;
