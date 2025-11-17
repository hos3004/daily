
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { REWARDS_LIST } from '../constants';
import { Card } from '../components/Card';
import { GiftIcon } from '../components/Icons';

export const RewardsPage: React.FC = () => {
  const { points, redeemReward } = useData();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleRedeem = (cost: number, title: string) => {
    const success = redeemReward(cost);
    if (success) {
      setMessage({type: 'success', text: `تم استبدال المكافأة "${title}" بنجاح!`});
    } else {
      setMessage({type: 'error', text: 'نقاطك الحالية لا تكفي لهذه المكافأة.'});
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">النقاط والمكافآت</h1>
      
      <Card className="text-center bg-secondary text-white">
        <p className="text-lg">رصيد نقاطك الحالي</p>
        <p className="text-5xl font-bold my-2">{points.current_points}</p>
        <p className="text-sm opacity-80">إجمالي النقاط المكتسبة: {points.lifetime_points}</p>
      </Card>
      
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center">
            <GiftIcon />
            <span className="mr-2">قائمة المكافآت</span>
        </h2>
        {message && (
             <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
             </div>
        )}
        <div className="space-y-3">
          {REWARDS_LIST.map(reward => (
            <div key={reward.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-bold">{reward.title}</p>
                <p className="text-sm text-gray-500">{reward.cost} نقطة</p>
              </div>
              <button
                onClick={() => handleRedeem(reward.cost, reward.title)}
                disabled={points.current_points < reward.cost}
                className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-dark"
              >
                استخدام
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
