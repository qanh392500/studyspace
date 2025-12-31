import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, ArrowRight, Activity, Thermometer, FlaskConical, Microscope, MessageSquarePlus } from 'lucide-react';

const PhysicsDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Phòng Thí Nghiệm Vật Lý Ảo</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-3xl">
        Khám phá các hiện tượng vật lý thông qua các mô phỏng tương tác. Chọn một bài học bên dưới hoặc từ menu bên trái để bắt đầu.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Kinetic Theory Card */}
        <div 
            onClick={() => navigate('/physics/kinetic-theory')}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Wind size={80} className="text-purple-600" />
          </div>
          
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
             <Wind size={24} />
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Thuyết Động Học Phân Tử
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
            Mô phỏng chuyển động của các phân tử ở ba trạng thái Rắn, Lỏng và Khí. Quan sát ảnh hưởng của nhiệt độ đến tốc độ và va chạm phân tử.
          </p>
          
          <div className="flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400">
            Vào phòng thí nghiệm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Thermodynamics Card */}
        <div 
            onClick={() => navigate('/physics/thermodynamics')}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Activity size={80} className="text-amber-600" />
          </div>
          
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
             <Activity size={24} />
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Nhiệt Động Lực Học
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
            Khảo sát định luật I Nhiệt động lực học: ΔU = A + Q. Tương tác với xi lanh, pít-tông và nguồn nhiệt để thấy sự chuyển hóa năng lượng.
          </p>
          
          <div className="flex items-center text-sm font-semibold text-amber-600 dark:text-amber-400">
            Vào phòng thí nghiệm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Heating Curve Card */}
        <div 
            onClick={() => navigate('/physics/heating-curve')}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Thermometer size={80} className="text-red-600" />
          </div>
          
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
             <Thermometer size={24} />
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            Quá Trình Nung Nóng
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
            Theo dõi đồ thị nhiệt độ theo thời gian của nước đá khi nung nóng. Khám phá sự thay đổi cấu trúc vi mô và khái niệm Ẩn nhiệt.
          </p>
          
          <div className="flex items-center text-sm font-semibold text-red-600 dark:text-red-400">
            Vào phòng thí nghiệm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Gas Laws Card */}
        <div 
            onClick={() => navigate('/physics/gas-laws')}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <FlaskConical size={80} className="text-green-600" />
          </div>
          
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
             <FlaskConical size={24} />
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            Định Luật Chất Khí
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
             Mô phỏng 3 đẳng quá trình: Đẳng nhiệt, Đẳng tích và Đẳng áp. Kiểm chứng các định luật Boyle, Charles, Gay-Lussac.
          </p>
          
          <div className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
            Vào phòng thí nghiệm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Molecular Dynamics Card (New) */}
        <div 
            onClick={() => navigate('/physics/molecular-dynamics')}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Microscope size={80} className="text-blue-500" />
          </div>
          
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
             <Microscope size={24} />
          </div>
          
          <h3 className="font-bold text-xl mb-2 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Mô Hình Động Học
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3">
             Kính hiển vi phân tử: Khám phá nguồn gốc của áp suất, động năng và phổ tốc độ Maxwell-Boltzmann của khí lý tưởng.
          </p>
          
          <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
            Vào phòng thí nghiệm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Feedback / Planned Features */}
        <a 
            href="https://www.facebook.com/profile.php?id=61577861516987" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center cursor-pointer h-full"
        >
            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquarePlus className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Tính năng dự kiến phát triển</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Bạn muốn chúng tôi phát triển thêm chủ đề nào (Điện từ, Quang học...)? <br/>
                <span className="font-medium text-indigo-600 dark:text-indigo-400 mt-2 inline-block underline">Góp ý ngay</span>
            </p>
        </a>

      </div>
    </div>
  );
};

export default PhysicsDashboard;