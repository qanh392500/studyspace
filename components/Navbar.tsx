import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calculator, Atom, Languages, GraduationCap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${isActive
      ? 'bg-indigo-600 text-white shadow-md'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '/'}>
            <img src="/avt.png" alt="Logo" className="h-10 w-10 rounded-full object-cover shadow-sm" />
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Garanmath</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex space-x-1 mr-4">
              <NavLink to="/" className={navClass}>
                <Home size={18} />
                <span>Trang chủ</span>
              </NavLink>
              <NavLink to="/math" className={navClass}>
                <Calculator size={18} />
                <span>Toán</span>
              </NavLink>
              <NavLink to="/physics" className={navClass}>
                <Atom size={18} />
                <span>Vật lý</span>
              </NavLink>
              <NavLink to="/english" className={navClass}>
                <Languages size={18} />
                <span>Tiếng Anh</span>
              </NavLink>
            </div>

            {/* Theme Toggle */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile menu button could go here */}
        </div>
      </div>
    </nav >
  );
};

export default Navbar;