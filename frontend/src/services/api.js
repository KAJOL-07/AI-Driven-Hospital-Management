// ============================================================
// API Service - connects frontend to backend
// Configurable via process.env.REACT_APP_API_URL or process.env.API_URL
// Falls back to http://localhost:5000/api for local development
// ============================================================

const getBaseUrl = () => {
  const envUrl =
    (typeof process !== "undefined" &&
      process.env &&
      (process.env.REACT_APP_API_URL || process.env.API_URL)) ||
    "";

  if (!envUrl) {
    return "http://localhost:5000/api";
  }

  const clean = envUrl.trim().replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const BASE_URL = getBaseUrl();

// ── Helpers ──────────────────────────────────────────────────

const getToken = () => localStorage.getItem("mediflow_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
};

// ── Auth ─────────────────────────────────────────────────────

export const apiLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const apiSignup = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const apiGetMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

// ── Dashboard ─────────────────────────────────────────────────

export const apiGetAdminDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/admin`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetDoctorDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/doctor`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetNurseDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/nurse`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetReceptionistDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/receptionist`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Patients ──────────────────────────────────────────────────

export const apiGetPatients = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/patients${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetPatient = async (id) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiCreatePatient = async (data) => {
  const res = await fetch(`${BASE_URL}/patients`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const apiUpdatePatient = async (id, data) => {
  const res = await fetch(`${BASE_URL}/patients/${id}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Doctors ───────────────────────────────────────────────────

export const apiGetDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/doctors${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Nurses ────────────────────────────────────────────────────

export const apiGetNurses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/nurses${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Staff ─────────────────────────────────────────────────────

export const apiGetStaff = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/staff${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Wards ─────────────────────────────────────────────────────

export const apiGetWards = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/wards${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Beds ──────────────────────────────────────────────────────

export const apiGetBeds = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/beds${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetAvailableBeds = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/beds/available${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiGetFloorStats = async () => {
  const res = await fetch(`${BASE_URL}/beds/floor-stats`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiConfigureGroundFloorBeds = async (totalBeds) => {
  const res = await fetch(`${BASE_URL}/beds/ground-floor/configure`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ total_beds: totalBeds }),
  });
  return handleResponse(res);
};

export const apiUpdateBedStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/beds/${id}/status`, {
    method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};

// ── Appointments ──────────────────────────────────────────────

export const apiGetAppointments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/appointments${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiCreateAppointment = async (data) => {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Admissions ────────────────────────────────────────────────

export const apiGetAdmissions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admissions${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiCreateAdmission = async (data) => {
  const res = await fetch(`${BASE_URL}/admissions`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Discharges ────────────────────────────────────────────────

export const apiCreateDischarge = async (data) => {
  const res = await fetch(`${BASE_URL}/discharges`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Emergency ─────────────────────────────────────────────────

export const apiGetEmergencies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/emergency${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiCreateEmergency = async (data) => {
  const res = await fetch(`${BASE_URL}/emergency`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Transfers ─────────────────────────────────────────────────

export const apiGetTransfers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/transfers${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiCreateTransfer = async (data) => {
  const res = await fetch(`${BASE_URL}/transfers`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── Notifications ─────────────────────────────────────────────

export const apiGetNotifications = async () => {
  const res = await fetch(`${BASE_URL}/notifications`, { headers: authHeaders() });
  return handleResponse(res);
};

export const apiMarkNotificationRead = async (id) => {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: "PATCH", headers: authHeaders(),
  });
  return handleResponse(res);
};

// ── Billing ───────────────────────────────────────────────────

export const apiGetBills = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/billing${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Pharmacy ──────────────────────────────────────────────────

export const apiGetMedicines = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/pharmacy${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Lab Tests ─────────────────────────────────────────────────

export const apiGetLabTests = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/laboratory${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Departments ───────────────────────────────────────────────

export const apiGetDepartments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/departments${query ? "?" + query : ""}`, { headers: authHeaders() });
  return handleResponse(res);
};

// ── Health check ──────────────────────────────────────────────

export const apiHealthCheck = async () => {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse(res);
};
