import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  Inbox,
  Sparkles,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Check
} from "lucide-react";

const BedRequests = () => {
  const {
    bedRequests,
    approveBedRequest,
    rejectBedRequest,
    setIsSmartAllocateModalOpen,
    wards
  } = useHospital();

  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredRequests = bedRequests.filter((r) => {
    if (filterStatus === "PENDING") return r.status.includes("Pending");
    if (filterStatus === "APPROVED") return r.status.includes("Approved");
    return true;
  });

  return (
    <div className="bed-requests-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Clinical Intake Protocol</span>
              <span className="text-xs text-muted font-mono">{bedRequests.length} Total Requests</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Bed Requests & Placement Queue
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Authorize inpatient bed assignments for clinical admissions, triage requests, and surgical recovery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary btn-md"
              onClick={() => setIsSmartAllocateModalOpen(true)}
            >
              <Sparkles size={16} />
              <span>Smart AI Match</span>
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            className={`btn btn-sm ${filterStatus === "ALL" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("ALL")}
          >
            All Requests ({bedRequests.length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === "PENDING" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("PENDING")}
          >
            Pending Authorization ({bedRequests.filter((r) => r.status.includes("Pending")).length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === "APPROVED" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterStatus("APPROVED")}
          >
            Approved & Assigned ({bedRequests.filter((r) => r.status.includes("Approved")).length})
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Inbox size={18} className="text-primary" />
            <span>Active Bed Requests ({filteredRequests.length})</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Target Ward & Equipment</th>
                <th>Priority</th>
                <th>Clinical Diagnosis</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const isPending = req.status.includes("Pending");
                const isApproved = req.status.includes("Approved");

                return (
                  <tr key={req.id}>
                    <td>
                      <div className="font-bold text-main">{req.patientName}</div>
                      <div className="text-xs text-muted font-mono">{req.id} • {req.age} yrs ({req.gender[0]})</div>
                    </td>
                    <td>
                      <div className="font-semibold text-main text-xs">{req.requestedWard}</div>
                      <div className="text-[11px] text-muted">{req.bedType}</div>
                    </td>
                    <td>
                      <span
                        className={`badge text-xs font-bold ${
                          req.priority === "CRITICAL"
                            ? "badge-critical"
                            : req.priority === "URGENT"
                            ? "badge-cleaning"
                            : "badge-available"
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-main max-w-xs truncate" title={req.diagnosis}>
                        {req.diagnosis}
                      </div>
                      <div className="text-[11px] text-muted truncate">{req.notes}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 font-medium">{req.requestedBy}</div>
                      <div className="text-[10px] text-muted">{req.requestTime}</div>
                    </td>
                    <td>
                      <span className={`badge ${isApproved ? "badge-available" : isPending ? "badge-occupied" : "badge-secondary"}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {isPending ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => approveBedRequest(req.id)}
                            title="Approve & Assign Bed"
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => rejectBedRequest(req.id)}
                            title="Decline Request"
                          >
                            <XCircle size={13} />
                            <span>Decline</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Assigned
                        </span>
                      )}
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

export default BedRequests;
