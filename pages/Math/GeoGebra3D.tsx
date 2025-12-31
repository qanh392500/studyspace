import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, Circle, Slash, Lock, Wrench, X } from 'lucide-react';

const GeoGebra3D: React.FC = () => {
  const location = useLocation();
  const scriptContent = location.state?.script as string | undefined;
  
  // Trạng thái cho toolbar
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderMode, setSliderMode] = useState<'line' | 'point'>('line');
  const [pointSize, setPointSize] = useState(2);
  const [lineThickness, setLineThickness] = useState(2);
  const [isLocked, setIsLocked] = useState(false);
  
  // Trạng thái hiển thị toolbar (thu gọn/mở rộng)
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Tham chiếu DOM
  const isInjecting = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hàm khởi tạo Applet
    const initGeoGebra = () => {
      if (!window.GGBApplet || isInjecting.current || !containerRef.current) return;

      isInjecting.current = true;

      // Lấy kích thước thực tế của khung chứa tại thời điểm khởi tạo
      const initialWidth = containerRef.current.clientWidth;
      const initialHeight = containerRef.current.clientHeight;

      const params = {
        id: 'ggbApplet',
        appName: '3d',
        width: initialWidth,
        height: initialHeight,
        showToolBar: false,        // Enabled: Drawing Tools
        showAlgebraInput: false,   // Enabled: Input Bar
        showMenuBar: true,        // Enabled: Main Menu
        perspective: "5",         // 3D Graphics View
        borderColor: 'none',
        transparentGraphics: false,
        allowStyleBar: true,      // Enabled: Quick style changes
        scaleContainerClass: 'ggb-container',
        allowUpScaling: true,
        showResetIcon: true,      // Enabled: Standard reset
        appletOnLoad: () => {
          setIsLoaded(true);
          
          // Nạp script bài tập nếu có
          if (scriptContent && window.ggbApplet) {
             window.ggbApplet.newConstruction();
             const commands = scriptContent.split('\n').filter(line => line.trim().length > 0);
             commands.forEach(cmd => {
               window.ggbApplet.evalCommand(cmd);
             });
             window.ggbApplet.evalCommand("CenterView((0,0,0))");

             // --- QUAN TRỌNG: ĐỒNG BỘ STYLE NGAY LẬP TỨC ---
             // Sau khi vẽ xong, ép tất cả đối tượng theo thông số slider hiện tại
             setTimeout(() => {
                 const applet = window.ggbApplet;
                 const objs = applet.getAllObjectNames();
                 objs.forEach((obj: string) => {
                    const type = applet.getObjectType(obj);
                    // Đồng bộ kích thước điểm
                    if (type === 'point') {
                        applet.setPointSize(obj, pointSize);
                    } 
                    // Đồng bộ độ dày nét vẽ
                    else if (['segment', 'line', 'polygon', 'ray', 'vector'].includes(type)) {
                        applet.setLineThickness(obj, lineThickness);
                    }
                 });
             }, 100);
          }
        }
      };

      const applet = new window.GGBApplet(params, true);
      applet.inject('ggb-element');
    };

    // Chờ thư viện load xong
    if (window.GGBApplet) {
      initGeoGebra();
    } else {
      const interval = setInterval(() => {
        if (window.GGBApplet) {
          initGeoGebra();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }

    return () => { isInjecting.current = false; };
  }, [scriptContent]); // Chạy lại khi scriptContent thay đổi (chuyển bài tập)

  // Xử lý Responsive: Tự động chỉnh lại kích thước khi thay đổi trình duyệt
  useEffect(() => {
    if (!containerRef.current) return;

    // ResizeObserver giúp phát hiện thay đổi kích thước của thẻ div chứa
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (window.ggbApplet && window.ggbApplet.setSize) {
          const { width, height } = entry.contentRect;
          // Gọi API setSize của GeoGebra để cập nhật canvas
          window.ggbApplet.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [isLoaded]);

  // --- CÁC HÀM XỬ LÝ TOOLBAR TÙY CHỈNH ---
  const handleColorPoints = () => {
    const applet = window.ggbApplet;
    if (!applet) return;
    const objs = applet.getAllObjectNames();
    objs.forEach((obj: string) => {
      if (applet.getObjectType(obj) === 'point') {
        applet.setColor(obj, 239, 68, 68);
        applet.setPointStyle(obj, 0);
      }
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    const applet = window.ggbApplet;
    if (!applet) return;
    const objs = applet.getAllObjectNames();

    if (sliderMode === 'point') {
      setPointSize(val);
      objs.forEach((obj: string) => {
        if (applet.getObjectType(obj) === 'point') {
          applet.setPointSize(obj, val);
        }
      });
    } else {
      setLineThickness(val);
      objs.forEach((obj: string) => {
        const type = applet.getObjectType(obj);
        if (['segment', 'line', 'polygon', 'ray', 'vector'].includes(type)) {
          applet.setLineThickness(obj, val);
        }
      });
    }
  };

  const handleClear = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ bản vẽ không?")) {
      const applet = window.ggbApplet;
      if (applet) {
        applet.newConstruction();
      }
    }
  };

  const handleLock = () => {
    const nextState = !isLocked;
    setIsLocked(nextState);
    const applet = window.ggbApplet;
    if (!applet) return;
    const objs = applet.getAllObjectNames();
    objs.forEach((obj: string) => {
        applet.setFixed(obj, nextState, nextState);
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      {/* Container chính với padding p-4 để không full viền */}
      <div className="flex-1 p-4 overflow-hidden relative">
        
        {/* Khung chứa GeoGebra */}
        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden relative ring-1 ring-slate-900/5 dark:ring-white/5 flex flex-col">
            
            {/* Toolbar Tùy Chỉnh (Dạng Slide-out) */}
            <div 
                className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white rounded-full shadow-2xl transition-all duration-500 ease-in-out border border-slate-700/50 flex items-center overflow-hidden ${
                    isToolbarOpen ? 'px-4 py-2 gap-4 max-w-[500px]' : 'p-2 max-w-[48px]'
                }`}
            >
                {/* Nút Toggle (Luôn hiện) */}
                <button 
                    onClick={() => setIsToolbarOpen(!isToolbarOpen)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                    title={isToolbarOpen ? "Thu gọn" : "Công cụ"}
                >
                    {isToolbarOpen ? <X size={20} /> : <Wrench size={20} />}
                </button>

                {/* Nội dung Toolbar (Trượt ra) */}
                <div className={`flex items-center gap-4 transition-opacity duration-300 ${isToolbarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-700 flex-shrink-0"></div>

                    <button 
                        onClick={handleColorPoints}
                        className="flex items-center gap-2 hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        title="Tô màu đỏ cho tất cả các điểm"
                    >
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        <span className="text-xs font-medium">Points</span>
                    </button>
                    
                    <div className="w-px h-6 bg-slate-700 flex-shrink-0"></div>
                    
                    <button 
                        onClick={handleLock}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap ${isLocked ? 'text-amber-400 bg-amber-400/10' : 'hover:bg-white/10 text-slate-300'}`}
                        title={isLocked ? "Mở khóa hình" : "Khóa hình"}
                    >
                        <Lock size={16} />
                        <span className="text-xs font-medium">{isLocked ? 'Locked' : 'Lock'}</span>
                    </button>
                    
                    <div className="w-px h-6 bg-slate-700 flex-shrink-0"></div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 flex-shrink-0">
                            <button 
                                onClick={() => setSliderMode('line')}
                                className={`p-1 rounded-md transition-all ${sliderMode === 'line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Slash size={14} />
                            </button>
                            <button 
                                onClick={() => setSliderMode('point')}
                                className={`p-1 rounded-md transition-all ${sliderMode === 'point' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Circle size={10} fill="currentColor" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 w-20">
                            <input 
                                type="range" min="1" max="13" 
                                value={sliderMode === 'line' ? lineThickness : pointSize}
                                onChange={handleSliderChange}
                                className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <div className="w-px h-6 bg-slate-700 flex-shrink-0"></div>
                    
                    <button onClick={handleClear} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors flex-shrink-0">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Vùng chứa GeoGebra */}
            <div ref={containerRef} className="w-full h-full bg-white relative">
                <div id="ggb-element" className="w-full h-full"></div>
            </div>
            
            {!isLoaded && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-800 z-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">Đang tải GeoGebra...</span>
                    </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GeoGebra3D;