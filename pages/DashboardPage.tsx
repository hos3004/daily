import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Page, DailyLog, HabitDefinition } from '../types';
import { HABITS_DEFINITIONS, SUPPLEMENTS_DEFINITIONS } from '../constants';
import { Card } from '../components/Card';
import { 
    WaterDropIcon, 
    NoCarbIcon, 
    HealthyMealIcon, 
    ClockIcon, 
    ExerciseIcon, 
    PillIcon, 
    BreakfastIcon,
    FireIcon,
    StarIcon,
    TrendingUpIcon,
    ShieldExclamationIcon,
    ClipboardListIcon
} from '../components/Icons';
import { AICoach } from '../components/AICoach';
import { ProactiveSupport } from '../components/ProactiveSupport';

const habitConfig: { [key: string]: { icon: React.ReactNode; colors: string; } } = {
  water_target: { icon: <WaterDropIcon className="h-10 w-10" />, colors: 'from-cyan-400 to-blue-500' },
  movement_done: { icon: <ExerciseIcon />, colors: 'from-purple-400 to-pink-500' },
  no_sugar_bread: { icon: <NoCarbIcon />, colors: 'from-red-400 to-orange-500' },
  healthy_lunch: { icon: <HealthyMealIcon />, colors: 'from-green-400 to-teal-500' },
  last_meal_before_6: { icon: <ClockIcon />, colors: 'from-blue-400 to-indigo-500' },
  supplements_taken: { icon: <PillIcon />, colors: 'from-yellow-400 to-amber-500' },
  ate_breakfast: { icon: <BreakfastIcon />, colors: 'from-amber-400 to-orange-500' },
};

const HabitCard: React.FC<{
    habitDef: HabitDefinition,
    isDone: boolean,
    onClick: () => void,
}> = ({ habitDef, isDone, onClick }) => {
    const config = habitConfig[habitDef.key] || { icon: '❓', colors: 'from-gray-400 to-gray-500' };

    return (
        <div
            onClick={onClick}
            className={`relative p-4 rounded-xl text-white shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 overflow-hidden ${config.colors} bg-gradient-to-br`}
        >
            <div className={`transition-opacity duration-300 ${isDone ? 'opacity-30' : 'opacity-100'}`}>
                <div className="mb-4">
                    {config.icon}
                </div>
                <h3 className="font-bold text-lg">{habitDef.label}</h3>
                <p className="text-sm opacity-80">اليوم</p>
            </div>
            {isDone && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl transform -rotate-12">مكتمل!</span>
                </div>
            )}
        </div>
    );
};

const StatCard: React.FC<{icon: React.ReactNode, title: string, value: string | number}> = ({icon, title, value}) => (
    <Card className="flex items-center p-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
        <div className="mr-3">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="font-bold text-xl">{value}</p>
        </div>
    </Card>
);

const QuickActionButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void}> = ({icon, label, onClick}) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border h-full">
        <div className="text-primary">{icon}</div>
        <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
    </button>
);


