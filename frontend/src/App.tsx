import { useEffect, useState } from "react";
import axios from "axios";
import { Github, Linkedin, Globe } from "lucide-react";
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

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!profile)
    return (
      <div className="error">
        Profile not found. Make sure backend is running and seeded.
      </div>
    );

  return (
    <div className="container">
      {/* Header */}
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

      {/* Education Section */}
      <EducationSection education={profile.education} />

      {/* Skills Section */}
      <SkillsSection
        skills={profile.skills}
        onSkillsUpdate={(skills) => setProfile({ ...profile, skills })}
        apiBase={API_BASE}
      />

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={() => {}}
        projects={profile.projects}
        onFilteredProjectsUpdate={setFilteredProjects}
        apiBase={API_BASE}
      />

      {/* Projects Section */}
      <ProjectsSection
        projects={profile.projects}
        searchTerm={searchTerm}
        filteredProjects={filteredProjects}
        onProjectsUpdate={(projects) => setProfile({ ...profile, projects })}
        onFilteredProjectsUpdate={setFilteredProjects}
        apiBase={API_BASE}
      />

      {/* Work Experience Section */}
      <WorkExperienceSection work={profile.work} />
    </div>
  );
}

export default App;
