import React from 'react';
import { MatterState } from '../types';
import { Info } from 'lucide-react';

interface Props {
  state: MatterState;
}

// Nội dung chú thích
const stateInfo = {
  [MatterState.SOLID]: {
    title: "THỂ RẮN (Solid)",
    description: "Các phân tử sắp xếp có trật tự và chặt chẽ. Lực liên kết giữa chúng rất mạnh.",
    motion: (
      <>
        Các phân tử chỉ <strong>dao động</strong> quanh vị trí cân bằng cố định, không di chuyển tự do.
      </>
    ),
    lightColor: "bg-indigo-50 border-indigo-200 text-indigo-900",
    darkColor: "dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-200"
  },
  [MatterState.LIQUID]: {
    title: "THỂ LỎNG (Liquid)",
    description: "Lực liên kết yếu hơn thể rắn, khoảng cách giữa các phân tử lớn hơn một chút. Có thể tích xác định nhưng không có hình dạng riêng.",
    motion: (
      <>
        Các phân tử dao động và <strong>trượt lên nhau</strong>, có thể di chuyển trong thể tích chất lỏng.
      </>
    ),
    lightColor: "bg-cyan-50 border-cyan-200 text-cyan-900",
    darkColor: "dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-200"
  },
  [MatterState.GAS]: {
    title: "THỂ KHÍ (Gas)",
    description: "Khoảng cách giữa các phân tử rất lớn, lực liên kết rất yếu (đáng kể). Chất khí chiếm toàn bộ thể tích bình chứa.",
    motion: (
      <>
        Các phân tử chuyển động <strong>hỗn loạn hoàn toàn</strong> với tốc độ cao, va chạm vào nhau và vào thành bình.
      </>
    ),
    lightColor: "bg-red-50 border-red-200 text-red-900",
    darkColor: "dark:bg-red-900/30 dark:border-red-800 dark:text-red-200"
  }
};

const AnnotationPanel: React.FC<Props> = ({ state }) => {
  const info = stateInfo[state];

  return (
    <div className={`w-full p-4 border-t transition-colors duration-500 ease-in-out ${info.lightColor} ${info.darkColor}`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 bg-white/60 dark:bg-black/20 rounded-full shadow-sm flex-shrink-0 backdrop-blur-sm">
            <Info className="w-5 h-5 opacity-80" />
        </div>
        <div className="flex-grow">
            <h3 className="font-bold text-lg uppercase tracking-wide mb-1 flex items-center gap-2">
                {info.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm leading-relaxed">
                <div>
                    <span className="font-bold text-xs opacity-70 uppercase mr-1">Mô tả:</span>
                    {info.description}
                </div>
                <div>
                    <span className="font-bold text-xs opacity-70 uppercase mr-1">Chuyển động:</span>
                    {info.motion}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationPanel;