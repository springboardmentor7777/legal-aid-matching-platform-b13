export const sidebarMenu = {
  ADMIN: [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Users", path: "/admin/users", icon: "👥" },
  { name: "Lawyers", path: "/admin/lawyers", icon: "⚖️" },
  { name: "NGOs", path: "/admin/ngos", icon: "🤝" }
 ],

  USER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "My Requests", path: "/requests", icon: "📁" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],

  LAWYER: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Assigned Cases", path: "/cases", icon: "⚖️" },
    { name: "Clients", path: "/clients", icon: "👥" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],

  NGO: [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Community Requests", path: "/community", icon: "🤝" },
    { name: "Reports", path: "/reports", icon: "📑" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ],
};