
import React, { useState, useEffect } from 'react';
import { X, Clock, Award, Globe, ChevronRight } from 'lucide-react';

interface MockTestModalProps {
  title: string;
  region?: string;
  onClose: () => void;
}

// --- 22 Official Languages + English ---
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ur', name: 'Urdu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'or', name: 'Odia' },
  { code: 'ma', name: 'Maithili' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'do', name: 'Dogri' },
  { code: 'ko', name: 'Konkani' },
  { code: 'mn', name: 'Manipuri' },
  { code: 'bo', name: 'Bodo' },
  { code: 'sa', name: 'Santali' }
];

// --- Translation Dictionary for Dynamic Text ---
const UI_LABELS: Record<string, any> = {
    'en': { math: "What is", series: "Complete the series", find: "Find the next", section_gk: "General Knowledge", section_math: "Mathematics", section_reasoning: "Reasoning" },
    'hi': { math: "परिणाम क्या है", series: "शृंखला पूरी करें", find: "अगला ज्ञात करें", section_gk: "सामान्य ज्ञान", section_math: "गणित", section_reasoning: "तर्कशक्ति" },
    'bn': { math: "মান নির্ণয় কর", series: "ক্রম সম্পূর্ণ কর", find: "পরবর্তী সংখ্যাটি নির্ণয় কর", section_gk: "সাধারণ জ্ঞান", section_math: "গণিত", section_reasoning: "রিজনিং" }
};

const getLabel = (lang: string, key: string) => {
    return UI_LABELS[lang]?.[key] || UI_LABELS['en'][key];
};

// --- Base GK Questions (English) ---
const BASE_GK_QUESTIONS = [
    { id: 'gk1', q: "Who was the first Prime Minister of India?", o: ["Gandhi", "Nehru", "Patel", "Bose"], a: 1 },
    { id: 'gk2', q: "What is the capital of India?", o: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], a: 2 },
    { id: 'gk3', q: "Which is the largest planet?", o: ["Mars", "Jupiter", "Saturn", "Earth"], a: 1 },
    { id: 'gk4', q: "Who wrote the National Anthem?", o: ["Tagore", "Bankim", "Sarojini", "Premchand"], a: 0 },
    { id: 'gk5', q: "Which year did India get independence?", o: ["1942", "1945", "1947", "1950"], a: 2 },
    { id: 'gk6', q: "What is the national animal of India?", o: ["Lion", "Tiger", "Elephant", "Horse"], a: 1 },
    { id: 'gk7', q: "Which organ purifies blood?", o: ["Heart", "Lungs", "Kidney", "Liver"], a: 2 },
    { id: 'gk8', q: "Chemical formula of Water?", o: ["HO2", "H2O", "O2H", "H2O2"], a: 1 },
    { id: 'gk9', q: "Powerhouse of the cell?", o: ["Nucleus", "Mitochondria", "Ribosome", "DNA"], a: 1 },
    { id: 'gk10', q: "Which state is known as 'God's Own Country'?", o: ["Kerala", "Goa", "Assam", "Kashmir"], a: 0 },
    { id: 'gk11', q: "Smallest state in India?", o: ["Sikkim", "Goa", "Tripura", "Manipur"], a: 1 },
    { id: 'gk12', q: "Who built the Taj Mahal?", o: ["Akbar", "Shah Jahan", "Jahangir", "Babur"], a: 1 },
    { id: 'gk13', q: "Minimum age for President?", o: ["25", "30", "35", "40"], a: 2 },
    { id: 'gk14', q: "Who appoints the Governor?", o: ["PM", "President", "CM", "Chief Justice"], a: 1 },
    { id: 'gk15', q: "Currency of Japan?", o: ["Yen", "Dollar", "Euro", "Rupee"], a: 0 },
    { id: 'gk16', q: "Hardest substance on Earth?", o: ["Gold", "Iron", "Diamond", "Platinum"], a: 2 },
    { id: 'gk17', q: "Study of birds is called?", o: ["Ornithology", "Zoology", "Botany", "Virology"], a: 0 },
    { id: 'gk18', q: "Longest river in India?", o: ["Ganga", "Yamuna", "Godavari", "Narmada"], a: 0 },
    { id: 'gk19', q: "Which gas is essential for burning?", o: ["Nitrogen", "Oxygen", "Carbon", "Helium"], a: 1 },
    { id: 'gk20', q: "Capital of West Bengal?", o: ["Kolkata", "Howrah", "Darjeeling", "Siliguri"], a: 0 }
];

