import React, { useState } from 'react';
import { parseVocabularyInput } from '../utils';
import { Word } from '../types';

interface ImportScreenProps {
  onStart: (words: Word[]) => void;
}

const ImportScreen: React.FC<ImportScreenProps> = ({ onStart }) => {
  const [input, setInput] = useState<string>(`take off : cất cánh
break down : hỏng, sụp đổ
decline : giảm sút : /dɪˈklaɪn/
assume : giả định : /əˈsuːm/ : verb
facilitate : tạo điều kiện
ambiguous : mơ hồ
colleague : đồng nghiệp`);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    const { words, error: parseError } = parseVocabularyInput(input);
    if (parseError) {
      setError(parseError);
      return;
    }
    // Direct start without AI
    onStart(words);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in my-auto transition-colors">
        
        {/* Compact Banner */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-800 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            {/* Simple decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            
            <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    Nhập Từ Vựng
                </h1>
                <p className="text-indigo-100 text-sm md:text-base opacity-90">
                    Tạo bộ Flashcard của riêng bạn để ôn tập.
                </p>
            </div>
            
            <div className="relative z-10 shrink-0 inline-flex flex-col items-end gap-1">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/80 px-1.5 py-0.5 rounded">Cơ bản</span>
                    <span className="font-mono text-sm font-semibold text-yellow-300">English : Vietnamese</span>
                 </div>
                 <div className="text-[10px] text-indigo-200">Hoặc: English : Vietnamese : IPA : Type</div>
            </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 transition-colors">
            <div className="relative">
                <textarea
                  className="w-full h-64 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-4 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none font-mono text-base shadow-sm resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="hello : xin chào&#10;world : thế giới"
                  spellCheck={false}
                />
            </div>

            {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm animate-shake">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="font-medium">{error}</span>
            </div>
            )}

            <button
                onClick={handleStart}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
                Bắt đầu học ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImportScreen;