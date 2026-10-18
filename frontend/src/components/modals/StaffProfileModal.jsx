import React from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Briefcase,
  MapPin,
  CheckCircle2,
  Shield,
  Activity
} from "lucide-react";

const StaffProfileModal = () => {
  const {
    selectedStaffProfile,
    setSelectedStaffProfile,
    isStaffProfileModalOpen,
    setIsStaffProfileModalOpen
  } = useHospital();

  if (!isStaffProfileModalOpen || !selectedStaffProfile) return null;

  const staff = selectedStaffProfile;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
      case "on duty": return "badge-staff-present";
      case "absent": return "badge-staff-absent";
      case "on leave": return "badge-staff-leave";
      case "available": return "badge-staff-available";
      case "busy":
      case "with patients": return "badge-staff-busy";
      case "emergency duty": return "badge-staff-emergency";
      default: return "badge-secondary";
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsStaffProfileModalOpen(false)}>
      <div
        className="modal-container max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover & Avatar */}
        <div className="relative bg-gradient-to-r from-sky-700 to-slate-900 p-6 rounded-t-2xl text-white">
          <button
            className="modal-close-btn text-white/80 hover:text-white absolute right-4 top-4"
            onClick={() => setIsStaffProfileModalOpen(false)}
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={staff.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160"}
              alt={staff.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg shrink-0"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="badge badge-ai text-[11px]">{staff.category || staff.department || "Hospital Staff"}</span>
                <span className="text-xs font-mono text-sky-200">{staff.id}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{staff.name}</h2>
              <p className="text-xs text-sky-100 mt-0.5 font-medium">
                {staff.role || staff.designation || staff.specialization}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={`badge ${getStatusBadge(staff.currentStatus || staff.status)}`}>
                  Status: {staff.currentStatus || staff.status}
                </span>
                <span className={`badge ${getStatusBadge(staff.availability)}`}>
                  Availability: {staff.availability}
                </span>
                {staff.emergencyDutyStatus && (
                  <span className="badge badge-staff-emergency text-[11px]">
                    {staff.emergencyDutyStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 bg-white rounded-b-2xl max-h-[70vh] overflow-y-auto">
          {/* Contact Details */}
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
              Contact & Department Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-muted block text-[11px]">Direct Phone</span>
                  <span className="font-bold text-main">{staff.phone || "Hospital Extension #4400"}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <div className="truncate">
                  <span className="text-muted block text-[11px]">Hospital Email</span>
                  <span className="font-bold text-main truncate block">{staff.email || "staff@mediflow.hospital"}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <Building2 size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-muted block text-[11px]">Department / Unit</span>
                  <span className="font-bold text-main">{staff.department || staff.laboratorySection || staff.radiologySection || "Clinical Operations"}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <MapPin size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-muted block text-[11px]">Assigned Station / Ward / Area</span>
                  <span className="font-bold text-main">{staff.assignedWard || staff.assignedCounter || staff.assignedArea || staff.room || "Central Hospital Floor"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials, Experience & Shift */}
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
              Professional Credentials & Schedule
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Award size={14} className="text-primary" />
                  <span>Qualification</span>
                </div>
                <span className="font-bold text-main block">{staff.qualification || "Certified Professional"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Clock size={14} className="text-primary" />
                  <span>Current Shift</span>
                </div>
                <span className="font-bold text-main block">{staff.shift || "Day Shift (08:00 - 16:00)"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Calendar size={14} className="text-primary" />
                  <span>Joining Date</span>
                </div>
                <span className="font-bold text-main block font-mono">{staff.joiningDate || "2018-05-01"}</span>
              </div>
            </div>
          </div>

          {/* Clinical Workload / Daily Assignments */}
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
              Active Workload & Assignments
            </span>
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-sky-800 block text-[11px]">Assigned Patients</span>
                  <span className="text-lg font-extrabold text-sky-950 font-mono">
                    {staff.assignedPatients !== undefined ? `${staff.assignedPatients} Inpatients` : "— N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-sky-800 block text-[11px]">Today's Appointments / Duties</span>
                  <span className="text-lg font-extrabold text-sky-950 font-mono">
                    {staff.todaysAppointments !== undefined ? `${staff.todaysAppointments} Scheduled` : "Standard Duty"}
                  </span>
                </div>
                <div>
                  <span className="text-sky-800 block text-[11px]">Duty Status</span>
                  <span className="font-bold text-emerald-700 block mt-0.5">Active & Logged In</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsStaffProfileModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileModal;
