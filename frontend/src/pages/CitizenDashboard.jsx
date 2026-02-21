import React, { useState } from 'react';

// ============================================
// CITIZEN DASHBOARD - LEGALMATCH THEME
// Clean version for post-signin
// ============================================

function CitizenDashboard() {
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
          padding: 48px 40px;
          border-radius: 12px;
          color: white;
          margin-bottom: 32px;
          text-align: center;
        }

        .welcome-title {
          font-family: 'Lora', serif;
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .welcome-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 32px;
        }

        .cta-button {
          background: #A8312D;
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .cta-button:hover {
          background: #7C221E;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(168, 49, 45, 0.3);
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .action-card {
          background: white;
          padding: 28px 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
          border-color: #A8312D;
        }

        .action-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          background: #FEF2F2;
          color: #A8312D;
        }

        .action-title {
          font-weight: 600;
          font-size: 17px;
          color: #1F2937;
          margin-bottom: 8px;
        }

        .action-desc {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.5;
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
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .info-card {
          padding: 24px;
          background: #F9FAFB;
          border-radius: 10px;
          border-left: 4px solid #A8312D;
        }

        .info-card-title {
          font-weight: 600;
          font-size: 16px;
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
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          margin-top: 32px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #F3F4F6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #9CA3AF;
        }

        .empty-title {
          font-family: 'Lora', serif;
          font-size: 22px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 12px;
        }

        .empty-text {
          font-size: 15px;
          color: #6B7280;
          margin-bottom: 24px;
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

          .welcome-section {
            padding: 32px 24px;
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .welcome-title {
            font-size: 28px;
          }

          .welcome-subtitle {
            font-size: 16px;
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
              className={`nav-item ${activeNav === 'cases' ? 'active' : ''}`}
              onClick={() => setActiveNav('cases')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>My Cases</span>
            </div>

            <div
              className={`nav-item ${activeNav === 'lawyers' ? 'active' : ''}`}
              onClick={() => setActiveNav('lawyers')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Find Lawyers</span>
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
              className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveNav('profile')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>My Profile</span>
            </div>
          </nav>
        </aside>

        {/* Main Content — no 'expanded' class needed; margin-left:280px is default */}
        <main className="main-content">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="header-right">
              <div className="user-menu">
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
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
              <p className="welcome-subtitle">Access legal assistance and connect with qualified professionals</p>
              <button className="cta-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Submit Your First Case
              </button>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="action-card">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="action-title">Submit a Case</div>
                <div className="action-desc">Get matched with qualified lawyers for your legal needs</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <div className="action-title">Browse Lawyers</div>
                <div className="action-desc">Search our directory of lawyers and legal aid organizations</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="action-title">Get Support</div>
                <div className="action-desc">Chat with our team for immediate assistance</div>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div className="action-title">Legal Resources</div>
                <div className="action-desc">Learn about your legal rights and procedures</div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="info-section">
              <h2 className="section-title">How LegalMatch Works</h2>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-card-title">1. Submit Your Case</div>
                  <div className="info-card-text">
                    Describe your legal issue and provide relevant details. Our system will review your submission.
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">2. Get Matched</div>
                  <div className="info-card-text">
                    We'll connect you with qualified lawyers or legal aid organizations based on your needs.
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-title">3. Receive Assistance</div>
                  <div className="info-card-text">
                    Work directly with your matched lawyer to resolve your legal matter effectively.
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State for Cases */}
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="empty-title">No Cases Yet</h3>
              <p className="empty-text">You haven't submitted any cases. Start by submitting your first legal case.</p>
              <button className="cta-button">Submit Case</button>
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

export default CitizenDashboard;
