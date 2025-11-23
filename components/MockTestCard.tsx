import React from 'react';
import { Timer, HelpCircle, ArrowRight, Zap, Award } from 'lucide-react';

interface MockTestCardProps {
  title: string;
  subject: string;
  questions: number;
  time: number; // in minutes
  type: 'ssc' | 'railway' | 'banking' | 'teaching' | 'police' | 'general';
  onStart?: () => void;
}

export const MockTestCard: React.FC<MockTestCardProps> = ({ title, subject, questions, time, type, onStart }) => {
  
  let colorClass = "bg-indigo-50 border-indigo-200 text-indigo-700";
  let iconBg = "bg-indigo-100 text-indigo-600";
  let btnClass = "bg-indigo-600 hover:bg-indigo-700";

  if (type === 'railway') {
    colorClass = "bg-blue-50 border-blue-200 text-blue-700";
    iconBg = "bg-blue-100 text-blue-600";
    btnClass = "bg-blue-600 hover:bg-blue-700";
  } else if (type === 'police') {
    colorClass = "bg-rose-50 border-rose-200 text-rose-700";
    iconBg = "bg-rose-100 text-rose-600";
    btnClass = "bg-rose-600 hover:bg-rose-700";
  } else if (type === 'teaching') {
    colorClass = "bg-amber-50 border-amber-200 text-amber-700";
    iconBg = "bg-amber-100 text-amber-600";
    btnClass = "bg-amber-600 hover:bg-amber-700";
  }

  return (
    <div className={`rounded-xl border ${colorClass.split(' ')[1]} bg-white shadow-sm hover:shadow-md transition-all group overflow-hidden`}>
      <div className={`px-4 py-3 flex justify-between items-start ${colorClass.split(' ')[0]}`}>
         <div className="flex gap-3">
            <div className={`p-2 rounded-lg ${iconBg}`}>
                <Award size={20} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 font-medium">{subject}</p>
            </div>
         </div>
         <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border border-slate-100 shadow-sm uppercase">Free</span>
      </div>
      
      <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-medium">
              <div className="flex items-center gap-1"><HelpCircle size={14}/> {questions} Questions</div>
              <div className="flex items-center gap-1"><Timer size={14}/> {time} Mins</div>
              <div className="flex items-center gap-1"><Zap size={14} className="text-yellow-500 fill-current"/> 10k+ Users</div>
          </div>
          
          <button 
            onClick={onStart}
            className={`w-full ${btnClass} text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 group-hover:shadow-lg`}
          >
              Attempt Now <ArrowRight size={16} />
          </button>
      </div>
    </div>
  );
};