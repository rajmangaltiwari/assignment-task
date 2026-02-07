const Profile = require("../models/Profile");

// GET all projects with optional skill filter
exports.getAllProjects = async (req, res) => {
  const { skill } = req.query;
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    let projects = profile.projects;
    if (skill) {
      projects = projects.filter(
        (p) =>
          p.description.toLowerCase().includes(skill.toLowerCase()) ||
          p.title.toLowerCase().includes(skill.toLowerCase()) ||
          p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())),
      );
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const project = profile.projects.id(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new project
exports.createProject = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.projects.push(req.body);
    await profile.save();
    res.status(201).json(profile.projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE project by ID
exports.updateProject = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const project = profile.projects.id(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    await profile.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE project by ID
exports.deleteProject = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.projects.id(req.params.id).deleteOne();
    await profile.save();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
