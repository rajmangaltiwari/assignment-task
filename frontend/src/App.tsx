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
  Edit2,
  X,
  Plus,
  Trash2,
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
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [addingProject, setAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    links: { github: "", demo: "" },
  });
  const [newProjectSkill, setNewProjectSkill] = useState("");

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

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/skills`, { skill: newSkill });
      setProfile({ ...profile!, skills: res.data });
      setNewSkill("");
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    try {
      const res = await axios.delete(`${API_BASE}/skills/${skillName}`);
      setProfile({ ...profile!, skills: res.data.skills });
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      alert("Please fill in title and description");
      return;
    }
    try {
      const projectData = {
        ...newProject,
        links: {
          github: newProject.links.github || undefined,
          demo: newProject.links.demo || undefined,
        },
      };
      const res = await axios.post(`${API_BASE}/projects`, projectData);
      setProfile({ ...profile!, projects: res.data });
      setFilteredProjects(res.data);
      setNewProject({ title: "", description: "", skills: [], links: { github: "", demo: "" } });
      setAddingProject(false);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await axios.delete(`${API_BASE}/projects/${projectId}`);
      setProfile({ ...profile!, projects: res.data });
      setFilteredProjects(res.data);
    } catch (err) {
      console.error("Error deleting project:", err);
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="section-title">
            <Code size={20} style={{ marginRight: 8 }} />
            Skills
          </h2>
          <button
            onClick={() => setEditingSkills(!editingSkills)}
            style={{
              background: "#333",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Edit2 size={16} />
            {editingSkills ? "Done" : "Edit"}
          </button>
        </div>

        {editingSkills ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Enter new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleAddSkill}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    paddingRight: "8px",
                  }}
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {profile.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}
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

      <h2 style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Projects
        <button
          onClick={() => setAddingProject(!addingProject)}
          style={{
            background: "#333",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          <Plus size={16} />
          {addingProject ? "Cancel" : "Add Project"}
        </button>
      </h2>

      {addingProject && (
        <div
          className="card"
          style={{ marginBottom: 20, background: "#f9f9f9", borderLeft: "4px solid #007bff" }}
        >
          <h3 style={{ marginBottom: 16 }}>New Project</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minHeight: "80px",
                fontFamily: "inherit",
              }}
            />
            <input
              type="url"
              placeholder="GitHub Link (optional)"
              value={newProject.links.github}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  links: { ...newProject.links, github: e.target.value },
                })
              }
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <input
              type="url"
              placeholder="Demo Link (optional)"
              value={newProject.links.demo}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  links: { ...newProject.links, demo: e.target.value },
                })
              }
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Add skill..."
                value={newProjectSkill}
                onChange={(e) => setNewProjectSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (newProjectSkill.trim() && !newProject.skills.includes(newProjectSkill)) {
                      setNewProject({
                        ...newProject,
                        skills: [...newProject.skills, newProjectSkill],
                      });
                      setNewProjectSkill("");
                    }
                  }
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={() => {
                  if (newProjectSkill.trim() && !newProject.skills.includes(newProjectSkill)) {
                    setNewProject({
                      ...newProject,
                      skills: [...newProject.skills, newProjectSkill],
                    });
                    setNewProjectSkill("");
                  }
                }}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
            {newProject.skills.length > 0 && (
              <div>
                {newProject.skills.map((skill) => (
                  <span key={skill} className="skill-tag" style={{ marginRight: "6px" }}>
                    {skill}
                    <button
                      onClick={() =>
                        setNewProject({
                          ...newProject,
                          skills: newProject.skills.filter((s) => s !== skill),
                        })
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        padding: "0 4px",
                        marginLeft: "4px",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleAddProject}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setAddingProject(false);
                  setNewProject({ title: "", description: "", skills: [], links: { github: "", demo: "" } });
                  setNewProjectSkill("");
                }}
                style={{
                  background: "#999",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid">
        {filteredProjects.map((project, i) => (
          <div key={i} className="card" style={{ position: "relative" }}>
            <button
              onClick={() => handleDeleteProject(project._id)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d32f2f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
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
