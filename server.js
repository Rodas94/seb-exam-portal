const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs"); // Use bcryptjs for compatibility with Windows
const FileStore = require("session-file-store")(session); // npm install session-file-store
const sebVerifyMiddleware = require("./middleware/sebVerifyMiddleware");
const errorHandler = require("./middleware/errorHandler");

// --- 1. Import CSRF Dependencies ---
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");

// Config & Initialization
dotenv.config();
const db = require("./config/db");
db.initialize();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. GLOBAL CORE & SECURITY PARSERS
// ==========================================
app.use(
  helmet({
    // Keep your local development bypasses
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    strictTransportSecurity: false,
    originAgentCluster: false, // Disable for local dev, but enable in production
  }),
);
app.use(
  cors({
    origin: true, // Dynamically reflects the request origin (works for localhost and http://192.168.1.11)
    credentials: true, // Required because you are using cookies/credentials: "include"
  }),
);
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Initialize cookie-parser first with a secret string so down-line apps can decode cookies
app.use(cookieParser(process.env.COOKIE_SECRET || "fallback_cookie_secret"));

// ==========================================
// 2. SESSION LIFECYCLE MANAGEMENT
// ==========================================
// Session must be parsed before CSRF checks run so req.session is populated
app.use(
  session({
    store: new FileStore({
      path: "./data/sessions", // Saves sessions to disk
      ttl: 86400, // Session expires after 24 hours
      retries: 0,
      reapInterval: 1800, // Check and delete expired files every 30 minutes
    }),
    secret: process.env.SESSION_SECRET || "fallback_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict", // Prevents basic CSRF attacks via cookies
    },
  }),
);

// ==========================================
// 3. CSRF INITIALIZATION & UTILITIES
// ==========================================
// Force isProd to false (or base it on a custom environment variable if you eventually use real HTTPS domains later)
const isProd = false; // Since http://192.168.1.11/ is plain HTTP

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "fallback_csrf_secret",
  cookieName: "ps-csrf-token", // Removed the __Host- prefix because it fails on non-HTTPS IPs
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: false, // Must be false for plain http:// connections
    signed: false,
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
  getSessionIdentifier: (req) => req.ip || "anonymous",
});

// ==========================================
// 4. UNPROTECTED / GLOBAL INTERCEPT ROUTES
// ==========================================
app.get("/", sebVerifyMiddleware.requireSEB);

// Your frontend will hit this route to retrieve its modern CSRF token string
app.get("/auth/csrf-token", (req, res) => {
  const csrfToken = generateCsrfToken(req, res);
  return res.json({ csrfToken });
});

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// ==========================================
// 5. STATIC COMPONENT ROUTING
// ==========================================
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// 6. ROUTE APP-STACK & ROUTE PROTECTION
// ==========================================
app.use("/", require("./routes/examRoutes")); // SEB Client Routes
app.use("/auth", require("./routes/authRoutes")); // Login/Logout

// Explicit defense-in-depth applied strictly to admin operations
app.use(
  "/admin",
  doubleCsrfProtection,
  require("./routes/adminRoutes"),
  errorHandler,
);

// ==========================================
// 7. COMPREHENSIVE ERROR ROUTING
// ==========================================
// Catch rejected CSRF actions
app.use((error, req, res, next) => {
  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid or missing CSRF token." });
  }
  next(error);
});

// Structural fall-back crash catcher
app.use((error, req, res, next) => {
  console.error("SERVER CRASH ERROR:", error);
  res.status(500).json({
    message: "Server crashed!",
    error: error.message,
    stack: isProd ? undefined : error.stack,
  });
});

// ==========================================
// 8. SERVER INITIALIZATION
// ==========================================
//app.listen(PORT, () => {
// console.log(`Server running on http://localhost:${PORT}`);
//});
const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running globally on port ${PORT}`);
});

// Fix Keep-Alive race conditions in Node.js
server.keepAliveTimeout = 61000; // Ensure this is higher than browser default (60s)
server.headersTimeout = 65000;

// ==========================================
// 9. GRACEFUL SHUTDOWN HANDLER
// ==========================================
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forcefully shutting down");
    process.exit(1);
  }, 10000);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forcefully shutting down");
    process.exit(1);
  }, 10000);
});
