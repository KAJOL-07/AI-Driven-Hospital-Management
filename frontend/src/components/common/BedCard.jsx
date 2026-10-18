import React from "react";
import { BedStatusBadge } from "./StatusBadge";
import {
  BedDouble,
  Wind,
  Activity,
  ShieldAlert,
  Sparkles,
  User,
  MoreVertical,
  Wrench,
  Sparkle
} from "lucide-react";

const BedCard = ({
  bed,
  patient = null,
  onSelect = null,
  onAllocate = null,
  onDischarge = null,
  onStatusChange = null
}) => {
  const isAvailable = bed.status === "available";
  const isOccupied = bed.status === "occupied";
  const isCleaning = bed.status === "cleaning";
  const isMaintenance = bed.status === "maintenance";
  const isIsolation = bed.status === "isolation";

  const hasVentilator = bed.equipment.some((e) => e.toLowerCase().includes("ventilator") || e.toLowerCase().includes("bipap"));
  const hasMonitor = bed.equipment.some((e) => e.toLowerCase().includes("monitor") || e.toLowerCase().includes("telemetry"));
  const hasNegativePressure = bed.equipment.some((e) => e.toLowerCase().includes("negative pressure") || e.toLowerCase().includes("hepa"));

  return (
    <div
      className={`bed-tile-card bed-status-${bed.status} ${isAvailable ? "is-available" : ""}`}
      onClick={() => onSelect && onSelect(bed)}
    >
      {/* Top row */}
      <div className="bed-tile-header">
        <div className="bed-number-box">
          <BedDouble size={16} className="bed-icon" />
          <span className="bed-id font-mono">{bed.id}</span>
        </div>
        <BedStatusBadge status={bed.status} />
      </div>

      {/* Ward and Floor */}
      <div className="bed-location-info">
        <span className="bed-ward-name">{bed.wardName}</span>
        <span className="bed-floor-text text-muted">{bed.floor}</span>
      </div>

      {/* Patient info if occupied */}
      {isOccupied && patient && (
        <div className="bed-patient-badge">
          <div className="patient-avatar-mini">
            <User size={13} />
          </div>
          <div className="patient-mini-meta">
            <span className="patient-mini-name">{patient.name}</span>
            <span className="patient-mini-diag text-muted truncate" title={patient.diagnosis}>
              {patient.diagnosis}
            </span>
          </div>
        </div>
      )}

      {/* Available banner if free */}
      {isAvailable && (
        <div className="bed-available-callout">
          <Sparkles size={14} className="text-emerald-500" />
          <span>Ready for Rapid Allocation</span>
        </div>
      )}

      {/* Sanitizing banner */}
      {isCleaning && (
        <div className="bed-cleaning-callout">
          <Sparkle size={14} className="text-amber-500" />
          <span>Sanitization in progress</span>
        </div>
      )}

      {/* Maintenance banner */}
      {isMaintenance && (
        <div className="bed-maintenance-callout">
          <Wrench size={14} className="text-slate-500" />
          <span>Engineering Check</span>
        </div>
      )}

      {/* Equipment tags */}
      <div className="bed-equipment-row">
        {hasVentilator && (
          <span className="equip-chip" title="Ventilator Equipped">
            <Wind size={12} className="text-blue-500" />
            <span>Ventilator</span>
          </span>
        )}
        {hasMonitor && (
          <span className="equip-chip" title="Continuous Cardiac Monitor">
            <Activity size={12} className="text-rose-500" />
            <span>Monitor</span>
          </span>
        )}
        {hasNegativePressure && (
          <span className="equip-chip" title="Negative Pressure Suite">
            <ShieldAlert size={12} className="text-purple-500" />
            <span>Negative P.</span>
          </span>
        )}
      </div>

      {/* Quick footer action button */}
      <div className="bed-tile-footer" onClick={(e) => e.stopPropagation()}>
        {isAvailable && onAllocate && (
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={() => onAllocate(bed)}
          >
            <Sparkles size={13} />
            <span>Assign Patient</span>
          </button>
        )}
        {isOccupied && onDischarge && patient && (
          <div className="flex gap-2 w-full">
            <button
              className="btn btn-secondary btn-sm flex-1"
              onClick={() => onSelect(bed)}
            >
              Details
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDischarge(patient.id)}
              title="Discharge Patient"
            >
              Discharge
            </button>
          </div>
        )}
        {isCleaning && onStatusChange && (
          <button
            className="btn btn-success btn-sm w-full"
            onClick={() => onStatusChange(bed.id, "available")}
          >
            Mark Ready (Available)
          </button>
        )}
      </div>
    </div>
  );
};

export default BedCard;
