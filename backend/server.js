const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");

// ================= ENV =================
dotenv.config();

// ================= DATABASE =================
connectDB();

// ================= APP INIT =================
const app = express();

// ================= SECURITY MIDDLEWARE =================

// Secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Enable gzip compression
app.use(compression());

// CORS Configuration (STRICT in production)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL?.split(",")
        : "*",
    credentials: true,
  }),
);

// ================= BODY PARSER =================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ================= LOGGING =================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================= RATE LIMITING =================

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // allow general usage
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);

// Strict Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/entity-types", require("./routes/entityType.routes"));
app.use("/api/nature-of-business", require("./routes/natureOfBusiness.routes"));
app.use("/api/compliance-tasks", require("./routes/complianceTasks.routes"));
app.use("/api/compliances", require("./routes/compliance.routes"));


app.use("/api/clients", require("./routes/clients"));
// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Accounting Advisory Platform API",
    version: "1.0.0",
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

// ================= GRACEFUL SHUTDOWN =================
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully.");
  server.close(() => {
    console.log("Process terminated.");
  });
});

module.exports = app;
