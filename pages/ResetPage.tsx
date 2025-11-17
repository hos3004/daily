
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Page } from '../types';
import { Card } from '../components/Card';
import { RESET_PLAN } from '../constants';

interface ResetPageProps {
  setPage: (page: Page) => void;
}

export const ResetPage: React.FC<ResetPageProps> = ({ setPage }) => {
  const { resetProtocol, startResetProtocol, completeResetDay } = useData();

  const handleStart = () => {
    startResetProtocol();
  };
  
  const handleCompleteDay = () => {
    completeResetDay();
    if(resetProtocol.day === 3) {
      alert("أحسنت! لقد أكملت بروتوكول العودة بنجاح. تم إضافة نقاط إضافية كمكافأة.");
      setPage(Page.Dashboard);
    }
  }

  if (!resetProtocol.is_active) {
    return (
      <div className="p-4 text-center">
        <Card>
          <h1 className="text-2xl font-bold text-red-600">بروتوكول العودة من الانتكاسة</h1>
          <p className="my-4 text-gray-600">
            هل حدثت انتكاسة؟ لا تقلق، هذا طبيعي ويحدث للجميع. الأهم هو سرعة العودة للمسار الصحيح.
            هذا البروتوكول مصمم لمساعدتك على استعادة السيطرة خلال 3 أيام.
          </p>
          <button 
            onClick={handleStart}
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors text-lg"
          >
            ابدأ بروتوكول العودة (3 أيام)
          </button>
        </Card>
      </div>
    );
  }

  const currentDayPlan = RESET_PLAN.find(p => p.day === resetProtocol.day);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">بروتوكول العودة - اليوم {resetProtocol.day}</h1>
      {currentDayPlan && (
        <Card>
          <h2 className="text-xl font-bold mb-2">{currentDayPlan.title}</h2>
          <ul className="list-disc pr-5 space-y-2 mb-4">
            {currentDayPlan.tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
          <p className="p-3 bg-yellow-100 text-yellow-800 rounded-md text-center font-semibold">{currentDayPlan.motivation}</p>
        </Card>
      )}
      <button 
        onClick={handleCompleteDay}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors text-lg"
      >
        {resetProtocol.day < 3 ? '✅ أكملت مهام اليوم' : '🎉 إنهاء البروتوكول والعودة للنظام'}
      </button>
    </div>
  );
};
