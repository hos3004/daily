import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DailyLog, Measurement, PointsState, ResetProtocol, HabitStatus, Meal } from '../types';
import { HABITS_DEFINITIONS, SUPPLEMENTS_DEFINITIONS } from '../constants';

interface DataContextType {
  dailyLogs: DailyLog[];
  measurements: Measurement[];
  points: PointsState;
  resetProtocol: ResetProtocol;
  getLogForDate: (date: string) => DailyLog;
  updateLog: (log: DailyLog) => void;
  addMeasurement: (measurement: Omit<Measurement, 'date'>) => void;
  redeemReward: (cost: number) => boolean;
  startResetProtocol: () => void;
  completeResetDay: () => void;
  addMealToLog: (date: string, meal: { type: Meal['type']; title: string }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLog[]>('dailyLogs', []);
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>('measurements', []);
  const [points, setPoints] = useLocalStorage<PointsState>('points', { current_points: 0, lifetime_points: 0, streak_days: 0 });
  const [resetProtocol, setResetProtocol] = useLocalStorage<ResetProtocol>('resetProtocol', { is_active: false, start_date: null, day: 0 });

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const updateLog = useCallback((log: DailyLog) => {
    setDailyLogs(prevLogs => {
      const existingIndex = prevLogs.findIndex(l => l.date === log.date);
      if (existingIndex > -1) {
        const newLogs = [...prevLogs];
        newLogs[existingIndex] = log;
        return newLogs;
      }
      return [...prevLogs, log];
    });
  }, [setDailyLogs]);
  
  const getLogForDate = useCallback((date: string): DailyLog => {
    const existingLog = dailyLogs.find(log => log.date === date);

    const initialSupplementsStatus = SUPPLEMENTS_DEFINITIONS.reduce((acc, s) => {
        acc[s.key] = false;
        return acc;
    }, {} as Record<string, boolean>);

    if (existingLog) {
      // For backward compatibility
      if (!existingLog.supplements_status) {
        existingLog.supplements_status = initialSupplementsStatus;
      }
      if (existingLog.waterCups === undefined) {
        existingLog.waterCups = 0;
      }
      if (!existingLog.movementDetails) {
        existingLog.movementDetails = { type: null, duration: 0, steps: 0 };
      }
      return existingLog;
    }

    return {
      date,
      habits: HABITS_DEFINITIONS.map(h => ({ key: h.key, done: false })),
      notes: '',
      meals: [],
      supplements_status: initialSupplementsStatus,
      waterCups: 0,
      movementDetails: { type: null, duration: 0, steps: 0 },
    };
  }, [dailyLogs]);

  const addMeasurement = (measurement: Omit<Measurement, 'date'>) => {
    const timestamp = new Date().toISOString();
    // Add the new measurement to the beginning of the array for faster access to latest data
    setMeasurements(prev => [{ date: timestamp, ...measurement }, ...prev]);
  };

  const addMealToLog = (date: string, meal: { type: Meal['type']; title: string }) => {
    const log = getLogForDate(date);
    const newMeals = log.meals ? [...log.meals] : [];
    
    // To keep the log simple, we'll just append to notes.
    const mealNote = `\n- وجبة ${meal.type === 'breakfast' ? 'الفطور' : meal.type === 'lunch' ? 'الغداء' : 'السناك'}: ${meal.title}.`;
    
    // Avoid adding duplicate notes if user clicks multiple times
    if(!log.notes?.includes(mealNote)) {
        const newNotes = (log.notes || '') + mealNote;
        updateLog({ ...log, notes: newNotes });
    }
  };
  
  const redeemReward = (cost: number): boolean => {
    if (points.current_points >= cost) {
      setPoints(prev => ({
        ...prev,
        current_points: prev.current_points - cost,
      }));
      return true;
    }
    return false;
  };
  
  const startResetProtocol = () => {
    setResetProtocol({ is_active: true, start_date: getTodayDateString(), day: 1 });
  };

  const completeResetDay = () => {
    if (resetProtocol.day < 3) {
      setResetProtocol(prev => ({ ...prev, day: prev.day + 1 }));
    } else {
      setResetProtocol({ is_active: false, start_date: null, day: 0 });
      setPoints(prev => ({...prev, current_points: prev.current_points + 20, lifetime_points: prev.lifetime_points + 20})); // Bonus points
    }
  };


  useEffect(() => {
    // Recalculate points and streak whenever logs change
    let totalPoints = 0;
    let streak = 0;
    let lastDate: Date | null = null;
    
    const sortedLogs = [...dailyLogs].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let weeklyBonusApplied = new Set<string>();
    let monthlyBonusApplied = new Set<string>();

    for (const log of sortedLogs) {
        let dailyPoints = 0;
        let allHabitsDone = true;
        log.habits.forEach(h => {
            if (h.done) {
                const habitDef = HABITS_DEFINITIONS.find(def => def.key === h.key);
                dailyPoints += habitDef?.points || 0;
            } else {
                allHabitsDone = false;
            }
        });
        totalPoints += dailyPoints;
        if(allHabitsDone) totalPoints += 10; // Daily bonus

        // Calculate streak
        const currentDate = new Date(log.date);
        currentDate.setHours(0,0,0,0);
        if(lastDate){
            const diffTime = currentDate.getTime() - lastDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
            } else if (diffDays > 1){
                streak = 1;
            }
        } else {
            streak = 1;
        }
        lastDate = currentDate;

        // Weekly bonus
        if(streak > 0 && streak % 7 === 0) {
           const weekIdentifier = `${currentDate.getFullYear()}-w${Math.floor(streak/7)}`;
           if(!weeklyBonusApplied.has(weekIdentifier)){
              totalPoints += 100;
              weeklyBonusApplied.add(weekIdentifier);
           }
        }

        // Monthly bonus (approx 30 days)
        if(streak > 0 && streak % 30 === 0) {
            const monthIdentifier = `${currentDate.getFullYear()}-m${Math.floor(streak/30)}`;
            if(!monthlyBonusApplied.has(monthIdentifier)) {
                totalPoints += 500;
                monthlyBonusApplied.add(monthIdentifier);
            }
        }
    }

    // Check if the last log was yesterday to maintain streak
    if (lastDate) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        streak = 0;
      }
    } else {
        streak = 0;
    }


    setPoints(p => {
        const spentPoints = p.lifetime_points - p.current_points;
        return {
            current_points: totalPoints - spentPoints,
            lifetime_points: totalPoints,
            streak_days: streak
        }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyLogs]);


  return (
    <DataContext.Provider value={{ dailyLogs, measurements, points, resetProtocol, getLogForDate, updateLog, addMeasurement, redeemReward, startResetProtocol, completeResetDay, addMealToLog }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};