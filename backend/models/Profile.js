const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String, required: true }],
  links: {
    github: String,
    demo: String,
  },
});

const WorkSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
});

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    education: { type: String },
    skills: [{ type: String, required: true }],
    projects: [ProjectSchema],
    work: [WorkSchema],
    links: {
      github: String,
      linkedin: String,
      portfolio: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", ProfileSchema);
