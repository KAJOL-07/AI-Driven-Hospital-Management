import React, { useState, useEffect } from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  Bell,
  Search,
  Activity,
  PlusCircle,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  LogOut,
  User,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const TopNavbar = () => {
  const {
    currentRole,
    currentRoleKey,
    setRole,
    authUser,
    logout,
    searchQuery,
    setSearchQuery,
    metrics,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSmartAllocateModalOpen,
    setIsAdmitModalOpen,
    emergencySurgeActive,
    toggleEmergencySurge,
    setCurrentPage
  } = useHospital();

  const [time, setTime] = useState(new Date());
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifs = notifications.filter((n) => n.unread);

  return (
    <header className="top-navbar">
      {/* Brand & AI Indicator */}
      <div className="navbar-left">
        <div className="brand-badge" onClick={() => setCurrentPage("dashboard")}>
          <div className="brand-logo-icon">
            <Activity size={22} className="text-primary" />
          </div>
          <div>
            <div className="brand-title">
              MediFlow <span className="text-primary">AI</span>
            </div>
            <div className="brand-subtitle">Capacity Forecasting & Bed Allocation</div>
          </div>
        </div>

        <div className={`ai-live-pill ${emergencySurgeActive ? "surge" : ""}`}>
          <span className="pulse-dot" />
          <span>{emergencySurgeActive ? "SURGE ACTIVE" : "AI OPTIMIZER ACTIVE"}</span>
        </div>
      </div>

      {/* Global Search */}
      <div className="navbar-middle">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search patients, bed IDs (e.g. ICU-01), wards, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="navbar-right">
        {/* Quick Action */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsSmartAllocateModalOpen(true)}
        >
          <Sparkles size={15} />
          <span>Smart Allocate</span>
        </button>

        {/* Live Clock */}
        <div className="live-clock">
          <span className="clock-time font-mono">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="clock-date">
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Notifications Popover */}
        <div className="navbar-dropdown-wrapper">
          <button
            className="navbar-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
            }}
            title="Hospital Notifications"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="notif-counter">{unreadNotifs.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-popover card">
              <div className="popover-header">
                <div className="font-bold flex items-center gap-2 text-main text-xs">
                  <Bell size={15} className="text-primary" />
                  <span>Hospital Alerts</span>
                  {unreadNotifs.length > 0 && (
                    <span className="badge badge-critical">{unreadNotifs.length} New</span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    className="popover-action-text"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.unread ? "unread" : ""}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionUrl) {
                        setCurrentPage(n.actionUrl.replace("/", ""));
                      }
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notif-body">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="popover-footer">
                <button
                  className="btn btn-secondary btn-sm w-full"
                  onClick={() => {
                    setCurrentPage("notifications");
                    setShowNotifications(false);
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile & Role Dropdown */}
        <div className="navbar-dropdown-wrapper">
          <button
            className="role-selector-btn"
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifications(false);
            }}
          >
            <img
              src={authUser?.avatar || currentRole.avatar}
              alt={authUser?.name || currentRole.name}
              className="user-avatar"
            />
            <div className="user-meta">
              <span className="user-name">{authUser?.name || currentRole.name}</span>
              <span className="user-role-tag" style={{ color: currentRole.badgeColor }}>
                {authUser?.role || currentRole.roleName}
              </span>
            </div>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {showRoleDropdown && (
            <div className="role-popover card">
              <div className="popover-header">
                <span className="font-bold text-xs uppercase tracking-wider text-muted">
                  Switch Active Persona
                </span>
              </div>
              <div className="role-options">
                {[
                  { key: "ADMIN", title: "Hospital Admin", desc: "Operations & Capacity Command" },
                  { key: "DOCTOR", title: "Doctor", desc: "Clinical Triage & Transfer Approvals" },
                  { key: "NURSE", title: "Nurse", desc: "Ward Bed Board & Sanitization" },
                  { key: "RECEPTIONIST", title: "Receptionist", desc: "Patient Intake & Fast Allocation" }
                ].map((r) => (
                  <div
                    key={r.key}
                    className={`role-option-item ${currentRoleKey === r.key ? "selected" : ""}`}
                    onClick={() => {
                      setRole(r.key);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <div className="role-option-text">
                      <div className="role-option-title">{r.title}</div>
                      <div className="role-option-desc">{r.desc}</div>
                    </div>
                    {currentRoleKey === r.key && (
                      <span className="badge badge-ai text-[10px]">Active</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="popover-footer flex justify-between items-center">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setCurrentPage("profile");
                    setShowRoleDropdown(false);
                  }}
                >
                  <User size={13} />
                  <span>Profile</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setShowRoleDropdown(false);
                    logout();
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
