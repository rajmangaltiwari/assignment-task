import { GraduationCap } from "lucide-react";

interface EducationSectionProps {
  education: string;
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section className="card">
      <h2 className="section-title">
        <GraduationCap size={20} style={{ marginRight: 8 }} />
        Education
      </h2>
      <p>{education}</p>
    </section>
  );
}
