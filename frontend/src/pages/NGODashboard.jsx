import React, { useState } from 'react';

// ============================================
// NGO DASHBOARD - LEGALMATCH THEME
// Clean version for post-signin
// ============================================

function NGODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #F9FAFB;
          color: #1F2937;
          line-height: 1.6;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: #374151;
          color: white;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        .logo-section {
          padding: 28px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .logo-icon {
          font-size: 32px;
        }

        .logo-text {
          font-family: 'Lora', serif;
          font-size: 24px;
          font-weight: 700;
        }

        .logo-text .legal {
          color: white;
        }

        .logo-text .match {
          color: #A8312D;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(168, 49, 45, 0.2);
          color: #FCA5A5;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
        }

        .nav-menu {
          padding: 24px 0;
        }

        .nav-item {
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .nav-item.active {
          background: rgba(168, 49, 45, 0.2);
          color: white;
          border-left-color: #A8312D;
        }

        .nav-icon {
          width: 22px;
          height: 22px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }

        /* Header */
        .header {
          background: white;
          padding: 20px 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .menu-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background: #374151;
          margin: 5px 0;
        }

        .page-title {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1F2937;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .user-menu:hover {
          background: #F9FAFB;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #A8312D, #7C221E);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 15px;
        }

        /* Content Area */
        .content-area {
          padding: 32px;
        }

        /* Welcome Section */
        .welcome-section {
          background: linear-gradient(135deg, #374151 0%, #1F2937 100%);
          padding: 40px;
          border-radius: 12px;
          color: white;
          margin-bottom: 32px;
        }

        .welcome-title {
          font-family: 'Lora', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-left: 4px solid #A8312D;
        }

        .stat-label {
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 8px;
        }

        .stat-trend {
          font-size: 13px;
          color: #6B7280;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .action-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
          border-color: #A8312D;
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          background: #FEF2F2;
          color: #A8312D;
        }

        .action-title {
          font-weight: 600;
          font-size: 16px;
          color: #1F2937;
          margin-bottom: 6px;
        }

        .action-desc {
          font-size: 13px;
          color: #6B7280;
        }

        /* Info Section */
        .info-section {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
        }

        .section-title {
          font-family: 'Lora', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .info-card {
          padding: 20px;
          background: #F9FAFB;
          border-radius: 10px;
          border-left: 4px solid #A8312D;
        }

        .info-card-title {
          font-weight: 600;
          font-size: 15px;
          color: #1F2937;
          margin-bottom: 8px;
        }

        .info-card-text {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 50px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #F3F4F6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #9CA3AF;
        }

        .empty-title {
          font-family: 'Lora', serif;
          font-size: 20px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 10px;
        }

        .empty-text {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 20px;
        }

        /* Button */
        .btn-primary {
          background: #A8312D;
          color: white;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #7C221E;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(168, 49, 45, 0.3);
        }

        /* Overlay */
        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .overlay.active {
          display: block;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
          }

          .menu-toggle {
            display: block;
          }

          .content-area {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .welcome-title {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">⚖️</span>
              <div className="logo-text">
                <span className="legal">Legal</span>
                <span className="match">Match</span>
              </div>
            </div>
            <div className="role-badge">NGO</div>
          </div>

          <nav className="nav-menu">
            <div
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('dashboard')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'programs' ? 'active' : ''}`}
              onClick={() => setActiveNav('programs')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="23" y1="21" x2="18" y2="16"></line>
              </svg>
              <span>Our Programs</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveNav('clients')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
              <span>Clients Served</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'impact' ? 'active' : ''}`}
              onClick={() => setActiveNav('impact')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <span>Impact Report</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveNav('messages')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Messages</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('settings')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
              </svg>
              <span>Settings</span>
            </div>
          </nav>
        </aside>

        {/* Main Content — margin-left:280px always on desktop, 0 on mobile via CSS */}
        <main className="main-content">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <h1 className="page-title">NGO Dashboard</h1>
            </div>

            <div className="header-right">
              <div className="user-menu">
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="23" y1="21" x2="18" y2="16"></line>
                  </svg>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="content-area">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome to LegalMatch</h1>
              <p className="welcome-subtitle">Coordinate outreach programs and track your community impact</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Clients Served</div>
                <div className="stat-value">0</div>
                <div className="stat-trend">Start helping your community</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Active Programs</div>
                <div className="stat-value">0</div>
                <div className="stat-trend">Launch your first program</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Cases Handled</div>
                <div className="stat-value">0</div>
                <div className="stat-trend">Build your impact</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Community Reach</div>
                <div className="stat-value">0</div>
                <div className="stat-trend">Expand your outreach</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="action-card">
                <div className="action-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <div className="action-title">Create Program</div>
                <div className="action-desc">Launch a new outreach program</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17 11 19 13 23 9"></polyline>
                  </svg>
                </div>
                <div className="action-title">Manage Clients</div>
                <div className="action-desc">Track clients you've assisted</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
                <div className="action-title">View Reports</div>
                <div className="action-desc">Track your impact metrics</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6"></path>
                  </svg>
                </div>
                <div className="action-title">Organization Settings</div>
                <div className="action-desc">Update your NGO profile</div>
              </div>
            </div>

            {/* Getting Started Section */}
            <div className="info-section">
              <h2 className="section-title">Getting Started with LegalMatch</h2>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-card-title">Set Up Your Organization</div>
                  <div className="info-card-text">
                    Complete your NGO profile with mission, services offered, and contact information.
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">Create Outreach Programs</div>
                  <div className="info-card-text">
                    Design and launch legal aid programs targeting specific communities or legal issues.
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">Track Your Impact</div>
                  <div className="info-card-text">
                    Monitor clients served, cases handled, and measure your community impact over time.
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="23" y1="21" x2="18" y2="16"></line>
                </svg>
              </div>
              <h3 className="empty-title">No Active Programs</h3>
              <p className="empty-text">You haven't created any outreach programs yet. Start making an impact today.</p>
              <button className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Your First Program
              </button>
            </div>
          </div>
        </main>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="overlay active" onClick={() => setSidebarOpen(false)}></div>
        )}
      </div>
    </>
  );
}

export default NGODashboard;
