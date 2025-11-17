
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { DailyLog } from '../types';
import { HABITS_DEFINITIONS, SUPPLEMENTS_DEFINITIONS } from '../constants';
import { Card } from '../components/Card';
import { WaterDropIcon } from '../components/Icons';

// Helper component for a single habit checkbox item
// FIX: Typed HabitCheckbox as a React.FC to correctly handle the 'key' prop when used in a list.
const HabitCheckbox: React.FC<{ label: string, points: number, checked: boolean, onChange: () => void, children?: React.ReactNode }> = ({ label, points, checked, onChange, children }) => (
    <div
        className={`p-3 rounded-lg transition-colors duration-200 ${checked ? 'bg-emerald-50' : 'bg-gray-50'} border ${checked ? 'border-emerald-200' : 'border-gray-200'}`}
    >
        <div
            onClick={onChange}
            className="flex items-center justify-between cursor-pointer"
        >
            <div className="flex items-center">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 flex-shrink-0 ${checked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                    {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-md font-medium ${checked ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
            </div>
            { points > 0 && 
                <span className={`font-bold text-sm px-2 py-1 rounded-full ${checked ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                    +{points}
                </span>
            }
        </div>
        {children && <div className="mt-3 pt-3 border-t border-gray-200">{children}</div>}
    </div>
);


export const HabitsPage: React.FC = () => {
    const { getLogForDate, updateLog } = useData();
    const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
    const [message, setMessage] = useState('');

    const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

    useEffect(() => {
        const log = getLogForDate(todayDateString);
        setTodayLog(log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todayDateString]);

    // This effect synchronizes the main habit status from detailed inputs
    useEffect(() => {
        if (!todayLog) return;
        
        const isWaterTargetMet = (todayLog.waterCups || 0) >= 10;
        const movementDetails = todayLog.movementDetails || { type: null, duration: 0, steps: 0 };
        const isMovementDone = !!movementDetails.type && ((movementDetails.duration || 0) > 0 || (movementDetails.steps || 0) > 0);

        const dailySupplementsKeys = SUPPLEMENTS_DEFINITIONS
            .filter(s => s.label.includes("يوميًا"))
            .map(s => s.key);
        const allDailySupplementsTaken = dailySupplementsKeys.every(key => todayLog.supplements_status?.[key]);

        let needsUpdate = false;
        const newHabits = todayLog.habits.map(h => {
            if (h.key === 'water_target' && h.done !== isWaterTargetMet) {
                needsUpdate = true;
                return { ...h, done: isWaterTargetMet };
            }
            if (h.key === 'movement_done' && h.done !== isMovementDone) {
                needsUpdate = true;
                return { ...h, done: isMovementDone };
            }
            if (h.key === 'supplements_taken' && h.done !== allDailySupplementsTaken) {
                needsUpdate = true;
                return { ...h, done: allDailySupplementsTaken };
            }
            return h;
        });

        if (needsUpdate) {
            setTodayLog(prev => prev ? { ...prev, habits: newHabits } : null);
        }

    }, [todayLog]);


    const handleToggle = (key: string) => {
        setTodayLog(prevLog => {
            if (!prevLog) return null;
            const newHabits = prevLog.habits.map(h =>
                h.key === key ? { ...h, done: !h.done } : h
            );
            return { ...prevLog, habits: newHabits };
        });
    };

    const handleSupplementToggle = (supplementKey: string) => {
        setTodayLog(prevLog => {
            if (!prevLog) return null;
            const newSupplementsStatus = {
                ...(prevLog.supplements_status || {}),
                [supplementKey]: !prevLog.supplements_status?.[supplementKey],
            };
            return { ...prevLog, supplements_status: newSupplementsStatus };
        });
    };
  
    const handleWaterCupsChange = (cupIndex: number) => {
        setTodayLog(prevLog => {
            if (!prevLog) return null;
            const currentCups = prevLog.waterCups || 0;
            const newCups = currentCups === cupIndex + 1 ? cupIndex : cupIndex + 1;
            return { ...prevLog, waterCups: newCups };
        });
    };

    const handleMovementTypeChange = (type: 'walk' | 'exercise') => {
        setTodayLog(prevLog => {
            if (!prevLog) return null;
            const currentType = prevLog.movementDetails?.type;
            const newType = currentType === type ? null : type;
            const newMovementDetails = {
                ...(prevLog.movementDetails || { duration: 0, steps: 0 }),
                type: newType,
            };
            return { ...prevLog, movementDetails: newMovementDetails };
        });
    };

    const handleMovementDetailChange = (field: 'duration' | 'steps', value: string) => {
        const numValue = parseInt(value, 10);
        setTodayLog(prevLog => {
            if (!prevLog) return null;
            const newMovementDetails = {
                ...(prevLog.movementDetails || { type: null, duration: 0, steps: 0 }),
                [field]: isNaN(numValue) ? undefined : numValue,
            };
            return { ...prevLog, movementDetails: newMovementDetails };
        });
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTodayLog(prevLog => prevLog ? { ...prevLog, notes: e.target.value } : null);
    };
  
    const handleSave = () => {
        if (todayLog) {
            updateLog(todayLog);
            setMessage('تم حفظ تحديثات اليوم بنجاح!');
            window.scrollTo(0, 0);
            setTimeout(() => setMessage(''), 3000);
        }
    };
    
    if (!todayLog) {
        return <div className="p-4 text-center">جارٍ التحميل...</div>;
    }

    const pointsToday = todayLog.habits.reduce((acc, habit) => {
        if (habit.done) {
            const habitDef = HABITS_DEFINITIONS.find(def => def.key === habit.key);
            return acc + (habitDef?.points || 0);
        }
        return acc;
    }, 0);
    
    const todayDateFormatted = new Date(todayLog.date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' });

    const nutritionHabits = HABITS_DEFINITIONS.filter(h => ["no_sugar_bread", "healthy_lunch", "last_meal_before_6", "ate_breakfast"].includes(h.key));
    
    return (
        <div className="pb-24">
            <header className="p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">عادات اليوم</h1>
                        <p className="text-sm text-gray-500">{todayDateFormatted}</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary text-white text-lg font-bold px-4 py-2 rounded-full shadow">
                            {pointsToday} <span className="text-sm font-normal">نقطة</span>
                        </div>
                    </div>
                </div>
                {message && <p className="text-center text-green-600 mt-2 bg-green-100 p-2 rounded-md transition-all">{message}</p>}
            </header>

            <main className="p-4 space-y-5">
                <Card>
                    <h2 className="text-xl font-bold mb-4">🥗 التغذية</h2>
                    <div className="space-y-3">
                       {nutritionHabits.map(habitDef => {
                           const habitStatus = todayLog.habits.find(h => h.key === habitDef.key);
                           return habitStatus ? (
                               <HabitCheckbox 
                                  key={habitDef.key}
                                  label={habitDef.label}
                                  points={habitDef.points}
                                  checked={habitStatus.done}
                                  onChange={() => handleToggle(habitDef.key)}
                               />
                           ) : null
                       })}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-2">💧 الترطيب</h2>
                    <p className="text-sm text-gray-500 mb-4">الهدف: 10 أكواب. كل قطرة تمثل كوب ماء.</p>
                    <div className="grid grid-cols-5 gap-x-2 gap-y-3 justify-items-center" dir="ltr">
                        {Array.from({ length: 10 }, (_, i) => (
                            <button key={i} onClick={() => handleWaterCupsChange(i)}>
                                <WaterDropIcon className={`h-10 w-10 transition-colors ${(todayLog.waterCups || 0) > i ? 'text-blue-500' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                    <p className="text-center mt-3 font-bold text-lg text-blue-600">{todayLog.waterCups || 0} / 10 أكواب</p>
                </Card>
                
                <Card>
                    <h2 className="text-xl font-bold mb-4">🏃 الحركة والنشاط</h2>
                    <div className="flex rounded-lg shadow-sm">
                        <button
                            onClick={() => handleMovementTypeChange('walk')}
                            className={`flex-1 py-3 px-4 rounded-r-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${todayLog.movementDetails?.type === 'walk' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                           <span>مشي</span> 🚶
                        </button>
                        <button
                            onClick={() => handleMovementTypeChange('exercise')}
                            className={`flex-1 py-3 px-4 rounded-l-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${todayLog.movementDetails?.type === 'exercise' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                           <span>تمارين</span> 🏋️
                        </button>
                    </div>

                    {todayLog.movementDetails?.type && (
                          <div className="mt-4 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {todayLog.movementDetails.type === 'walk' && (
                                    <div>
                                        <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">عدد الخطوات</label>
                                        <input
                                            type="number" id="steps"
                                            value={todayLog.movementDetails.steps || ''}
                                            onChange={(e) => handleMovementDetailChange('steps', e.target.value)}
                                            placeholder="5000"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                )}
                                  <div>
                                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">المدة (بالدقائق)</label>
                                      <input
                                          type="number" id="duration"
                                          value={todayLog.movementDetails.duration || ''}
                                          onChange={(e) => handleMovementDetailChange('duration', e.target.value)}
                                          placeholder="20"
                                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                      />
                                  </div>
                              </div>
                          </div>
                      )}
                </Card>
                
                <Card>
                    <h2 className="text-xl font-bold mb-4">💊 المكملات الصحية</h2>
                    <div className="space-y-3">
                        {SUPPLEMENTS_DEFINITIONS.map(sup => (
                           <div key={sup.key} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <input
                                    type="checkbox"
                                    id={`sup-${sup.key}`}
                                    checked={todayLog.supplements_status?.[sup.key] || false}
                                    onChange={() => handleSupplementToggle(sup.key)}
                                    className="h-5 w-5 rounded border-gray-400 text-secondary focus:ring-secondary"
                                />
                                <label htmlFor={`sup-${sup.key}`} className="mr-3 text-md text-gray-700">
                                    {sup.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-2">📝 ملاحظات اليوم</h2>
                    <textarea
                        value={todayLog.notes || ''}
                        onChange={handleNotesChange}
                        placeholder="كيف كان يومك؟ ما هي التحديات أو النجاحات؟"
                        className="w-full h-28 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    ></textarea>
                </Card>
            </main>
            
            <footer className="fixed bottom-20 right-0 left-0 bg-white/90 backdrop-blur-sm border-t p-3 z-20">
                 <button
                    onClick={handleSave}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors text-lg shadow-lg active:scale-95"
                 >
                    حفظ تحديثات اليوم
                 </button>
            </footer>
        </div>
    );
};