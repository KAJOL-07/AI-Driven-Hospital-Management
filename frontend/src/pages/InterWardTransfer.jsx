import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { TransferStatusBadge } from "../components/common/StatusBadge";
import {
  ArrowRightLeft,
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  Building2,
  BedDouble,
  User
} from "lucide-react";

const InterWardTransfer = () => {
  const {
    transfers,
    setIsTransferModalOpen,
    approveTransfer,
    rejectTransfer,
    executeTransfer,
    currentRole
  } = useHospital();

  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredTransfers = transfers.filter((t) => {
    if (filterStatus === "PENDING") return t.status.includes("Pending");
    if (filterStatus === "APPROVED") return t.status.includes("Approved") || t.status.includes("Reserved");
    if (filterStatus === "TRANSIT") return t.status.includes("Transit");
    if (filterStatus === "COMPLETED") return t.status.includes("Completed");
    return true;
  });

  return (
    <div className="inter-ward-transfer-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Intelligent Patient Routing</span>
              <span className="text-xs text-muted font-mono">{transfers.length} Total Transfer Records</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Inter-Ward Transfer & Step-Down Management
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Authorize and coordinate patient transfers between intensive care and step-down wards with clinical compatibility validation.
            </p>
          </div>

          <button
            className="btn btn-primary btn-md"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Request New Transfer</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            className={`btn btn-sm ${filterStatus === "ALL" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("ALL")}
          >
            All Transfers ({transfers.length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === "PENDING" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("PENDING")}
          >
            Pending Approval ({transfers.filter((t) => t.status.includes("Pending")).length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === "APPROVED" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("APPROVED")}
          >
            Approved & Reserved ({transfers.filter((t) => t.status.includes("Approved") || t.status.includes("Reserved")).length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === "COMPLETED" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("COMPLETED")}
          >
            Completed ({transfers.filter((t) => t.status.includes("Completed")).length})
          </button>
        </div>
      </div>

      {/* Transfers Cards */}
      <div className="space-y-4">
        {filteredTransfers.map((trf) => {
          const isPending = trf.status.includes("Pending");
          const isApproved = trf.status.includes("Approved") || trf.status.includes("Reserved");
          const isCompleted = trf.status.includes("Completed");
          const isRejected = trf.status.includes("Rejected");

          return (
            <div
              key={trf.id}
              className={`card p-5 ${isCompleted ? "bg-slate-50/70 border-slate-200" : isRejected ? "bg-rose-50/40 border-rose-200" : "border-sky-200 shadow-sm"}`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-primary flex items-center justify-center font-bold">
                    <ArrowRightLeft size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-main">{trf.patientName}</h3>
                      <span className="text-xs text-muted font-mono">{trf.patientId} • {trf.age} yrs</span>
                      <span
                        className="badge text-xs font-bold"
                        style={{
                          backgroundColor: `${trf.priorityColor}15`,
                          color: trf.priorityColor,
                          borderColor: `${trf.priorityColor}40`
                        }}
                      >
                        {trf.priority}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      Protocol: <strong className="font-mono text-slate-700">{trf.id}</strong> • Requested by {trf.requestedBy}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="badge badge-ai font-mono font-bold text-xs">
                    {trf.aiCompatibilityScore}% AI MATCH
                  </span>
                  <TransferStatusBadge status={trf.status} />
                </div>
              </div>

              {/* Transfer Movement Route */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center">
                {/* Source Ward */}
                <div className="md:col-span-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-muted uppercase block mb-1">Origin Ward & Bed</span>
                  <div className="font-bold text-sm text-main">{trf.sourceWardName}</div>
                  <div className="text-xs font-mono font-bold text-slate-700">Bed #{trf.sourceBedId}</div>
                </div>

                {/* Arrow Vector */}
                <div className="md:col-span-2 flex flex-col items-center justify-center text-primary">
                  <ArrowRightLeft size={22} className="hidden md:block" />
                  <span className="text-[11px] font-bold text-muted mt-1 font-mono">
                    {trf.etaMinutes > 0 ? `ETA: ${trf.etaMinutes}m` : "Complete"}
                  </span>
                </div>

                {/* Destination Ward */}
                <div className="md:col-span-5 p-3.5 bg-sky-50/70 rounded-xl border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-800 uppercase block mb-1">Target Destination</span>
                  <div className="font-bold text-sm text-sky-950">{trf.targetWardName}</div>
                  <div className="text-xs font-mono font-bold text-primary">Bed #{trf.targetBedId}</div>
                </div>
              </div>

              {/* Rationale & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="text-slate-700 max-w-2xl leading-relaxed">
                  <strong>Clinical Reason:</strong> {trf.clinicalReason}
                  <div className="text-[11px] text-sky-800 mt-0.5">
                    <strong>AI Recommendation Reason:</strong> {trf.aiRecommendationReason}
                  </div>
                </div>

                {/* Explicit Approve / Reject / Execute actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => approveTransfer(trf.id)}
                        title="Approve Transfer"
                      >
                        <Check size={14} />
                        <span>Approve Transfer</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => rejectTransfer(trf.id)}
                        title="Reject Transfer"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => executeTransfer(trf.id)}
                      title="Dispatch Transport and Move Patient"
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete Patient Transfer</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Transferred Successfully
                    </span>
                  )}

                  {isRejected && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <XCircle size={14} /> Transfer Request Declined
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterWardTransfer;
