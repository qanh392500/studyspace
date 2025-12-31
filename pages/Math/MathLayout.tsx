import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, ChevronLeft, Menu } from 'lucide-react';
import GeminiTutor from '../../components/GeminiTutor';

const MathLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64 border-r' : 'w-0'
        } bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col overflow-hidden whitespace-nowrap`}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 h-[60px]">
            <h2 className="font-bold text-slate-700 dark:text-slate-200">Menu Toán Học</h2>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Thu gọn"
            >
                <ChevronLeft size={20} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <NavLink 
            to="/math/geometry-3d" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Box size={20} />
            <span>Vẽ hình không gian</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* Toggle Button - Only visible when sidebar is closed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Mở menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex-1 w-full h-full overflow-y-auto">
            <Outlet />
        </div>
        
        {/* Gemini Tutor Widget - Only visible in Math section */}
        <GeminiTutor />
      </main>
    </div>
  );
};

export default MathLayout;