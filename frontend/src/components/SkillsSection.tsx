import { useState } from "react";
import { Code, Edit2, X, Plus } from "lucide-react";
import axios from "axios";

interface SkillsSectionProps {
  skills: string[];
  onSkillsUpdate: (skills: string[]) => void;
  apiBase: string;
  user?: any;
  navigate?: any;
}

export default function SkillsSection({
  skills,
  onSkillsUpdate,
  apiBase,
  user,
  navigate,
}: SkillsSectionProps) {
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleEditClick = () => {
    if (!user) {
      navigate?.("/login");
      return;
    }
    setEditingSkills(!editingSkills);
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post(`${apiBase}/skills`, { skill: newSkill });
      onSkillsUpdate(res.data);
      setNewSkill("");
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    try {
      const res = await axios.delete(`${apiBase}/skills/${skillName}`);
      onSkillsUpdate(res.data.skills);
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  return (
    <section className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="section-title">
          <Code size={20} style={{ marginRight: 8 }} />
          Skills
        </h2>
        <button
          onClick={handleEditClick}
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
            {skills.map((skill) => (
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
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
