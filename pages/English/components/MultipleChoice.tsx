import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { playAudio, shuffleArray, speakText } from '../utils';

interface MultipleChoiceProps {
  word: Word;
  allWords: Word[];
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  progress: { current: number; total: number; reviewCount: number };
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ word, allWords, onAnswer, onNext, progress }) => {
  const [options, setOptions] = useState<Word[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<number | null>(null); 
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state for new word
    setSelectedId(null);
    setIsAnswered(false);
    setFeedbackMsg(null);
    setShakeId(null);
    
    if (timerRef.current) clearTimeout(timerRef.current);

    const others = allWords.filter(w => w.id !== word.id);
    const distractors = shuffleArray(others).slice(0, 3);
    const currentOptions = shuffleArray([word, ...distractors]);
    setOptions(currentOptions);
  }, [word, allWords]);

  const handleSelect = (optionId: number) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedId(optionId);
    const isCorrect = optionId === word.id;
    onAnswer(isCorrect); // Record SRS result immediately

    if (isCorrect) {
      // CORRECT ANSWER LOGIC
      setFeedbackMsg("✅ Chính xác!");
      playAudio('correct');
      speakText(word.term); 
      
      // Auto next after delay if correct
      timerRef.current = window.setTimeout(() => {
        onNext();
      }, 1500);

    } else {
      // WRONG ANSWER LOGIC
      setShakeId(optionId);
      setFeedbackMsg(`❌ Sai, đáp án đúng là: ${word.meaning}`);
      playAudio('wrong');
      
      // Auto next after delay
      timerRef.current = window.setTimeout(() => {
        onNext();
      }, 2500);
    }
  };

  const handleDontKnow = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setFeedbackMsg(`Đáp án đúng là: ${word.meaning}`);
    playAudio('wrong');
    speakText(word.term); 
    onAnswer(false); // Count as wrong
    timerRef.current = window.setTimeout(onNext, 2500);
  };

  const handleManualNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onNext();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mb-2 uppercase tracking-wide font-bold">
          <span className={progress.reviewCount > 0 ? "text-yellow-600 dark:text-yellow-400 animate-pulse" : ""}>Cần ôn tập: {progress.reviewCount}</span>
          <span>Tiến độ</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex shadow-inner border border-slate-300 dark:border-slate-600">
            <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out relative" 
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
            >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full glass rounded-3xl shadow-2xl mb-8 text-center flex flex-col relative overflow-hidden transition-all duration-500 min-h-[18rem]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-sm"></div>

        <div className="flex flex-col items-center w-full p-8 h-full z-10 justify-center flex-grow">
            
            {/* WORD & SPEAKER */}
            <div className="mt-2 mb-4 flex items-center justify-center gap-4 group">
                <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-md">
                    {word.term}
                </h2>
                <button 
                    onClick={(e) => { e.stopPropagation(); speakText(word.term); }}
                    className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all shadow-lg hover:scale-110 hover:rotate-12"
                >
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                </button>
            </div>

            {/* IPA & POS */}
            {(word.ipa || word.pos) && (
                <div className="mb-4 flex items-center gap-3 justify-center">
                    {word.ipa && (
                        <span className="text-xl text-slate-600 dark:text-slate-300 font-mono bg-slate-200/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-4 py-1 rounded-xl backdrop-blur-sm">
                            {word.ipa}
                        </span>
                    )}
                    {word.pos && (
                    <span className="text-lg italic text-indigo-500 dark:text-indigo-300 font-serif font-medium">
                        {word.pos}
                    </span>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Options Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
        {options.map(option => {
            let btnClass = "relative overflow-hidden p-5 rounded-2xl text-lg font-semibold transition-all duration-300 border-2 text-left h-24 flex items-center justify-center shadow-md group ";
            
            if (isAnswered) {
                if (option.id === word.id) {
                    btnClass += "bg-green-500 border-green-500 text-white shadow-green-500/40 scale-[1.02]";
                } else if (option.id === selectedId) {
                    btnClass += "bg-red-500 border-red-500 text-white shadow-red-500/40";
                } else {
                    btnClass += "glass border-transparent text-gray-400 dark:text-gray-500 opacity-50 grayscale";
                }
            } else {
                btnClass += "glass border-white/40 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-xl hover:-translate-y-1";
            }
            
            const isShaking = shakeId === option.id;

            return (
                <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={isAnswered}
                    className={`${btnClass} ${isShaking ? 'animate-shake' : ''}`}
                >
                <span className="relative z-10 line-clamp-2 text-center">{option.meaning}</span>
                {!isAnswered && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                </button>
            );
        })}
      </div>

      {/* Footer Controls */}
      <div className="h-14 flex items-center justify-center w-full">
        {!isAnswered ? (
          <button 
            onClick={handleDontKnow}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition-colors border-b-2 border-dotted border-slate-400 hover:border-slate-800 dark:hover:border-white pb-0.5"
          >
            Tôi không biết từ này
          </button>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-between animate-fade-in-up">
            <div className={`font-bold text-xl ${feedbackMsg?.startsWith('✅') ? 'text-green-500 dark:text-green-400 drop-shadow' : 'text-red-500 dark:text-red-400 drop-shadow'}`}>
                {feedbackMsg}
            </div>
            
            <button 
                onClick={handleManualNext}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 font-bold flex items-center group transition-all transform hover:scale-105 active:scale-95"
            >
                Tiếp tục
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;