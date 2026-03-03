import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ProfileManagement from "../components/ProfileManagement";
import CaseSubmission from "../components/CaseSubmission";
import Directory from "../components/Directory";
import Matches from "../components/Matches";
import ImpactDashboard from "../components/ImpactDashboard";

export type SectionType =
  | "profile"
  | "cases"
  | "directory"
  | "matches"
  | "impact";

export default function AdminPanel() {
  const [activeSection, setActiveSection] =
    useState<SectionType>("profile");

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
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar
        active={activeSection}
        setActive={setActiveSection}
      />
      <main className="flex-1 p-8">{renderSection()}</main>
    </div>
  );
}