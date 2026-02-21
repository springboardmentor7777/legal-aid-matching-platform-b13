import React, { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationData, setVerificationData] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Lawyer', email: 'alice.j@example.com', date: '2024-03-10', status: 'Pending' },
    { id: 2, name: 'LegalAid Corps', role: 'NGO', email: 'info@legalaid.org', date: '2024-03-12', status: 'Pending' },
    { id: 3, name: 'Bob Smith', role: 'Lawyer', email: 'bob.s@example.com', date: '2024-03-05', status: 'Approved' },
    { id: 4, name: 'Community Justice', role: 'NGO', email: 'contact@cjustice.org', date: '2024-03-08', status: 'Rejected' },
    { id: 5, name: 'Charlie Brown', role: 'Lawyer', email: 'charlie.b@example.com', date: '2024-03-15', status: 'Pending' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');

  const filteredData = verificationData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (user) => {
    setSelectedUser(user);
    setActionType('approve');
    setModalOpen(true);
  };

  const handleReject = (user) => {
    setSelectedUser(user);
    setActionType('reject');
    setModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedUser) {
      setVerificationData(prevData =>
        prevData.map(item =>
          item.id === selectedUser.id
            ? { ...item, status: actionType === 'approve' ? 'Approved' : 'Rejected' }
            : item
        )
      );
    }
    setModalOpen(false);
    setSelectedUser(null);
  };

  const cancelAction = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setActionType('');
  };

  const handleViewDetails = (user) => {
    alert(`Viewing details for:\n\nName: ${user.name}\nRole: ${user.role}\nEmail: ${user.email}\nDate: ${user.date}\nStatus: ${user.status}`);
  };

  const pendingCount = verificationData.filter(item => item.status === 'Pending').length;
  const approvedCount = verificationData.filter(item => item.status === 'Approved').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #F4F6F8;
          color: #2C2C2C;
          line-height: 1.6;
        }

        /* Dashboard Container */
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        /* ============================================ */
        /* SIDEBAR STYLES - FIXED Z-INDEX */
        /* ============================================ */
        
        .sidebar {
          width: 260px;
          background: #1E2A38;
          color: white;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar.collapsed {
          transform: translateX(-100%);
        }

        .logo-section {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1001;
          background: #1E2A38;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #C9A96A, #B89655);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'Crimson Pro', serif;
          font-size: 20px;
          font-weight: 700;
          white-space: nowrap;
          overflow: visible;
        }

        .nav-menu {
          padding: 24px 0;
        }

        .nav-item {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .nav-item.active {
          background: rgba(201, 169, 106, 0.15);
          color: #C9A96A;
          border-left-color: #C9A96A;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ============================================ */
        /* MAIN CONTENT STYLES */
        /* ============================================ */
        
        .main-content {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .main-content.expanded {
          margin-left: 0;
        }

        /* Header */
        .header {
          background: white;
          padding: 20px 32px;
          box-shadow: 0 2px 4px rgba(30, 42, 56, 0.08);
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
          gap: 16px;
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
          background: #2C2C2C;
          margin: 5px 0;
        }

        .page-title {
          font-family: 'Crimson Pro', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1E2A38;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          transition: transform 0.2s ease;
        }

        .notification-btn:hover {
          transform: scale(1.1);
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 10px;
          height: 10px;
          background: #E74C3C;
          border-radius: 50%;
          border: 2px solid white;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .user-profile:hover {
          background: #F4F6F8;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A96A, #1E2A38);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        /* Content Area */
        .content-area {
          padding: 32px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(30, 42, 56, 0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #C9A96A;
          animation: fadeIn 0.5s ease;
        }

        .stat-card:hover {
          box-shadow: 0 4px 16px rgba(30, 42, 56, 0.12);
          transform: translateY(-2px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-label {
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: #1E2A38;
          margin-bottom: 8px;
        }

        .stat-trend {
          font-size: 13px;
          color: #10B981;
          font-weight: 500;
        }

        /* Tab Navigation */
        .tab-navigation {
          background: white;
          padding: 24px 32px 0;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(30, 42, 56, 0.08);
          margin-bottom: 32px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #E1E4E8;
          overflow-x: auto;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .tab:hover {
          color: #1E2A38;
          background: rgba(201, 169, 106, 0.05);
        }

        .tab.active {
          color: #C9A96A;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #C9A96A;
        }

        /* Content Card */
        .content-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(30, 42, 56, 0.08);
          padding: 24px;
          animation: fadeIn 0.5s ease;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .card-title {
          font-family: 'Crimson Pro', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1E2A38;
        }

        .card-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin-top: 4px;
        }

        .search-box {
          position: relative;
          max-width: 300px;
          flex: 1;
          min-width: 200px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 2px solid #E1E4E8;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #C9A96A;
          box-shadow: 0 0 0 3px rgba(201, 169, 106, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        /* Table */
        .table-container {
          overflow-x: auto;
          border-radius: 8px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #F9FAFB;
        }

        th {
          padding: 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 2px solid #E1E4E8;
        }

        td {
          padding: 18px 16px;
          border-bottom: 1px solid #E1E4E8;
          font-size: 14px;
        }

        tbody tr {
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: #F9FAFB;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .status-pending {
          background: #FFF4E6;
          color: #E67E22;
        }

        .status-approved {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .status-rejected {
          background: #FFEBEE;
          color: #C62828;
        }

        /* Buttons */
        .btn {
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-gold {
          background: #C9A96A;
          color: white;
        }

        .btn-gold:hover {
          background: #B89655;
          box-shadow: 0 4px 12px rgba(201, 169, 106, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: #6B7280;
          border: 2px solid #E1E4E8;
        }

        .btn-outline:hover {
          border-color: #C9A96A;
          color: #C9A96A;
          background: rgba(201, 169, 106, 0.05);
        }

        .btn-danger {
          background: #EF4444;
          color: white;
        }

        .btn-danger:hover {
          background: #DC2626;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease;
        }

        .modal {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
          position: relative;
          z-index: 2001;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .modal-icon.approve {
          background: #E8F5E9;
        }

        .modal-icon.reject {
          background: #FFEBEE;
        }

        .modal-title {
          font-family: 'Crimson Pro', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1E2A38;
        }

        .modal-body {
          margin-bottom: 24px;
        }

        .user-info {
          background: #F9FAFB;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }

        .user-info p {
          margin: 8px 0;
          font-size: 14px;
        }

        .user-info strong {
          color: #1E2A38;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
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

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

          .header {
            padding: 16px 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-box {
            width: 100%;
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .page-title {
            font-size: 22px;
          }

          .stat-value {
            font-size: 28px;
          }

          .tabs {
            gap: 4px;
          }

          .tab {
            padding: 10px 16px;
            font-size: 14px;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .modal {
            padding: 24px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .modal-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="logo-section">
            <div className="logo-icon">⚖️</div>
            <div className="logo-text">LegalMatch Pro</div>
          </div>
          
          <nav className="nav-menu">
            <div className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </div>
            
            <div className="nav-item active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
              <span>User Verification</span>
            </div>
            
            <div className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Directory Management</span>
            </div>
            
            <div className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>System Logs</span>
            </div>
            
            <div className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>App Settings</span>
            </div>
            
            <div className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <span>Analytics</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <h1 className="page-title">Admin Panel</h1>
            </div>
            
            <div className="header-right">
              <button className="notification-btn" onClick={() => alert('You have 3 new notifications')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge"></span>
              </button>
              
              <div className="user-profile" onClick={() => alert('Profile menu clicked')}>
                <div className="user-avatar">AD</div>
                <span>Admin</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="content-area">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Pending Verifications</div>
                  </div>
                  <div className="stat-icon" style={{background: '#FFF4E6'}}>
                    ⏰
                  </div>
                </div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-trend">Requires attention</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Total Approved Users</div>
                  </div>
                  <div className="stat-icon" style={{background: '#E8F5E9'}}>
                    ✅
                  </div>
                </div>
                <div className="stat-value">{approvedCount}</div>
                <div className="stat-trend">↑ 12% this month</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">Active Cases</div>
                  </div>
                  <div className="stat-icon" style={{background: '#E3F2FD'}}>
                    📋
                  </div>
                </div>
                <div className="stat-value">584</div>
                <div className="stat-trend">↑ 8% this week</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div>
                    <div className="stat-label">System Health</div>
                  </div>
                  <div className="stat-icon" style={{background: '#E8F5E9'}}>
                    💚
                  </div>
                </div>
                <div className="stat-value">99.8%</div>
                <div className="stat-trend">All systems operational</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
                  onClick={() => setActiveTab('verification')}
                >
                  User Verification
                </button>
                <button 
                  className={`tab ${activeTab === 'directory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('directory')}
                >
                  Directory Ingestion
                </button>
                <button 
                  className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('logs')}
                >
                  System Logs
                </button>
                <button 
                  className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  App Settings
                </button>
              </div>
            </div>

            {/* Content Card */}
            <div className="content-card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">User Verification Queue</h2>
                  <p className="card-subtitle">Review and approve/reject profiles for Lawyers and NGOs</p>
                </div>
                <div className="search-box">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.name}</strong></td>
                          <td>{item.role}</td>
                          <td>{item.email}</td>
                          <td>{item.date}</td>
                          <td>
                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {item.status === 'Pending' ? (
                                <>
                                  <button className="btn btn-gold" onClick={() => handleApprove(item)}>
                                    ✓ Approve
                                  </button>
                                  <button className="btn btn-danger" onClick={() => handleReject(item)}>
                                    ✗ Reject
                                  </button>
                                </>
                              ) : (
                                <button className="btn btn-outline" onClick={() => handleViewDetails(item)}>
                                  👁️ View Details
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                          No users found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div className="overlay active" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Confirmation Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div className={`modal-icon ${actionType}`}>
                  {actionType === 'approve' ? '✅' : '❌'}
                </div>
                <div>
                  <h2 className="modal-title">
                    {actionType === 'approve' ? 'Approve User' : 'Reject User'}
                  </h2>
                </div>
              </div>
              
              <div className="modal-body">
                <p style={{color: '#6B7280', marginBottom: '16px'}}>
                  {actionType === 'approve' 
                    ? 'Are you sure you want to approve this user? They will be granted access to the platform.'
                    : 'Are you sure you want to reject this user? They will be notified of the decision.'}
                </p>
                
                {selectedUser && (
                  <div className="user-info">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Role:</strong> {selectedUser.role}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Submitted:</strong> {selectedUser.date}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={cancelAction}>
                  Cancel
                </button>
                <button 
                  className={`btn ${actionType === 'approve' ? 'btn-gold' : 'btn-danger'}`}
                  onClick={confirmAction}
                >
                  {actionType === 'approve' ? '✓ Confirm Approval' : '✗ Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
