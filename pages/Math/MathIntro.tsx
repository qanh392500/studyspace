import React from 'react';
import { Box, Play, ArrowRight, ChevronDown, ChevronUp, MessageSquarePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exercises } from '../../data/geoGebraExercises';

const MathIntro: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const handleOpenExercise = (script: string) => {
    navigate('/math/geometry-3d', { state: { script } });
  };

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Chào mừng đến với Góc Học Toán</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10">
        Hãy chọn một công cụ từ menu bên trái để bắt đầu. Tại đây bạn có thể tiếp cận các công cụ toán học mạnh mẽ để hỗ trợ việc học tập và nghiên cứu.
      </p>
      
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hình học không gian - Active */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between">
                <div>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                        <Box size={28} />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white">Hình học không gian</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        Vẽ hình chóp, lăng trụ, mặt cầu và tương tác trực tiếp trong không gian 3D.
                    </p>
                </div>
            </div>
            
            <div className="space-y-3 mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bài tập mẫu:</p>
                {exercises.map((ex) => (
                    <div 
                        key={ex.id}
                        className="w-full flex flex-col rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all group/item"
                    >
                        <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                            onClick={() => handleOpenExercise(ex.script)}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="bg-white dark:bg-slate-700 p-1.5 rounded-md shadow-sm text-slate-400 dark:text-slate-300 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                                    <Play size={14} fill="currentColor" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-300">{ex.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{ex.description}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => toggleExpand(ex.id, e)}
                                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
                                    title="Xem đề bài"
                                >
                                    {expandedId === ex.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <ArrowRight size={16} className="text-slate-300 group-hover/item:text-indigo-500 opacity-0 group-hover/item:opacity-100 transition-all transform -translate-x-2 group-hover/item:translate-x-0" />
                            </div>
                        </div>
                        
                        {expandedId === ex.id && (
                            <div className="px-4 pb-4 pt-0 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                                <div className="mt-3 whitespace-pre-line font-medium leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
                                    {ex.problemStatement || "Chưa có đề bài chi tiết."}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 text-center">
             <button 
                onClick={() => navigate('/math/geometry-3d')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
             >
                Mở bảng vẽ trống
             </button>
          </div>
        </div>

        {/* Feedback Link */}
        <a 
            href="https://www.facebook.com/profile.php?id=61577861516987" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 transition-all group text-center"
        >
            <div className="w-10 h-10 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquarePlus className="text-indigo-500 dark:text-indigo-400" size={20} />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Tính năng dự kiến phát triển</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Bạn muốn thêm công cụ toán học nào (Đại số, Giải tích...)? Hãy cho chúng tôi biết ý kiến của bạn.
            </p>
        </a>
      </div>
    </div>
  );
};

export default MathIntro;