export const DashboardPage: React.FC<{ setPage: (page: Page) => void; }> = ({ setPage }) => {
  const { getLogForDate, updateLog, points, resetProtocol } = useData();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  
  // State for modals
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isSupplementsModalOpen, setIsSupplementsModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  // Temporary state for modal inputs
  const [tempWaterCups, setTempWaterCups] = useState(0);
  const [tempSupplements, setTempSupplements] = useState<Record<string, boolean>>({});
  const [tempMovementDetails, setTempMovementDetails] = useState<DailyLog['movementDetails']>({ type: null, duration: 0, steps: 0 });
  
  const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
      setTodayLog(getLogForDate(todayDateString));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDateString, getLogForDate]);

  const handleToggleHabit = (key: string) => {
    setTodayLog(prevLog => {
        if (!prevLog) return null;
        const newHabits = prevLog.habits.map(h =>
            h.key === key ? { ...h, done: !h.done } : h
        );
        const newLog = { ...prevLog, habits: newHabits };
        updateLog(newLog);
        return newLog;
    });
  };

  const handleCardClick = (habitKey: string) => {
    if (habitKey === 'water_target') {
        setTempWaterCups(todayLog?.waterCups || 0);
        setIsWaterModalOpen(true);
    } else if (habitKey === 'supplements_taken') {
        setTempSupplements(todayLog?.supplements_status || {});
        setIsSupplementsModalOpen(true);
    } else if (habitKey === 'movement_done') {
        setTempMovementDetails(todayLog?.movementDetails || { type: null });
        setIsMovementModalOpen(true);
    } else {
        handleToggleHabit(habitKey);
    }
  };
  
  const handleSaveWater = () => {
    if (!todayLog) return;
    
    const isWaterTargetMet = tempWaterCups >= 10;
    const newHabits = todayLog.habits.map(h => 
        h.key === 'water_target' ? { ...h, done: isWaterTargetMet } : h
    );
    const updatedLog = { ...todayLog, waterCups: tempWaterCups, habits: newHabits };

    updateLog(updatedLog);
    setTodayLog(updatedLog);
    setIsWaterModalOpen(false);
  };

  const handleSaveSupplements = () => {
    if (!todayLog) return;

    const dailySupplementsKeys = SUPPLEMENTS_DEFINITIONS
        .filter(s => s.label.includes("يوميًا"))
        .map(s => s.key);
    const allDailySupplementsTaken = dailySupplementsKeys.every(key => tempSupplements[key]);

    const newHabits = todayLog.habits.map(h =>
        h.key === 'supplements_taken' ? { ...h, done: allDailySupplementsTaken } : h
    );
    const updatedLog = { ...todayLog, supplements_status: tempSupplements, habits: newHabits };

    updateLog(updatedLog);
    setTodayLog(updatedLog);
    setIsSupplementsModalOpen(false);
  };

  const handleSaveMovement = () => {
    if (!todayLog) return;
    
    const isMovementDone = !!tempMovementDetails?.type && ((tempMovementDetails.duration || 0) > 0 || (tempMovementDetails.steps || 0) > 0);
    
    const newHabits = todayLog.habits.map(h =>
        h.key === 'movement_done' ? { ...h, done: isMovementDone } : h
    );
    const updatedLog = { ...todayLog, movementDetails: tempMovementDetails, habits: newHabits };
    
    updateLog(updatedLog);
    setTodayLog(updatedLog);
    setIsMovementModalOpen(false);
  };

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayString = new Date().toLocaleDateString('ar-EG', dateOptions);

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">أهلاً بعودتك!</h1>
        <p className="text-gray-500">{todayString}</p>
      </header>

      {resetProtocol.is_active && (
        <Card className="bg-red-50 border border-red-200 text-red-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold">أنت في بروتوكول العودة!</h3>
            <p className="text-sm">اليوم {resetProtocol.day} من 3. استمر بقوة!</p>
          </div>
          <button onClick={() => setPage(Page.Reset)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
            عرض الخطة
          </button>
        </Card>
      )}

      <ProactiveSupport />

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<StarIcon />} title="النقاط الحالية" value={points.current_points} />
        <StatCard icon={<FireIcon className="h-6 w-6" />} title="أيام متتالية" value={points.streak_days} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-3">عاداتك اليومية</h2>
        <div className="grid grid-cols-2 gap-4">
            {HABITS_DEFINITIONS.map(habitDef => {
                const isDone = todayLog?.habits.find(h => h.key === habitDef.key)?.done || false;
                return (
                    <HabitCard
                        key={habitDef.key}
                        habitDef={habitDef}
                        isDone={isDone}
                        onClick={() => handleCardClick(habitDef.key)}
                    />
                );
            })}
        </div>
      </div>

       <div>
        <h2 className="text-xl font-bold text-gray-700 mb-3">وصول سريع</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
            <QuickActionButton icon={<TrendingUpIcon />} label="التقدم" onClick={() => setPage(Page.Progress)} />
            <QuickActionButton icon={<ShieldExclamationIcon />} label="الطوارئ" onClick={() => setPage(Page.Reset)} />
            <QuickActionButton icon={<ClipboardListIcon className="h-6 w-6"/>} label="الوجبات" onClick={() => setPage(Page.Meals)} />
        </div>
      </div>

      <AICoach />

      {/* Water Modal */}
      {isWaterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-center">💧 تسجيل شرب الماء</h3>
            <div className="grid grid-cols-5 gap-x-2 gap-y-3 justify-items-center" dir="ltr">
              {Array.from({ length: 10 }, (_, i) => (
                <button key={i} onClick={() => setTempWaterCups(prev => prev === i + 1 ? i : i + 1)}>
                  <WaterDropIcon className={`h-10 w-10 transition-colors ${tempWaterCups > i ? 'text-blue-500' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <p className="text-center mt-3 font-bold text-lg text-blue-600">{tempWaterCups} / 10 أكواب</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsWaterModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إلغاء</button>
              <button onClick={handleSaveWater} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">حفظ</button>
            </div>
          </Card>
        </div>
      )}

      {/* Supplements Modal */}
      {isSupplementsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-center">💊 تسجيل المكملات</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {SUPPLEMENTS_DEFINITIONS.map(sup => (
                <div key={sup.key} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id={`modal-sup-${sup.key}`}
                    checked={tempSupplements[sup.key] || false}
                    onChange={() => setTempSupplements(prev => ({...prev, [sup.key]: !prev[sup.key]}))}
                    className="h-5 w-5 rounded border-gray-400 text-secondary focus:ring-secondary"
                  />
                  <label htmlFor={`modal-sup-${sup.key}`} className="mr-3 text-md text-gray-700">{sup.label}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsSupplementsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إلغاء</button>
              <button onClick={handleSaveSupplements} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">حفظ</button>
            </div>
          </Card>
        </div>
      )}

      {/* Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-center">🏃 تسجيل الحركة</h3>
            <div className="flex rounded-lg shadow-sm">
              <button
                onClick={() => setTempMovementDetails(prev => ({ ...prev, type: prev?.type === 'walk' ? null : 'walk' }))}
                className={`flex-1 py-3 px-4 rounded-r-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${tempMovementDetails?.type === 'walk' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <span>مشي</span> 🚶
              </button>
              <button
                onClick={() => setTempMovementDetails(prev => ({ ...prev, type: prev?.type === 'exercise' ? null : 'exercise' }))}
                className={`flex-1 py-3 px-4 rounded-l-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${tempMovementDetails?.type === 'exercise' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <span>تمارين</span> 🏋️
              </button>
            </div>

            {tempMovementDetails?.type && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tempMovementDetails.type === 'walk' && (
                    <div>
                      <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">عدد الخطوات</label>
                      <input
                        type="number" id="steps"
                        value={tempMovementDetails.steps || ''}
                        onChange={(e) => setTempMovementDetails(prev => ({...prev, steps: parseInt(e.target.value) || 0}))}
                        placeholder="5000"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">المدة (بالدقائق)</label>
                    <input
                      type="number" id="duration"
                      value={tempMovementDetails.duration || ''}
                      onChange={(e) => setTempMovementDetails(prev => ({...prev, duration: parseInt(e.target.value) || 0}))}
                      placeholder="20"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
             <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsMovementModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إلغاء</button>
              <button onClick={handleSaveMovement} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">حفظ</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};