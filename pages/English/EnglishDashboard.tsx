import React from 'react';
import { BookA, ArrowRight, Sparkles, MessageSquarePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnglishDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Trung Tâm Tiếng Anh</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10">
        Chọn một kỹ năng bạn muốn cải thiện hôm nay. Hệ thống sử dụng AI để cá nhân hóa lộ trình học của bạn.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Vocabulary - Active */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between">
                <div>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                        <BookA size={28} />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white">Học Từ Vựng Thông Minh</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        Nhập danh sách từ của bạn và để AI tạo ra các bài kiểm tra trắc nghiệm, gõ từ và đặt câu.
                    </p>
                </div>
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={() => navigate('/english/vocabulary')}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                    Bắt đầu học ngay
                    <ArrowRight size={18} />
                </button>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
             <Sparkles size={14} className="text-amber-500" />
             <span>Sử dụng phương pháp lặp lại ngắt quãng (SRS)</span>
          </div>
        </div>

        {/* Feedback / Planned Features */}
        <a 
            href="https://www.facebook.com/profile.php?id=61577861516987" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer h-full"
        >
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquarePlus className="text-indigo-500 dark:text-indigo-400" size={32} />
            </div>
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Tính năng dự kiến phát triển</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                Bạn muốn tính năng nào tiếp theo (Luyện nói, Luyện viết...)? <br/>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium mt-2 inline-block group-hover:underline">Hãy góp ý cho chúng tôi tại đây</span>
            </p>
        </a>
      </div>
    </div>
  );
};

export default EnglishDashboard;