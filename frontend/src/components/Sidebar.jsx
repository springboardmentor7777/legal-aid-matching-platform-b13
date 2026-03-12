import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Shield,
  LogOut,
  Scale,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toUpperCase() || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Dashboard path per role */
  const dashboardPath =
    role === 'LAWYER' ? '/lawyer/dashboard' :
    role === 'NGO' ? '/ngo/dashboard' :
    role === 'ADMIN' ? '/admin' :
    '/citizen/dashboard';

  /* Build nav items */
  const navItems = [
    { to: dashboardPath, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/directory', label: 'Directory', icon: Search },
  ];

  if (role === 'CITIZEN') {
    navItems.push({ to: '/case-submission', label: 'Submit Case', icon: FileText });
  }
  if (role === 'ADMIN') {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: Shield });
  }
  navItems.push({ to: '/profile', label: 'Profile', icon: User });

  return (
    <aside className="flex flex-col h-screen text-white" style={{ width: '256px', backgroundColor: '#0f172a', flexShrink: 0 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b" style={{ padding: '20px 24px', borderColor: '#1e293b' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4f46e5' }}>
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">LegalMatch Pro</h1>
          <p className="text-xs" style={{ color: '#94a3b8' }}>Legal Aid Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 12px' }}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  padding: '10px 12px',
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                })}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t" style={{ padding: '16px', borderColor: '#1e293b' }}>
        <div className="flex items-center gap-3 mb-3" style={{ padding: '0 4px' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#4f46e5' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors"
          style={{ padding: '10px 12px', color: '#94a3b8', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
