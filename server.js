const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Test Route
app.get("/api/protected", (req, res) => {
  res.json({ message: "Protected route working." });
});

// Shift Routes
const shiftRoutes = require("./routes/shifts");
app.use("/api/shifts", shiftRoutes);

// Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
