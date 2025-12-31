import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Atom, Languages } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold text-sm tracking-wide">
          Học tập thông minh cùng EduSpace
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
          Khám phá tri thức <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Mọi lúc, Mọi nơi
          </span>
        </h1>
        
        {/* Redesigned Description Section */}
        <div className="max-w-2xl mx-auto mb-12 flex flex-col items-center gap-4">
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium">
                Các công cụ hỗ trợ đắc lực cho việc học của bạn
            </p>
            
            <a 
                href="https://www.facebook.com/profile.php?id=61577861516987"
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm md:text-base bg-white dark:bg-slate-900/80 px-5 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Hãy góp ý tính năng — Chúng tôi luôn lắng nghe bạn</span>
            </a>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link to="/math" className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            Bắt đầu học Toán <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Toán học trực quan</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Tích hợp công cụ GeoGebra giúp hình dung các bài toán hình học không gian phức tạp một cách sống động.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Atom size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Vật lý ứng dụng</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Các bài học vật lý được thiết kế dễ hiểu, đi kèm các ví dụ thực tế và mô phỏng thí nghiệm.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
              <Languages size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Tiếng Anh toàn diện</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Cải thiện kỹ năng nghe, nói, đọc, viết với lộ trình học tập cá nhân hóa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;