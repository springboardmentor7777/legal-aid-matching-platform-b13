import React from "react";
import type { SectionType } from "../pages/AdminPanel";

interface Props {
  active: SectionType;
  setActive: (section: SectionType) => void;
}

const AdminSidebar: React.FC<Props> = ({
  active,
  setActive,
}) => {
  const linkClass = (section: SectionType) =>
    `cursor-pointer ${
      active === section
        ? "text-blue-900 font-semibold"
        : "hover:text-blue-600"
    }`;

  return (
    <aside className="w-64 bg-white p-6 border-r">
      <h1 className="font-bold text-xl mb-6 text-blue-900">
        LEGAL AID MATCHING PLATFORM
      </h1>
      <nav className="flex flex-col space-y-3 text-sm text-gray-700">
        <span
          className={linkClass("profile")}
          onClick={() => setActive("profile")}
        >
          Profile Management
        </span>
        <span
          className={linkClass("cases")}
          onClick={() => setActive("cases")}
        >
          Case Submission
        </span>
        <span
          className={linkClass("directory")}
          onClick={() => setActive("directory")}
        >
          Directory
        </span>
        <span
          className={linkClass("matches")}
          onClick={() => setActive("matches")}
        >
          Matches
        </span>
        <span
          className={linkClass("impact")}
          onClick={() => setActive("impact")}
        >
          Impact Dashboard
        </span>
        <span
          className={linkClass("lawyerIngest")}
          onClick={() => setActive("lawyerIngest")}
        >
          Ingest External Lawyer Data
        </span>
        <span
          className={linkClass("NGOIngest")}
          onClick={() => setActive("NGOIngest")}
        >
          Ingest External NGO Data
        </span>
        <span
          className={linkClass("ExternalDirectory")}
          onClick={() => setActive("ExternalDirectory")}
        >
          External Directory
        </span>
      </nav>
    </aside>
  );
};

export default AdminSidebar;