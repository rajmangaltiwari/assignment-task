import { Search } from "lucide-react";
import axios from "axios";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  projects: any[];
  onFilteredProjectsUpdate: (projects: any[]) => void;
  apiBase: string;
}

export default function SearchBar({
  searchTerm,
  onSearchTermChange,
  projects,
  onFilteredProjectsUpdate,
  apiBase,
}: SearchBarProps) {
  const handleSearch = async () => {
    if (!searchTerm) {
      onFilteredProjectsUpdate(projects);
      return;
    }
    try {
      const res = await axios.get(`${apiBase}/projects?skill=${searchTerm}`);
      onFilteredProjectsUpdate(res.data);
    } catch (err) {
      console.error("Error searching projects:", err);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search projects by skill (e.g. React, Python)..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>
        <Search size={20} />
      </button>
    </div>
  );
}