// --- Translation Database ---
const TRANSLATION_DB: Record<string, Record<string, { q: string, o: string[] }>> = {
    'gk1': {
        'hi': { q: "भारत के पहले प्रधान मंत्री कौन थे?", o: ["गांधी", "नेहरू", "पटेल", "बोस"] },
        'bn': { q: "ভারতের প্রথম প্রধানমন্ত্রী কে ছিলেন?", o: ["গান্ধী", "নেহেরু", "প্যাটেল", "বসু"] }
    },
    'gk2': {
        'hi': { q: "भारत की राजधानी क्या है?", o: ["मुंबई", "कोलकाता", "नई दिल्ली", "चेन्नई"] },
        'bn': { q: "ভারতের রাজধানী কোনটি?", o: ["মুম্বাই", "কলকাতা", "নয়াদিল্লি", "চেন্নাই"] }
    },
    'gk3': {
        'hi': { q: "सबसे बड़ा ग्रह कौन सा है?", o: ["मंगल", "बृहस्पति", "शनि", "पृथ्वी"] },
        'bn': { q: "সবচেয়ে বড় গ্রহ কোনটি?", o: ["মঙ্গল", "বৃহস্পতি", "শনি", "পৃথিবী"] }
    },
    // Fallbacks handled in logic
};

// --- Dynamic Generators with Language Support ---

const generateMathQuestion = (index: number, lang: string) => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const ans = a + b;
    const options = [ans, ans + 1, ans - 1, ans + 10].sort(() => Math.random() - 0.5);
    const questionText = getLabel(lang, 'math');
    
    return {
        q: `${index + 1}. ${questionText} ${a} + ${b} ?`,
        o: options.map(String),
        a: options.indexOf(ans)
    };
};

const generateReasoningQuestion = (index: number, lang: string) => {
    const seriesText = getLabel(lang, 'series');
    const start = Math.floor(Math.random() * 5) + 1;
    const seq = [start, start + 2, start + 4, start + 6];
    const ans = start + 8;
    const options = [ans, ans + 1, ans - 2, ans + 4].sort(() => Math.random() - 0.5);

    return {
        q: `${index + 1}. ${seriesText}: ${seq.join(', ')}, ?`,
        o: options.map(String),
        a: options.indexOf(ans)
    };
};


