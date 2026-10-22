require("dotenv").config();
const dns = require("dns");
try {
  if (dns && typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first"); // Fix SRV DNS timeout on Windows / Node 17+
  }
} catch (e) {
  // Non-fatal if unsupported in environment
}
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hospital_management";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4,
    });
    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`📌 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}\n`);
    return conn;
  } catch (error) {
    console.error("\n❌ MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    console.error("   To resolve this:");
    console.error("   1) If using local MongoDB, ensure MongoDB is installed and running (net start MongoDB or mongod)");
    console.error("   2) Or if using MongoDB Atlas, update MONGODB_URI in backend/.env with your connection string.\n");
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("🔄 MongoDB reconnected"));

const testConnection = connectDB;

module.exports = { connectDB, testConnection };
