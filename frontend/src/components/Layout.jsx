import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between border-b bg-white" style={{ paddingLeft: '32px', paddingRight: '32px', borderColor: '#e2e8f0', flexShrink: 0 }}>
          <h2 className="text-lg font-semibold text-slate-800">LegalMatch Pro</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#4f46e5' }}>
              U
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