export const MockTestModal: React.FC<MockTestModalProps> = ({ title, region, onClose }) => {
  const [step, setStep] = useState<'instructions' | 'test' | 'result'>('instructions');
  const [selectedLang, setSelectedLang] = useState('en');
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90 Mins for 100 Qs
  const [score, setScore] = useState(0);

  // --- Initialize 100 Questions ---
  const generateQuestions = () => {
    const newQuestions: any[] = [];
    const gkSectionName = getLabel(selectedLang, 'section_gk');
    const mathSectionName = getLabel(selectedLang, 'section_math');
    const reasoningSectionName = getLabel(selectedLang, 'section_reasoning');

    // 1. GK Section (20 Questions)
    const shuffledGK = [...BASE_GK_QUESTIONS].sort(() => 0.5 - Math.random());
    shuffledGK.forEach((item, idx) => {
        let translatedItem = { ...item };
        const translation = TRANSLATION_DB[item.id]?.[selectedLang];
        
        if (translation) {
            translatedItem.q = translation.q;
            translatedItem.o = translation.o;
        } else if (selectedLang !== 'en') {
             // Only add prefix if translation missing
            const langName = LANGUAGES.find(l => l.code === selectedLang)?.name || 'GK';
            translatedItem.q = `[${langName}] ${translatedItem.q}`;
        }
        
        newQuestions.push({ 
            section: gkSectionName, 
            displayId: idx + 1, 
            q: `${idx + 1}. ${translatedItem.q}`,
            o: translatedItem.o,
            a: translatedItem.a
        });
    });

    // 2. Math Section (40 Questions)
    for (let i = 0; i < 40; i++) {
        const q = generateMathQuestion(20 + i, selectedLang);
        newQuestions.push({
            section: mathSectionName,
            displayId: 21 + i,
            q: q.q,
            o: q.o,
            a: q.a
        });
    }

    // 3. Reasoning Section (40 Questions)
    for (let i = 0; i < 40; i++) {
        const q = generateReasoningQuestion(60 + i, selectedLang);
        newQuestions.push({
            section: reasoningSectionName,
            displayId: 61 + i,
            q: q.q,
            o: q.o,
            a: q.a
        });
    }

    setTestQuestions(newQuestions);
    setStep('test');
    setTimeLeft(5400); // 90 Minutes
    setCurrentQIndex(0);
    setAnswers({});
    setScore(0);
  };

  // Timer Logic
  useEffect(() => {
    if (step === 'test' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === 'test') {
      handleSubmit();
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optIndex: number) => {
    if (!testQuestions[currentQIndex]) return;
    setAnswers(prev => ({ ...prev, [testQuestions[currentQIndex].displayId]: optIndex }));
  };

  const handleConfirmSubmit = () => {
      const answeredCount = Object.keys(answers).length;
      if (window.confirm(`You have answered ${answeredCount} out of 100 questions. Are you sure you want to submit?`)) {
          handleSubmit();
      }
  };

  const handleSubmit = () => {
    let calcScore = 0;
    testQuestions.forEach(q => {
      if (answers[q.displayId] === q.a) {
        calcScore += 2;
      } else if (answers[q.displayId] !== undefined) {
        calcScore -= 0.5;
      }
    });
    setScore(Math.max(0, calcScore));
    setStep('result');
  };

  const currentQuestion = testQuestions[currentQIndex];

  // Calculate Rank Stats
  const totalMarks = 200;
  const percentage = (score / totalMarks) * 100;
  const accuracy = (Object.keys(answers).length > 0) ? ((score / (Object.keys(answers).length * 2)) * 100).toFixed(1) : '0';
  const percentile = Math.min(99.9, (score > 50 ? 80 + (score/10) : 40 + (score/5))).toFixed(2);
  const rank = Math.max(1, Math.floor(50000 - (score * 200)));
  const isPass = percentage >= 40;

  if (step === 'test' && !currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-7xl h-full md:h-[95vh] md:rounded-xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
           <div className="flex flex-col">
               <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                   <Award className="text-yellow-400" size={20}/> {title}
               </h3>
               {step === 'test' && (
                   <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                       <Globe size={10}/> Lang: {LANGUAGES.find(l => l.code === selectedLang)?.name} | Q: {100} | Marks: 200
                   </span>
               )}
           </div>
           {step === 'test' ? (
             <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 shadow-inner">
                <Clock size={16} className="text-red-400 animate-pulse"/> 
                <span className="font-mono font-bold text-xl text-red-100">{formatTime(timeLeft)}</span>
             </div>
           ) : (
             <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
             </button>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-0 md:p-4">
            
            {/* 1. INSTRUCTIONS */}
            {step === 'instructions' && (
                <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-sm mt-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Instructions</h2>
                        <p className="text-slate-500">Select language to generate your 100-Question Mock Paper.</p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
                        <label className="block text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wide">Select Language</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang.code)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${selectedLang === lang.code ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={generateQuestions}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold shadow-xl text-lg flex items-center gap-3 transform hover:scale-105 transition-all"
                        >
                            Start Test (100 Qs) <ChevronRight size={24}/>
                        </button>
                    </div>
                </div>
            )}

            {/* 2. LIVE TEST */}
            {step === 'test' && currentQuestion && (
                <div className="flex flex-col lg:flex-row gap-4 h-full">
                    {/* Question Area */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200">
                        <div className="p-4 bg-slate-50 border-b flex justify-between">
                            <span className="font-bold text-slate-600">Section: {currentQuestion.section}</span>
                            <span className="font-bold text-indigo-600">Question {currentQIndex + 1} / 100</span>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto">
                            <h4 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{currentQuestion.q}</h4>
                            <div className="grid gap-3">
                                {currentQuestion.o.map((opt: string, idx: number) => (
                                    <label 
                                        key={idx} 
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${answers[currentQuestion.displayId] === idx ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[currentQuestion.displayId] === idx ? 'border-indigo-600' : 'border-slate-300'}`}>
                                            {answers[currentQuestion.displayId] === idx && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                                        </div>
                                        <span className="font-medium text-slate-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t bg-slate-50 flex justify-between">
                            <button onClick={() => setCurrentQIndex(p => Math.max(0, p-1))} disabled={currentQIndex===0} className="px-6 py-2 bg-white border rounded-lg font-bold disabled:opacity-50 text-slate-600">Prev</button>
                            <button onClick={() => setCurrentQIndex(p => Math.min(99, p+1))} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save & Next</button>
                        </div>
                    </div>
                    
                    {/* Palette */}
                    <div className="w-full lg:w-80 bg-white rounded-xl border p-4 overflow-y-auto flex flex-col">
                        <h4 className="font-bold mb-4 text-slate-800">Question Palette</h4>
                        <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 content-start">
                             {testQuestions.map((_, idx) => (
                                 <button 
                                    key={idx} 
                                    onClick={() => setCurrentQIndex(idx)}
                                    className={`h-9 rounded text-xs font-bold transition-colors ${
                                        currentQIndex === idx ? 'bg-slate-800 text-white ring-2 ring-slate-400' :
                                        answers[testQuestions[idx].displayId] !== undefined ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                 >
                                     {idx+1}
                                 </button>
                             ))}
                        </div>
                        <button onClick={handleConfirmSubmit} className="w-full mt-6 bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 shadow-md">Submit Test</button>
                    </div>
                </div>
            )}

            {/* 3. RANK CARD RESULT */}
            {step === 'result' && (
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden mt-8 animate-in zoom-in-95">
                    <div className={`p-10 text-white text-center ${isPass ? 'bg-gradient-to-r from-emerald-600 to-green-600' : 'bg-gradient-to-r from-rose-600 to-red-600'}`}>
                        <h2 className="text-4xl font-extrabold mb-3">{isPass ? '🎉 CONGRATULATIONS!' : '⚠️ NEEDS IMPROVEMENT'}</h2>
                        <p className="opacity-90 text-lg">Your Performance Analysis Report</p>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div className="p-6 bg-slate-50 rounded-2xl border hover:shadow-md transition-shadow">
                            <div className="text-slate-500 text-xs uppercase font-bold mb-3 tracking-wider">Total Score</div>
                            <div className={`text-4xl font-extrabold ${score > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{score}/200</div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border hover:shadow-md transition-shadow">
                            <div className="text-slate-500 text-xs uppercase font-bold mb-3 tracking-wider">All India Rank</div>
                            <div className="text-4xl font-extrabold text-indigo-600">#{rank}</div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border hover:shadow-md transition-shadow">
                            <div className="text-slate-500 text-xs uppercase font-bold mb-3 tracking-wider">Percentile</div>
                            <div className="text-4xl font-extrabold text-purple-600">{percentile}%</div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border hover:shadow-md transition-shadow">
                            <div className="text-slate-500 text-xs uppercase font-bold mb-3 tracking-wider">Accuracy</div>
                            <div className="text-4xl font-extrabold text-blue-600">{accuracy}%</div>
                        </div>
                    </div>

                    <div className="px-8 pb-10 flex justify-center gap-4">
                         <button onClick={onClose} className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 transition-colors">Close Report</button>
                         <button onClick={generateQuestions} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-lg transition-colors">Retake Test</button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
