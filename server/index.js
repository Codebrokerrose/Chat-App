const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/connectDB");
const router = require("./routes/index"); // Main app routes
const geminiChatRoutes = require("./routes/geminiChat"); // ✅ Gemini chat route
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
const path = require("path");

const PORT = process.env.PORT || 8080;

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

// --- Static files ---
app.use(express.static(path.join(__dirname, "../client/build")));

// --- API Routes ---
app.use("/api", router); // existing routes
app.use("/api", geminiChatRoutes); // ✅ add Gemini route

// --- Root Endpoint ---
app.get("/", (request, response) => {
  response.json({
    message: "server is up and running " + PORT,
  });
});

// --- Catch-All (for React SPA) ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// --- Connect to DB and start server ---
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ DB connection error:", error);
  });
