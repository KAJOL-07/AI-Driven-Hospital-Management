require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/db");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const staffRoutes = require("./routes/staffRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const wardRoutes = require("./routes/wardRoutes");
const bedRoutes = require("./routes/bedRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const dischargeRoutes = require("./routes/dischargeRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const laboratoryRoutes = require("./routes/laboratoryRoutes");
const billingRoutes = require("./routes/billingRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const transferRoutes = require("./routes/transferRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      process.env.CORS_ORIGIN === "*" ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hospital Management Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/patients",      patientRoutes);
app.use("/api/doctors",       doctorRoutes);
app.use("/api/nurses",        nurseRoutes);
app.use("/api/staff",         staffRoutes);
app.use("/api/departments",   departmentRoutes);
app.use("/api/wards",         wardRoutes);
app.use("/api/beds",          bedRoutes);
app.use("/api/appointments",  appointmentRoutes);
app.use("/api/admissions",    admissionRoutes);
app.use("/api/discharges",    dischargeRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/pharmacy",      pharmacyRoutes);
app.use("/api/laboratory",    laboratoryRoutes);
app.use("/api/billing",       billingRoutes);
app.use("/api/inventory",     inventoryRoutes);
app.use("/api/emergency",     emergencyRoutes);
app.use("/api/transfers",     transferRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/ai",            aiRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    error: "NOT_FOUND"
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : "INTERNAL_ERROR"
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  await testConnection();
  app.listen(PORT, HOST, () => {
    console.log(`\n🏥 Hospital Management API Server`);
    console.log(`🚀 Running on: http://${HOST}:${PORT}`);
    console.log(`💊 Health: http://${HOST}:${PORT}/api/health`);
    console.log(`📅 Started: ${new Date().toLocaleString()}\n`);
  });
};

startServer();
