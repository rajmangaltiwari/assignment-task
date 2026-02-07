interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface WorkExperienceSectionProps {
  work: WorkExperience[];
}

export default function WorkExperienceSection({
  work,
}: WorkExperienceSectionProps) {
  return (
    <div>
      <h2 style={{ margin: "40px 0 20px" }}>Work Experience</h2>
      <div>
        {work.map((job, i) => (
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
