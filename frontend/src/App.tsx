import { useEffect, useState } from "react";
import axios from "axios";
import {
  Github,
  Linkedin,
  Globe,
  Search,
  ExternalLink,
  GraduationCap,
  Code,
} from "lucide-react";
import "./index.css";

interface Profile {
  name: string;
  email: string;
  education: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    links: { github?: string; demo?: string };
  }[];
  work: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile`);
      setProfile(res.data);
      setFilteredProjects(res.data.projects);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      setFilteredProjects(profile?.projects || []);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/projects?skill=${searchTerm}`);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error("Error searching projects:", err);
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!profile)
    return (
      <div className="error">
        Profile not found. Make sure backend is running and seeded.
      </div>
    );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>{profile.name}</h1>
          <p style={{ color: "#666" }}>{profile.email}</p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {profile.links.github && (
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              <Github size={24} color="black" />
            </a>
          )}
          {profile.links.linkedin && (
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={24} color="black" />
            </a>
          )}
          {profile.links.portfolio && (
            <a href={profile.links.portfolio} target="_blank" rel="noreferrer">
              <Globe size={24} color="black" />
            </a>
          )}
        </div>
      </header>

      <section className="card">
        <h2 className="section-title">
          <GraduationCap size={20} style={{ marginRight: 8 }} />
          Education
        </h2>
        <p>{profile.education}</p>
      </section>

      <section className="card">
        <h2 className="section-title">
          <Code size={20} style={{ marginRight: 8 }} />
          Skills
        </h2>
        <div>
          {profile.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search projects by skill (e.g. React, Python)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>
          <Search size={20} />
        </button>
      </div>

      <h2 style={{ marginBottom: 20 }}>Projects</h2>
      <div className="grid">
        {filteredProjects.map((project, i) => (
          <div key={i} className="card">
            <h3>{project.title}</h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: 16 }}>
              {project.description}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link-icon"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="link-icon"
                >
                  <ExternalLink size={16} /> Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ margin: "40px 0 20px" }}>Work Experience</h2>
      <div>
        {profile.work.map((job, i) => (
          <div key={i} className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <h3>{job.position}</h3>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {job.duration}
              </span>
            </div>
            <h4 style={{ color: "#666", marginBottom: 12 }}>{job.company}</h4>
            <p style={{ fontSize: "15px" }}>{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
