import React, { useState, useMemo, useEffect } from 'react';
import { MEALS_DATA } from '../constants';
import { Meal } from '../types';
import { useData } from '../contexts/DataContext';
import { AIMealAnalyzer } from '../components/AIMealAnalyzer';
import { AIMealPlanner } from '../components/AIMealPlanner';
import { CameraIcon, SparklesIcon } from '../components/Icons';

// Simplified card for the grid view
const MealGridCard: React.FC<{ meal: Meal; onClick: () => void; }> = ({ meal, onClick }) => (
    <div 
        onClick={onClick}
        className="cursor-pointer group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95"
    >
        <img src={meal.image_url} alt={meal.title} className="w-full h-32 object-cover" />
        <div className="p-3">
            <h3 className="font-bold text-md truncate">{meal.title}</h3>
            <p className="text-sm text-gray-500">{meal.tags[0]}</p>
        </div>
    </div>
);

// The Modal component for displaying meal details
const MealDetailModal: React.FC<{ meal: Meal; onClose: () => void; onSelect: (meal: Meal) => void; }> = ({ meal, onClose, onSelect }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 animate-scale-in"
            >
                <img src={meal.image_url} alt={meal.title} className="w-full h-48 object-cover"/>
                <div className="p-5 max-h-[calc(100vh-250px)] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">{meal.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {meal.tags.map(tag => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    
                    <h4 className="font-bold text-gray-700 mt-4">المكونات:</h4>
                    <ul className="list-disc pr-5 mt-2 text-gray-600 space-y-1 text-sm">
                        {meal.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                    
                    <h4 className="font-bold text-gray-700 mt-4">ملاحظات:</h4>
                    <p className="mt-2 text-gray-600 text-sm">{meal.notes}</p>
                </div>
                <div className="p-4 bg-gray-50 border-t flex gap-3">
                     <button 
                        onClick={() => { onSelect(meal); onClose(); }}
                        className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors active:scale-95"
                      >
                        اخترت هذه الوجبة
                      </button>
                      <button 
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
                      >
                        إغلاق
                      </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};


export const MealsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Meal['type']>('breakfast');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const { addMealToLog } = useData();
  const [message, setMessage] = useState('');
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  const filteredMeals = useMemo(() => {
    return MEALS_DATA.filter(meal => meal.type === activeTab);
  }, [activeTab]);

  const handleRandom = () => {
    if (filteredMeals.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredMeals.length);
    setSelectedMeal(filteredMeals[randomIndex]);
  };

  const handleSelectMeal = (meal: Meal) => {
    const today = new Date().toISOString().split('T')[0];
    addMealToLog(today, { type: meal.type, title: meal.title });
    setMessage(`تم تسجيل وجبة "${meal.title}" في ملاحظات اليوم!`);
    window.scrollTo(0, 0);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs: { key: Meal['type'], label: string, emoji: string }[] = [
    { key: 'breakfast', label: 'فطور', emoji: '🥣' },
    { key: 'lunch', label: 'غداء', emoji: '🍗' },
    { key: 'snack', label: 'سناك', emoji: '🥒' },
  ];

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">مقترحات الوجبات</h1>
          <p className="text-gray-500">استكشف وجبات صحية أو دع الذكاء الاصطناعي يساعدك!</p>
        </div>
        
        {message && <p className="text-center text-green-600 p-2 bg-green-100 rounded-md transition-all duration-300">{message}</p>}
        
        <div className="grid grid-cols-2 gap-3">
             <button onClick={() => setIsAnalyzerOpen(true)} className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-sm border hover:bg-gray-50">
                <CameraIcon className="w-5 h-5 text-secondary" />
                <span className="font-semibold">حلل وجبة بالصورة</span>
            </button>
            <button onClick={() => setIsPlannerOpen(true)} className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-sm border hover:bg-gray-50">
                <SparklesIcon className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">خطط وجباتي</span>
            </button>
        </div>

        <div className="sticky top-0 z-10 bg-light/80 backdrop-blur-sm py-2">
            <div className="flex justify-around bg-white rounded-lg p-1 shadow-sm border">
                {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                    activeTab === tab.key ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {tab.emoji} {tab.label}
                </button>
                ))}
            </div>
        </div>
        
        <button 
          onClick={handleRandom}
          className="w-full bg-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow active:scale-95"
        >
          ✨ اقترح وجبة عشوائية
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredMeals.map(meal => (
            <MealGridCard
              key={meal.id}
              meal={meal}
              onClick={() => setSelectedMeal(meal)}
            />
          ))}
        </div>
      </div>
      {selectedMeal && (
        <MealDetailModal 
            meal={selectedMeal}
            onClose={() => setSelectedMeal(null)}
            onSelect={handleSelectMeal}
        />
      )}
      {isAnalyzerOpen && <AIMealAnalyzer onClose={() => setIsAnalyzerOpen(false)} />}
      {isPlannerOpen && <AIMealPlanner onClose={() => setIsPlannerOpen(false)} />}
    </>
  );
};