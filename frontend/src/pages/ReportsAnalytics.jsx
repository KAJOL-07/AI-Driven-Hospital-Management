import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  FileBarChart,
  Download,
  Printer,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const ReportsAnalytics = () => {
  const { metrics, wards, addToast } = useHospital();
  const [reportDate, setReportDate] = useState("Today (Live Census)");

  const handleExportCSV = () => {
    addToast("Report Exported", "Hospital Census CSV report downloaded successfully.", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-analytics-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Hospital Executive Intelligence</span>
              <span className="text-xs text-muted font-mono">Operations Audit Trail</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Bed Capacity, Turnover & Operational Reports
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Auditable clinical metrics: Average Length of Stay (ALOS), bed turnover velocity, AI capacity forecasting variance, and admission-discharge census.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-secondary btn-md" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print Census</span>
            </button>
            <button className="btn btn-primary btn-md" onClick={handleExportCSV}>
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Analytic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-muted uppercase">Average Bed Turnover</span>
            <span className="badge badge-available text-[11px]">Optimal</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-main">28 Mins</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight size={13} /> -12m vs regional baseline
          </span>
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-muted uppercase">Avg Length of Stay (ALOS)</span>
            <span className="badge badge-ai text-[11px]">AI Optimized</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-main">3.8 Days</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight size={13} /> 0.4 days shorter via early step-downs
          </span>
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-muted uppercase">AI Model Accuracy</span>
            <span className="badge badge-ai text-[11px]">ARIMA-X</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-primary">99.4%</div>
          <span className="text-xs text-muted mt-1 block">Variance: ± 1.2%</span>
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-muted uppercase">Transfer Efficiency</span>
            <span className="badge badge-available text-[11px]">Active</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">18.5 Mins</div>
          <span className="text-xs text-muted mt-1 block">Request-to-Bed Transit Velocity</span>
        </div>
      </div>

      {/* Hospital Census Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileBarChart size={18} className="text-primary" />
              <span>Ward-Level Capacity Census Breakdown</span>
            </div>
            <p className="text-xs text-muted mt-0.5">Summary of all clinical operational units</p>
          </div>
          <span className="badge badge-ai">Live Census Audit</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ward Code & Name</th>
                <th>Total Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Sanitizing</th>
                <th>Occupancy %</th>
                <th>Nurse Load</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((w) => {
                const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);
                return (
                  <tr key={w.id}>
                    <td>
                      <div className="font-bold text-main">{w.name}</div>
                      <div className="text-xs text-muted font-mono">{w.floor}</div>
                    </td>
                    <td className="font-mono font-semibold">{w.totalBeds}</td>
                    <td className="font-mono font-semibold text-blue-600">{w.occupiedBeds}</td>
                    <td className="font-mono font-semibold text-emerald-600">{w.availableBeds}</td>
                    <td className="font-mono font-semibold text-amber-600">{w.cleaningBeds}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs">{pct}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct > 88 ? "#ef4444" : pct > 80 ? "#f59e0b" : "#10b981"
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-xs font-mono">{w.nurseToPatientRatio}</td>
                    <td>
                      <span
                        className={`badge ${pct > 88 ? "badge-critical" : pct > 80 ? "badge-cleaning" : "badge-available"}`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
