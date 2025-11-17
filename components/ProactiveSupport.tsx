import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from './Card';
import { BrainIcon } from './Icons';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const ProactiveSupport: React.FC = () => {
    const { dailyLogs, resetProtocol } = useData();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const checkAndGenerateSupport = useCallback(async () => {
        // Condition: a habit was missed for 2 consecutive days, and the user has used reset protocol before
        if (dailyLogs.length < 2 || !localStorage.getItem('resetProtocol')) {
            setIsLoading(false);
            return;
        }

        const lastTwoLogs = dailyLogs.slice(-2);
        const missedHabitsDay1 = lastTwoLogs[0].habits.filter(h => !h.done).map(h => h.key);
        const missedHabitsDay2 = lastTwoLogs[1].habits.filter(h => !h.done).map(h => h.key);

        const commonMissedHabits = missedHabitsDay1.filter(h => missedHabitsDay2.includes(h));

        if (commonMissedHabits.length > 0) {
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key is not configured.");
                }
                const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
                
                const prompt = `
                    أنت مدرب صحي داعم ولطيف. 
                    المستخدم تخطى هذه العادة "${commonMissedHabits.join(', ')}" ليومين متتاليين.
                    في الماضي، واجه المستخدم صعوبات أدت به لاستخدام بروتوكول العودة من الانتكاسة.
                    مهمتك: اكتب رسالة دعم قصيرة (30 كلمة)، لطيفة، واستباقية باللغة العربية. 
                    لا تكن منذراً. كن مشجعاً واقترح إجراءً إيجابياً بسيطاً جداً (مثل شرب كوب ماء أو المشي لدقيقتين).
                `;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                });

                setMessage(response.text);

            } catch (err) {
                console.error("Error generating proactive support:", err);
            }
        }
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dailyLogs.length]);

    useEffect(() => {
        // Run check once on component mount
        checkAndGenerateSupport();
    }, [checkAndGenerateSupport]);

    if (isLoading || !message) {
        return null; // Don't render anything if no message or still loading
    }

    return (
        <Card className="bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-blue-800 flex items-center mb-2">
                <BrainIcon className="w-5 h-5 text-blue-500 ml-2" />
                رسالة من مدربك
            </h3>
            <p className="text-blue-700 text-sm">{message}</p>
        </Card>
    );
};