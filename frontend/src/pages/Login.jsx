import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  X
} from "lucide-react";

const Login = () => {
  const { login, setAuthView } = useHospital();

  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [email, setEmail] = useState("admin@mediflow.hospital");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const roleOptions = [
    { key: "ADMIN", label: "Admin", icon: ShieldCheck, desc: "Hospital Operations & Capacity Command" },
    { key: "DOCTOR", label: "Doctor", icon: Stethoscope, desc: "Clinical Triage & Transfer Approvals" },
    { key: "NURSE", label: "Nurse", icon: HeartPulse, desc: "Ward Bed Board & Sanitization" },
    { key: "RECEPTIONIST", label: "Receptionist", icon: ClipboardList, desc: "Patient Intake & Fast Allocation" }
  ];

  const handleRoleChange = (key) => {
    setSelectedRole(key);
    setEmail(`${key.toLowerCase()}@mediflow.hospital`);
    setPassword("password123");
    setErrorMessage("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setErrorMessage("");
    login(selectedRole, email, null, password);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setShowForgotModal(false);
        setForgotEmail("");
      }, 2500);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background Decor */}
      <div className="auth-card-wrapper">
        {/* System Header */}
        <div className="auth-header text-center">
          <div className="auth-brand-logo mx-auto">
            <Activity size={28} className="text-primary" />
          </div>
          <h1 className="auth-main-title">
            AI-Driven Hospital Bed Capacity Forecasting Dashboard
          </h1>
          <p className="auth-subtitle">
            Intelligent Inter-Ward Transfer & Smart Bed Allocation System
          </p>
        </div>

        {/* Login Box */}
        <div className="auth-card card">
          <div className="auth-card-header">
            <h2 className="text-xl font-bold text-main">Staff Portal Login</h2>
            <p className="text-xs text-muted mt-1">
              Select your clinical role to access your personalized hospital workspace
            </p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error">
              <Info size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">
                Select Your Role <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {roleOptions.map((r) => {
                  const IconComp = r.icon;
                  const isSelected = selectedRole === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      className={`role-select-card ${isSelected ? "active" : ""}`}
                      onClick={() => handleRoleChange(r.key)}
                    >
                      <IconComp size={20} className={isSelected ? "text-primary" : "text-muted"} />
                      <span className="role-card-label">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Username / Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={17} className="input-left-icon" />
                <input
                  type="email"
                  className="form-control input-with-icon"
                  placeholder="name@mediflow.hospital"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0">Password</label>
                <button
                  type="button"
                  className="auth-link-text"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-icon-wrapper">
                <Lock size={17} className="input-left-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control input-with-icon input-with-right-btn"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-lg w-full mt-2">
              <span>Sign In as {roleOptions.find((r) => r.key === selectedRole)?.label}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="demo-credentials-box">
            <span className="demo-tag flex items-center gap-1">
              <Sparkles size={13} className="text-primary" />
              Quick Presentation Demo Accounts:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {roleOptions.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className={`demo-pill ${selectedRole === r.key ? "active" : ""}`}
                  onClick={() => handleRoleChange(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Link */}
          <div className="auth-card-footer text-center pt-4 border-t border-slate-100 mt-5">
            <p className="text-xs text-muted">
              Don't have a staff account?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setAuthView("signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-base font-bold text-main">Reset Staff Password</h3>
              <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {forgotSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-2" />
                  Password reset link has been dispatched to {forgotEmail}. Check your hospital inbox.
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-xs text-muted">
                    Enter your hospital staff email and IT will send instructions to reset your security credentials.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Hospital Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. doctor@mediflow.hospital"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
