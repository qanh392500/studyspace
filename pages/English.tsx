import React, { useState, useEffect } from 'react';
import { Word, Stage, QuizStats } from './English/types';
import ImportScreen from './English/components/ImportScreen';
import MultipleChoice from './English/components/MultipleChoice';
import TypingQuiz from './English/components/TypingQuiz';
import SummaryScreen from './English/components/SummaryScreen';
import { useSpacedRepetition } from './English/hooks/useSpacedRepetition';

// Configurable setting for mastery
const MASTERY_THRESHOLD = 100; 

const EnglishStyles = () => (
  <style>{`
    .glass {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .dark .glass {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(51, 65, 85, 0.5);
    }
    .glass-strong {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(226, 232, 240, 1);
    }
    .dark .glass-strong {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(51, 65, 85, 0.8);
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(71, 85, 105, 0.6);
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
  `}</style>
);

const QuizWrapper: React.FC<{ 
    mode: 'A' | 'B', 
    words: Word[], 
    onFinish: (stats: QuizStats) => void 
}> = ({ mode, words, onFinish }) => {
    const { currentWord, isFinished, handleResult, pickNextWord, stats, progress } = useSpacedRepetition({
        allWords: words,
        mode
    });

    React.useEffect(() => {
        if (isFinished) {
            onFinish(stats);
        }
    }, [isFinished, onFinish, stats]);

    if (!currentWord) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">Đang tải câu hỏi...</p>
        </div>
    );

    if (mode === 'A') {
        return (
            <MultipleChoice 
                word={currentWord} 
                allWords={words} 
                onAnswer={handleResult} 
                onNext={pickNextWord}
                progress={{
                    current: progress.mastered, 
                    total: words.length,
                    reviewCount: progress.review
                }}
            />
        );
    } else {
        return (
            <TypingQuiz 
                word={currentWord} 
                onAnswer={handleResult} 
                onNext={pickNextWord}
                progress={{ reviewCount: progress.review }}
            />
        );
    }
};

const English: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [stage, setStage] = useState<Stage>(Stage.IMPORT);
  
  const [stageAStats, setStageAStats] = useState<QuizStats | null>(null);
  const [stageBStats, setStageBStats] = useState<QuizStats | null>(null);

  const handleStart = (parsedWords: Word[]) => {
    setWords(parsedWords);
    setStage(Stage.STAGE_A);
  };

  const handleRestart = () => {
    setWords([]);
    setStage(Stage.IMPORT);
    setStageAStats(null);
    setStageBStats(null);
  };

  const getPercentage = (stats: QuizStats | null) => {
    if (!stats || stats.totalAttempts === 0) return 0;
    return Math.round((stats.correct / stats.totalAttempts) * 100);
  };

  return (
    <div>
        <EnglishStyles />
        <div className="relative h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
            
            {/* Simple Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 pointer-events-none z-0"></div>

            {/* HEADER TOOLBAR (Simplified - No Title) */}
            <div className="relative z-50 shrink-0 p-3 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm min-h-[56px] transition-colors">
                 <div className="flex items-center gap-3">
                     {/* Title removed as requested */}
                     {stage !== Stage.IMPORT && (
                        <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                            {stage === Stage.STAGE_A ? 'Stage 1: Hiểu từ' : stage === Stage.STAGE_B ? 'Stage 2: Gõ từ' : 'Tổng kết'}
                        </span>
                     )}
                 </div>
                 
                 <div className="flex items-center gap-4">
                    {stage !== Stage.IMPORT && (
                        <button 
                            onClick={handleRestart} 
                            className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm"
                        >
                            Thoát
                        </button>
                    )}
                 </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 flex-grow w-full overflow-hidden">
                {stage === Stage.IMPORT && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        <ImportScreen onStart={handleStart} />
                    </div>
                )}

                {stage === Stage.STAGE_A && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        <div className="min-h-full flex flex-col pb-20">
                            <QuizWrapper 
                                key="stage-a" 
                                mode="A" 
                                words={words} 
                                onFinish={(stats) => {
                                    setStageAStats(stats);
                                    setStage(Stage.SUMMARY_A);
                                }} 
                            />
                        </div>
                    </div>
                )}

                {stage === Stage.SUMMARY_A && stageAStats && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        {(() => {
                            const pct = getPercentage(stageAStats);
                            const passed = pct >= MASTERY_THRESHOLD;
                            return (
                            <SummaryScreen 
                                title={passed ? "Hoàn thành Giai đoạn 1" : `Chưa đạt ${MASTERY_THRESHOLD}%`}
                                stats={stageAStats}
                                allWords={words}
                                btnText={passed ? "Tiếp tục sang Giai đoạn 2" : "Làm lại Giai đoạn 1"}
                                onContinue={() => {
                                if (passed) {
                                    setStage(Stage.STAGE_B);
                                } else {
                                    setStage(Stage.STAGE_A);
                                }
                                }}
                            />
                            );
                        })()}
                    </div>
                )}

                {stage === Stage.STAGE_B && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        <div className="min-h-full flex flex-col pb-20">
                            <QuizWrapper 
                            key="stage-b"
                            mode="B" 
                            words={words} 
                            onFinish={(stats) => {
                                setStageBStats(stats);
                                setStage(Stage.FINAL_SUMMARY);
                            }} 
                            />
                        </div>
                    </div>
                )}

                {stage === Stage.FINAL_SUMMARY && stageBStats && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                        <SummaryScreen 
                            title="🎉 Chúc mừng! Bạn đã hoàn thành."
                            stats={stageBStats}
                            allWords={words}
                            btnText="Học lại bộ từ này"
                            onContinue={handleRestart}
                        />
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default English;