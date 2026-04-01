export const sidebarMenu = {
  ADMIN: [
    { name: "Dashboard",      path: "/dashboard",          icon: "🏠" },
    { name: "Users",          path: "/admin/users",        icon: "👥" },
    { name: "Lawyers",        path: "/admin/lawyers",      icon: "⚖️" },
    { name: "NGOs",           path: "/admin/ngos",         icon: "🤝" },
    { name: "Verification",   path: "/admin/verification", icon: "✅" },
    { name: "Analytics",      path: "/admin/analytics",    icon: "📈" },
    { name: "System Logs",    path: "/admin/system-logs",  icon: "🖥️" },
  ],

  USER: [
    { name: "Dashboard",        path: "/dashboard",    icon: "📊" },
    { name: "Submit Case",      path: "/submit-case",  icon: "📝" },
    { name: "My Cases",         path: "/my-cases",     icon: "📁" },
    { name: "Find Lawyers/NGOs",path: "/lawyers",      icon: "⚖️" },
    { name: "My Requests",      path: "/matches",      icon: "🔗" },
    { name: "Messages",         path: "/chat",         icon: "💬" },
    { name: "Appointments",     path: "/appointments", icon: "📅" },
    { name: "Notifications",    path: "/notifications",icon: "🔔" },
    { name: "Profile",          path: "/profile",      icon: "👤" },
  ],

  LAWYER: [
    { name: "Dashboard",        path: "/dashboard",    icon: "📊" },
    { name: "Case Requests",    path: "/matches",      icon: "🔗" },
    { name: "Messages",         path: "/chat",         icon: "💬" },
    { name: "Appointments",     path: "/appointments", icon: "📅" },
    { name: "Notifications",    path: "/notifications",icon: "🔔" },
    { name: "Profile",          path: "/profile",      icon: "👤" },
  ],

  NGO: [
    { name: "Dashboard",        path: "/dashboard",    icon: "📊" },
    { name: "Case Requests",    path: "/matches",      icon: "🔗" },
    { name: "Messages",         path: "/chat",         icon: "💬" },
    { name: "Appointments",     path: "/appointments", icon: "📅" },
    { name: "Notifications",    path: "/notifications",icon: "🔔" },
    { name: "Profile",          path: "/profile",      icon: "👤" },
  ],
};