const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Profile = require("./models/Profile");
const projectController = require("./controllers/projectController");
const profileController = require("./controllers/profileController");
const userController = require("./controllers/userController");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to local MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Authentication Routes
// POST /api/auth/signup - Register new user
app.post("/api/auth/signup", userController.signup);

// POST /api/auth/login - Login user
app.post("/api/auth/login", userController.login);

// GET /api/auth/me - Get current user (protected)
app.get("/api/auth/me", authenticateToken, userController.getCurrentUser);

// Profile Routes
// GET /api/profile - Get profile data
app.get("/api/profile", profileController.getProfile);

// POST /api/profile - Create or update profile
app.post("/api/profile", profileController.updateProfile);

// Project Routes
// GET /api/projects - Query projects by skill
app.get("/api/projects", projectController.getAllProjects);

// POST /api/projects - Create new project
app.post("/api/projects", projectController.createProject);

// GET /api/projects/:id - Get single project
app.get("/api/projects/:id", projectController.getProjectById);

// PUT /api/projects/:id - Update project
app.put("/api/projects/:id", projectController.updateProject);

// DELETE /api/projects/:id - Delete project
app.delete("/api/projects/:id", projectController.deleteProject);

// Skills Routes
// GET /api/skills/top - Get top skills
app.get("/api/skills/top", profileController.getTopSkills);

// GET /api/skills - Get all skills
app.get("/api/skills", profileController.getSkills);

// POST /api/skills - Add new skill
app.post("/api/skills", profileController.addSkill);

// DELETE /api/skills/:skillName - Delete skill
app.delete("/api/skills/:skillName", profileController.deleteSkill);

// Search Routes
// GET /api/search - Search profile data
app.get("/api/search", profileController.searchProfile);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
