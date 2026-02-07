const mongoose = require("mongoose");
require("dotenv").config();
const Profile = require("./models/Profile");

const seedData = {
  name: "Rajmangal Tiwari",
  email: "rajmangltiwari@gmail.com",
  education: "Bachelor of Technology in Computer Science",
  skills: [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "TypeScript",
    "Express",
    "Vite",
  ],
  projects: [
    {
      title: "Self-Portfolio API",
      description:
        "A MERN stack application to manage personal profile and projects.",
        skills: ["React", "Node.js", "MongoDB"],
      links: {
        github: "https://github.com/rajmangltiwari/me-api",
        demo: "https://me-api-demo.com",
      },
    },
    {
      title: "Cloud Function Orchestrator",
      description:
        "Automated deployment and management of Google Cloud Functions using Python.",
        skills: ["Python", "Google Cloud"],
      links: {
        github: "https://github.com/rajmangaltiwari/gcf-orchestrator",
      },
    },
  ],
  work: [
    {
      company: "Tech Solutions Inc.",
      position: "Full Stack Developer",
      duration: "2023 - Present",
      description:
        "Working on scalable web applications using React and Node.js.",
    },
  ],
  links: {
    github: "https://github.com/rajmangaltiwari",
    linkedin: "https://linkedin.com/in/rajmangaltiwari",
    portfolio: "https://rajmangal.live",
  },
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    await Profile.deleteMany({});
    await Profile.create(seedData);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
