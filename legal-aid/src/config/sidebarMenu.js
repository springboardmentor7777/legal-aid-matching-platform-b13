export const sidebarMenu = {
  ADMIN: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Lawyers", path: "/admin/lawyers", icon: "⚖️" },
    { name: "NGOs", path: "/admin/ngos", icon: "🤝" },
  ],

  USER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Submit Case", path: "/submit-case", icon: "📝" },
    { name: "My Cases", path: "/my-cases", icon: "📁" },
    { name: "My Matches", path: "/matches", icon: "🔗" },
    { name: "Messages", path: "/chat", icon: "💬" },
    { name: "Appointments", path: "/appointments", icon: "📅" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
    { name: "Find Lawyers", path: "/lawyers", icon: "⚖️" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],

  LAWYER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Assigned Cases", path: "/lawyer/cases", icon: "⚖️" },
    { name: "Case Requests", path: "/matches", icon: "🔗" },
    { name: "Messages", path: "/chat", icon: "💬" },
    { name: "Appointments", path: "/appointments", icon: "📅" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],

  NGO: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Community Cases", path: "/ngo/cases", icon: "🤝" },
    { name: "Case Requests", path: "/matches", icon: "🔗" },
    { name: "Messages", path: "/chat", icon: "💬" },
    { name: "Appointments", path: "/appointments", icon: "📅" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],
};