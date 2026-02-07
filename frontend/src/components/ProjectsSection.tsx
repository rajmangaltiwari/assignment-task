import { useState } from "react";
import { Github, ExternalLink, Plus, Trash2 } from "lucide-react";
import axios from "axios";

interface Project {
  _id?: string;
  title: string;
  description: string;
  skills?: string[];
  links?: { github?: string; demo?: string };
}

interface ProjectsSectionProps {
  projects: Project[];
  searchTerm: string;
  filteredProjects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
  onFilteredProjectsUpdate: (projects: Project[]) => void;
  apiBase: string;
}

const initialProjectState = {
  title: "",
  description: "",
  skills: [] as string[],
  links: { github: "", demo: "" },
};

export default function ProjectsSection({
  filteredProjects,
  onProjectsUpdate,
  onFilteredProjectsUpdate,
  apiBase,
}: ProjectsSectionProps) {
  const [addingProject, setAddingProject] = useState(false);
  const [newProject, setNewProject] = useState(initialProjectState);
  const [newProjectSkill, setNewProjectSkill] = useState("");

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
      const res = await axios.post(`${apiBase}/projects`, projectData);
      onProjectsUpdate(res.data);
      onFilteredProjectsUpdate(res.data);
      setNewProject(initialProjectState);
      setAddingProject(false);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleDeleteProject = async (projectId?: string) => {
    if (!projectId) return;
    try {
      const res = await axios.delete(`${apiBase}/projects/${projectId}`);
      onProjectsUpdate(res.data);
      onFilteredProjectsUpdate(res.data);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div>
      <h2
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
          style={{
            marginBottom: 20,
            background: "#f9f9f9",
            borderLeft: "4px solid #007bff",
          }}
        >
          <h3 style={{ marginBottom: 16 }}>New Project</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
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
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
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
                    if (
                      newProjectSkill.trim() &&
                      !newProject.skills.includes(newProjectSkill)
                    ) {
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
                  if (
                    newProjectSkill.trim() &&
                    !newProject.skills.includes(newProjectSkill)
                  ) {
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
                  <span
                    key={skill}
                    className="skill-tag"
                    style={{ marginRight: "6px" }}
                  >
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
                  setNewProject(initialProjectState);
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
        {filteredProjects.map((project) => (
          <div key={project._id} className="card" style={{ position: "relative" }}>
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
    </div>
  );
}
