/* global require, process, __dirname */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

 
dotenv.config();

 connectDB();

const app = express();

 
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  process.env.CLIENT_URL, // Jo Render te save kita hai
  "http://localhost:5173", // Vite da default local port
  "https://crowdlift-project-lime.vercel.app" // Tera actual live frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

 
 
app.use("/api/auth", require("./routes/authRoutes"));

// Campaign routes - CRUD + backing
app.use("/api/campaigns", require("./routes/campaignRoutes"));

 
app.get("/", (req, res) => {
  res.json({
    message: " CrowdLift API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      campaigns: "/api/campaigns",
    },
  });
});

 
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

 // eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(" Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum 50MB allowed." });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});