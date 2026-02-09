import { useEffect, useState } from "react";
import axios from "axios";
import { Github, Linkedin, Globe, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import EducationSection from "./components/EducationSection";
import SkillsSection from "./components/SkillsSection";
import SearchBar from "./components/SearchBar";
import ProjectsSection from "./components/ProjectsSection";
import WorkExperienceSection from "./components/WorkExperienceSection";

interface Profile {
  name: string;
  email: string;
  education: string;
  skills: string[];
  projects: {
    _id?: string;
    title: string;
    description: string;
    links?: { github?: string; demo?: string };
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
  const [error, setError] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLogin();
    fetchProfile();
  }, []);

  const checkUserLogin = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile`, {
        timeout: 10000, // 10 second timeout
      });
      setProfile(res.data);
      setFilteredProjects(res.data.projects);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(true);
    }
  };

  if (error)
    return (
      <div className="error">
        Profile not found. Make sure backend is running and seeded.
      </div>
    );

  return (
    <div className="container">
      {/* Top Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "#f9f9f9",
          borderBottom: "1px solid #eee",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          Me-API
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#007bff",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "14px", color: "#333" }}>
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "1px solid #007bff",
                  color: "#007bff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Header */}
      {profile ? (
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
      ) : (
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#999" }}>Loading profile...</p>
        </div>
      )}

      {/* Education Section */}
      {profile ? (
        <EducationSection education={profile.education} />
      ) : (
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#999" }}>Loading education...</p>
        </div>
      )}

      {/* Skills Section */}
      {profile ? (
        <SkillsSection
          skills={profile.skills}
          onSkillsUpdate={(skills) => setProfile({ ...profile, skills })}
          apiBase={API_BASE}
          user={user}
          navigate={navigate}
        />
      ) : (
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#999" }}>Loading skills...</p>
        </div>
      )}

      {/* Search Bar */}
      {profile ? (
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={() => {}}
          projects={profile.projects}
          onFilteredProjectsUpdate={setFilteredProjects}
          apiBase={API_BASE}
        />
      ) : null}

      {/* Projects Section */}
      {profile ? (
        <ProjectsSection
          projects={profile.projects}
          searchTerm={searchTerm}
          filteredProjects={filteredProjects}
          onProjectsUpdate={(projects) => setProfile({ ...profile, projects })}
          onFilteredProjectsUpdate={setFilteredProjects}
          apiBase={API_BASE}
          user={user}
          navigate={navigate}
        />
      ) : (
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#999" }}>Loading projects...</p>
        </div>
      )}

      {/* Work Experience Section */}
      {profile ? (
        <WorkExperienceSection work={profile.work} />
      ) : (
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#999" }}>Loading work experience...</p>
        </div>
      )}
    </div>
  );
}

export default App;
