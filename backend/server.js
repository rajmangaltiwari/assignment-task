const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Profile = require("./models/Profile");

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

// Profile Routes
// GET /api/profile - Get profile data
app.get("/api/profile", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/profile - Create or update profile
app.post("/api/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
    } else {
      profile = new Profile(req.body);
      await profile.save();
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/projects - Query projects by skill
app.get("/api/projects", async (req, res) => {
  const { skill } = req.query;
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    let projects = profile.projects;
    if (skill) {
      // Very basic filtering: check if skill is mentioned in project description or title
      // Or if the project explicitly lists skills (if we added that field)
      projects = projects.filter(
        (p) =>
          p.description.toLowerCase().includes(skill.toLowerCase()) ||
          p.title.toLowerCase().includes(skill.toLowerCase())||
          p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())),
      );
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/skills/top - Get top skills
app.get("/api/skills/top", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile.skills.slice(0, 5)); // Just return first 5 as "top"
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/search - Search profile data
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (!q) return res.json(profile);

    const searchTerm = q.toLowerCase();
    const matches = {
      name: profile.name.toLowerCase().includes(searchTerm),
      skills: profile.skills.filter((s) =>
        s.toLowerCase().includes(searchTerm),
      ),
      projects: profile.projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.skills.some((skill) => skill.toLowerCase().includes(searchTerm))
      ),
    };

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
