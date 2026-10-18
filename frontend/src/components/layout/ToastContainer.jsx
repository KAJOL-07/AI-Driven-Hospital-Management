import React from "react";
import { useHospital } from "../../context/HospitalContext";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

const ToastContainer = () => {
  const { toasts, removeToast } = useHospital();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "danger":
        return <XCircle size={18} className="text-rose-500" />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-500" />;
      default:
        return <Info size={18} className="text-sky-500" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <div className="toast-icon">{getIcon(toast.type)}</div>
          <div className="toast-body">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-desc">{toast.message}</div>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
