import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react";

const Signup = () => {
  const { signup, setAuthView } = useHospital();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleKey: "DOCTOR"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = [
    { key: "ADMIN", label: "Admin" },
    { key: "DOCTOR", label: "Doctor" },
    { key: "NURSE", label: "Nurse" },
    { key: "RECEPTIONIST", label: "Receptionist" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    signup(formData);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper max-w-lg">
        {/* System Header */}
        <div className="auth-header text-center">
          <div className="auth-brand-logo mx-auto">
            <Activity size={28} className="text-primary" />
          </div>
          <h1 className="auth-main-title">
            MediFlow AI
          </h1>
          <p className="auth-subtitle">
            Create Staff Account • Hospital Management System
          </p>
        </div>

        {/* Signup Card */}
        <div className="auth-card card">
          <div className="auth-card-header">
            <h2 className="text-xl font-bold text-main">Register Staff Credentials</h2>
            <p className="text-xs text-muted mt-1">
              Fill in your details below to set up your clinical access permissions
            </p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error">
              <Info size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={17} className="input-left-icon" />
                <input
                  type="text"
                  className="form-control input-with-icon"
                  placeholder="e.g. Dr. Jennifer Adams"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Staff Hospital Email</label>
              <div className="input-icon-wrapper">
                <Mail size={17} className="input-left-icon" />
                <input
                  type="email"
                  className="form-control input-with-icon"
                  placeholder="j.adams@mediflow.hospital"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="form-group">
              <label className="form-label">Clinical / Administrative Role</label>
              <select
                className="form-select"
                value={formData.roleKey}
                onChange={(e) => setFormData({ ...formData, roleKey: e.target.value })}
              >
                {roleOptions.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Create Password</label>
              <div className="input-icon-wrapper">
                <Lock size={17} className="input-left-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control input-with-icon input-with-right-btn"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={17} className="input-left-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control input-with-icon input-with-right-btn"
                  placeholder="Re-type your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-lg w-full mt-3">
              <span>Create Account & Log In</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-card-footer text-center pt-4 border-t border-slate-100 mt-5">
            <p className="text-xs text-muted">
              Already registered?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => setAuthView("login")}
              >
                Log In Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
