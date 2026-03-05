import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ProfileManagement from "../components/ProfileManagement";
import CaseSubmission from "../components/CaseSubmission";
import Directory from "../components/Directory";
import Matches from "../components/Matches";
import ImpactDashboard from "../components/ImpactDashboard";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";

export type SectionType =
  | "profile"
  | "cases"
  | "directory"
  | "matches"
  | "impact";

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileManagement />;
      case "cases":
        return <CaseSubmission />;
      case "directory":
        return <Directory />;
      case "matches":
        return <Matches />;
      case "impact":
        return <ImpactDashboard />;
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
        <main className="flex-1 p-8">{renderSection()}</main>
      </div>
    </div>
  );
}
