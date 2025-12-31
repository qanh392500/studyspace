import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ChevronLeft, Menu, Wind, Activity, Thermometer, FlaskConical, Microscope, Atom } from 'lucide-react';
import GeminiTutor from '../../components/GeminiTutor';

const PhysicsLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64 border-r' : 'w-0'
        } bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col overflow-hidden whitespace-nowrap`}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 h-[60px]">
            <div className="flex items-center gap-2">
                <Atom className="text-purple-600 dark:text-purple-400" size={24} />
                <h2 className="font-bold text-slate-700 dark:text-slate-200">Menu Vật Lý</h2>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Thu gọn"
            >
                <ChevronLeft size={20} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          
          {/* Chapter 1 */}
          <div className="mb-6">
            <div className="px-4 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Chương 1: Nhiệt Học
            </div>
            <NavLink 
                to="/physics/kinetic-theory" 
                className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
                }
            >
                <Wind size={20} />
                <span>Thuyết Động Học</span>
            </NavLink>
            <NavLink 
                to="/physics/thermodynamics" 
                className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
                }
            >
                <Activity size={20} />
                <span>Nhiệt Động Lực</span>
            </NavLink>
            <NavLink 
                to="/physics/heating-curve" 
                className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
                }
            >
                <Thermometer size={20} />
                <span>Quá Trình Nung Nóng</span>
            </NavLink>
          </div>

          {/* Chapter 2 */}
          <div className="mb-6">
            <div className="px-4 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Chương 2: Chất Khí
            </div>
            <NavLink 
                to="/physics/gas-laws" 
                className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
                }
            >
                <FlaskConical size={20} />
                <span>Định Luật Chất Khí</span>
            </NavLink>
            <NavLink 
                to="/physics/molecular-dynamics" 
                className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
                }
            >
                <Microscope size={20} />
                <span>Mô Hình Động Học</span>
            </NavLink>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* Toggle Button - Only visible when sidebar is closed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Mở menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex-1 w-full h-full overflow-hidden">
            <Outlet />
        </div>
        
        {/* Gemini Tutor Widget */}
        <GeminiTutor />
      </main>
    </div>
  );
};

export default PhysicsLayout;