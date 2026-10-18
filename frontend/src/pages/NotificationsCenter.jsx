import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  Bell,
  AlertTriangle,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Check,
  Trash2,
  Filter
} from "lucide-react";

const NotificationsCenter = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentPage
  } = useHospital();

  const [filterType, setFilterType] = useState("ALL");

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === "UNREAD") return n.unread;
    if (filterType === "CRITICAL") return n.type === "critical";
    if (filterType === "TRANSFER") return n.type === "transfer";
    if (filterType === "AI") return n.type === "ai_insight";
    return true;
  });

  return (
    <div className="notifications-center-page space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Dispatch Command Feed</span>
              <span className="text-xs text-muted font-mono">{notifications.length} Total Alerts</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">
              Hospital Alerts & Notification Center
            </h1>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Real-time dispatches regarding critical bed shortages, urgent transfer authorizations, bed sanitization completions, and AI capacity surge forecasts.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-md"
            onClick={markAllNotificationsRead}
          >
            <Check size={16} />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            className={`btn btn-sm ${filterType === "ALL" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterType("ALL")}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            className={`btn btn-sm ${filterType === "UNREAD" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterType("UNREAD")}
          >
            Unread ({notifications.filter((n) => n.unread).length})
          </button>
          <button
            className={`btn btn-sm ${filterType === "CRITICAL" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterType("CRITICAL")}
          >
            Critical Shortages
          </button>
          <button
            className={`btn btn-sm ${filterType === "TRANSFER" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterType("TRANSFER")}
          >
            Transfer Approvals
          </button>
          <button
            className={`btn btn-sm ${filterType === "AI" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilterType("AI")}
          >
            AI Predictive Insights
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((n) => {
          const isCritical = n.type === "critical";
          const isAi = n.type === "ai_insight";
          const isTransfer = n.type === "transfer";

          return (
            <div
              key={n.id}
              className={`card p-4 transition flex items-start gap-3.5 ${n.unread ? "border-sky-300 bg-sky-50/30" : "bg-white"}`}
              onClick={() => markNotificationRead(n.id)}
            >
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${isCritical ? "bg-rose-100 text-rose-600" : isAi ? "bg-sky-100 text-sky-600" : isTransfer ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}
              >
                {isCritical ? (
                  <AlertTriangle size={18} />
                ) : isAi ? (
                  <Sparkles size={18} />
                ) : isTransfer ? (
                  <ArrowRightLeft size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-main">{n.title}</h3>
                    {n.unread && <span className="badge badge-ai text-[10px]">Unread</span>}
                  </div>
                  <span className="text-xs text-muted font-mono">{n.time}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  {n.message}
                </p>

                {n.actionUrl && (
                  <button
                    className="btn btn-secondary btn-sm text-xs font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                      setCurrentPage(n.actionUrl.replace("/", ""));
                    }}
                  >
                    <span>{n.actionLabel || "View Action"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsCenter;
