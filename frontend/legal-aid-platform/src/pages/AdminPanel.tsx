import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ProfileManagement from "../components/ProfileManagement";
import CaseSubmission from "../components/CaseSubmission";
import Directory from "../components/Directory";
import Matches from "../components/Matches";
import ImpactDashboard from "../components/Impact";   // ← use the richer Impact.tsx
import Admin from "../pages/Admin";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import NGOIngest from "../components/NGOIngest";
import LawyerIngest from "../components/LawyerIngest";
import ExternalDirectory from "../components/ExternalDirectory";
import Verification from "../components/Verification";
import SystemLogs from "../components/SystemLogs";

// "admin" added so AdminSidebar can highlight the Admin Panel link
export type SectionType =
  | "profile"
  | "cases"
  | "directory"
  | "matches"
  | "impact"
  | "verification"
  | "lawyerIngest"
  | "NGOIngest"
  | "ExternalDirectory"
  | "SystemLogs";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileManagement />;
      case "cases":
        return <CaseSubmission />;
      // case "directory":
      //   return <Directory />;
      case "matches":
        return <Matches />;
      case "impact":
        return <ImpactDashboard />;
      case "verification":
        return <Verification />;
      case "lawyerIngest":
        return <LawyerIngest />;
      case "NGOIngest":
        return <NGOIngest />;
      case "ExternalDirectory":
        return <ExternalDirectory />;
      case "SystemLogs":
        return <SystemLogs />;
      default:
        return <ProfileManagement />;
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          title="admin panel"
          name={user?.username || "admin"}
          role={user?.role || "guest"}
          toggleSidebar={() => {}}
        />
      </div>
      <div className="min-h-screen flex bg-gray-50 mt-20">
        <AdminSidebar active={activeSection} setActive={setActiveSection} />
        <main className="flex-1 p-8 overflow-auto">{renderSection()}</main>
      </div>
    </div>
  );
}
