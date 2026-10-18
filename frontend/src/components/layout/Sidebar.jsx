import React from "react";
import { useHospital } from "../../context/HospitalContext";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  Building2,
  Sparkles,
  ArrowRightLeft,
  FileBarChart,
  Bell,
  Settings,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  Inbox,
  UserPlus,
  Activity,
  Pill,
  TrendingUp,
  Receipt,
  Package,
  Layers
} from "lucide-react";

const Sidebar = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    metrics,
    currentRole,
    currentRoleKey
  } = useHospital();

  // Categorized navigation groups tailored by user role
  const getNavGroups = () => {
    if (currentRoleKey === "ADMIN") {
      return [
        {
          groupTitle: "MAIN",
          items: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
          ]
        },
        {
          groupTitle: "PEOPLE",
          items: [
            { id: "patient-management", label: "Patients", icon: Users },
            { id: "doctor-management", label: "Doctors", icon: Stethoscope },
            { id: "staff-management", label: "Nurses & Staff", icon: UserCheck }
          ]
        },
        {
          groupTitle: "HOSPITAL",
          items: [
            { id: "floor-management", label: "Floor Management", icon: Building2, badge: "3 Floors", badgeClass: "badge-ai" },
            { id: "department-management", label: "Departments", icon: Building2 },
            { id: "ward-management", label: "Wards", icon: Layers },
            { id: "bed-management", label: "Beds", icon: BedDouble, badge: `${metrics.availableBeds} Free`, badgeClass: "badge-available" },
            { id: "emergency-management", label: "Emergency Center", icon: Activity, badge: "7 EMG", badgeClass: "badge-critical" }
          ]
        },
        {
          groupTitle: "CLINICAL",
          items: [
            { id: "appointments", label: "Appointments", icon: ClipboardList },
            { id: "medical-records", label: "Medical Records", icon: FileBarChart },
            { id: "pharmacy", label: "Pharmacy", icon: Pill },
            { id: "laboratory", label: "Laboratory", icon: Activity }
          ]
        },
        {
          groupTitle: "AI INTELLIGENCE",
          items: [
            { id: "smart-allocation", label: "Smart Bed Allocation", icon: Sparkles, badge: "AI", badgeClass: "badge-ai" },
            { id: "capacity-forecasting", label: "Capacity Forecasting", icon: TrendingUp },
            { id: "inter-ward-transfer", label: "Inter-Ward Transfer", icon: ArrowRightLeft, badge: `${metrics.activeTransfersCount}`, badgeClass: "badge-occupied" }
          ]
        },
        {
          groupTitle: "MANAGEMENT",
          items: [
            { id: "billing", label: "Billing & Accounts", icon: Receipt },
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "reports", label: "Reports & Analytics", icon: FileBarChart }
          ]
        },
        {
          groupTitle: "SYSTEM",
          items: [
            { id: "notifications", label: "Notifications", icon: Bell, badge: metrics.unreadNotificationsCount > 0 ? `${metrics.unreadNotificationsCount}` : null, badgeClass: "badge-critical" },
            { id: "settings", label: "Settings", icon: Settings }
          ]
        }
      ];
    }

    if (currentRoleKey === "DOCTOR") {
      return [
        {
          groupTitle: "MAIN",
          items: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
          ]
        },
        {
          groupTitle: "CLINICAL CARE",
          items: [
            { id: "patient-management", label: "My Patients", icon: Users },
            { id: "appointments", label: "Appointments", icon: ClipboardList },
            { id: "medical-records", label: "Medical Records", icon: FileBarChart }
          ]
        },
        {
          groupTitle: "BEDS & TRANSFERS",
          items: [
            { id: "floor-management", label: "Floor Bed Layout", icon: Building2, badge: "3 Floors", badgeClass: "badge-ai" },
            { id: "bed-requests", label: "Bed Requests", icon: Inbox, badge: `${metrics.pendingRequestsCount}`, badgeClass: "badge-occupied" },
            { id: "smart-allocation", label: "Smart Bed Allocation", icon: Sparkles, badge: "AI", badgeClass: "badge-ai" },
            { id: "inter-ward-transfer", label: "Inter-Ward Transfer", icon: ArrowRightLeft, badge: `${metrics.activeTransfersCount}`, badgeClass: "badge-occupied" }
          ]
        },
        {
          groupTitle: "SYSTEM",
          items: [
            { id: "notifications", label: "Notifications", icon: Bell, badge: metrics.unreadNotificationsCount > 0 ? `${metrics.unreadNotificationsCount}` : null, badgeClass: "badge-critical" },
            { id: "profile", label: "Doctor Profile", icon: UserCheck }
          ]
        }
      ];
    }

    if (currentRoleKey === "NURSE") {
      return [
        {
          groupTitle: "MAIN",
          items: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
          ]
        },
        {
          groupTitle: "WARD OPERATIONS",
          items: [
            { id: "floor-management", label: "Floor Bed Board", icon: Building2, badge: "3 Floors", badgeClass: "badge-ai" },
            { id: "patient-management", label: "Ward Inpatients", icon: Users },
            { id: "bed-management", label: "Bed Status", icon: BedDouble, badge: `${metrics.availableBeds} Free`, badgeClass: "badge-available" },
            { id: "emergency-management", label: "Emergency Intake", icon: Activity }
          ]
        },
        {
          groupTitle: "BEDS & FLOW",
          items: [
            { id: "smart-allocation", label: "Smart Allocation", icon: Sparkles, badge: "AI", badgeClass: "badge-ai" },
            { id: "inter-ward-transfer", label: "Transfer Requests", icon: ArrowRightLeft, badge: `${metrics.activeTransfersCount}`, badgeClass: "badge-occupied" }
          ]
        },
        {
          groupTitle: "SYSTEM",
          items: [
            { id: "notifications", label: "Notifications", icon: Bell, badge: metrics.unreadNotificationsCount > 0 ? `${metrics.unreadNotificationsCount}` : null, badgeClass: "badge-critical" },
            { id: "profile", label: "Nurse Profile", icon: UserCheck }
          ]
        }
      ];
    }

    // RECEPTIONIST
    return [
      {
        groupTitle: "MAIN",
        items: [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
        ]
      },
      {
        groupTitle: "INTAKE & PATIENTS",
        items: [
          { id: "floor-management", label: "Floor Bed Intake", icon: Building2, badge: "3 Floors", badgeClass: "badge-ai" },
          { id: "patient-registration", label: "New Patient Intake", icon: UserPlus },
          { id: "patient-management", label: "Patient Directory", icon: Users },
          { id: "appointments", label: "Appointments Desk", icon: ClipboardList }
        ]
      },
      {
        groupTitle: "BED INTAKE",
        items: [
          { id: "bed-management", label: "Bed Availability", icon: BedDouble, badge: `${metrics.availableBeds} Free`, badgeClass: "badge-available" },
          { id: "bed-requests", label: "Bed Requests", icon: Inbox, badge: `${metrics.pendingRequestsCount}`, badgeClass: "badge-occupied" }
        ]
      },
      {
        groupTitle: "SYSTEM",
        items: [
          { id: "notifications", label: "Notifications", icon: Bell, badge: metrics.unreadNotificationsCount > 0 ? `${metrics.unreadNotificationsCount}` : null, badgeClass: "badge-critical" },
          { id: "profile", label: "My Profile", icon: UserCheck }
        ]
      }
    ];
  };

  const navGroups = getNavGroups();

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!sidebarCollapsed && (
          <div className="sidebar-brand-block">
            <span className="sidebar-app-name">MEDIFLOW AI</span>
            <span className="sidebar-hospital-tag">Smart Hospital HMS</span>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!sidebarCollapsed && (
        <div className="sidebar-role-indicator">
          <div className="role-chip">
            <ShieldCheck size={16} className="text-sky-400 shrink-0" />
            <div className="role-info">
              <span className="role-title-text">{currentRole.roleName} PORTAL</span>
              <span className="role-sub-text">{currentRole.dept}</span>
            </div>
          </div>
        </div>
      )}

      {/* Categorized Navigation Container */}
      <div className="sidebar-nav-container">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="sidebar-nav-group mb-4">
            {!sidebarCollapsed && (
              <div className="sidebar-group-header px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
            )}
            <ul className="nav-list space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id} className="nav-item">
                    <button
                      className={`nav-link ${isActive ? "active" : ""}`}
                      onClick={() => setCurrentPage(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className="nav-icon">
                        <Icon size={17} />
                      </span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          {item.badge && (
                            <span className={`nav-badge ${item.badgeClass || ""}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Bed Capacity Meter */}
      {!sidebarCollapsed && (
        <div className="sidebar-capacity-widget">
          <div className="widget-header">
            <span className="widget-title">Hospital Bed Load</span>
            <span className="widget-pct">{metrics.occupancyPercentage}%</span>
          </div>
          <div className="capacity-bar-container">
            <div
              className={`capacity-bar-fill ${metrics.occupancyPercentage >= 85 ? "bg-amber-400" : "bg-sky-400"}`}
              style={{ width: `${metrics.occupancyPercentage}%` }}
            />
          </div>
          <div className="widget-stats">
            <span>{metrics.occupiedBeds} Inpatients</span>
            <span>{metrics.availableBeds} Free Beds</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
