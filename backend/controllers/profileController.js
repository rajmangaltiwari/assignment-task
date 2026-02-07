const Profile = require("../models/Profile");

// GET all skills
exports.getSkills = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile.skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET top 5 skills
exports.getTopSkills = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile.skills.slice(0, 5));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new skill
exports.addSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { skill } = req.body;
    if (!skill) return res.status(400).json({ message: "Skill is required" });

    if (!profile.skills.includes(skill)) {
      profile.skills.push(skill);
      await profile.save();
    }
    res.status(201).json(profile.skills);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE skill by name
exports.deleteSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.skills = profile.skills.filter(
      (s) => s.toLowerCase() !== req.params.skillName.toLowerCase()
    );
    await profile.save();
    res.json({ message: "Skill deleted successfully", skills: profile.skills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
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
};

// GET profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH profile data
exports.searchProfile = async (req, res) => {
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
};
