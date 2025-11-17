import React, { useState, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from './Card';
import { SparklesIcon } from './Icons';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const AICoach: React.FC = () => {
    const { dailyLogs } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [advice, setAdvice] = useState('');
    const [error, setError] = useState('');

    const getAdvice = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAdvice('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

            const recentLogs = dailyLogs.slice(-3).map(log => {
                const doneHabits = log.habits.filter(h => h.done).map(h => h.key).join(', ') || 'none';
                const missedHabits = log.habits.filter(h => !h.done).map(h => h.key).join(', ') || 'none';
                return `Date: ${log.date}, Habits Done: [${doneHabits}], Habits Missed: [${missedHabits}], Notes: "${log.notes || ''}"`;
            }).join('\n');
            
            const systemInstruction = "أنت مدرب صحي خبير ولطيف. مهمتك هي تحليل بيانات المستخدم التالية وتقديم نصيحة واحدة، محفزة، وقابلة للتنفيذ. كن إيجابياً دائماً. لا تصدر أحكاماً. اجعل النصيحة قصيرة (لا تتجاوز 50 كلمة). تحدث باللغة العربية.";
            
            const userPrompt = `
                User Data:
                ${recentLogs}

                Your output should be:
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            setAdvice(response.text);

        } catch (err) {
            console.error("Error getting advice from AI:", err);
            setError("عذراً، حدث خطأ أثناء الحصول على النصيحة. الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    }, [dailyLogs]);

    return (
        <Card>
            <h2 className="text-xl font-bold text-gray-700 mb-3 flex items-center">
                <SparklesIcon className="w-5 h-5 text-purple-500 ml-2" />
                مدربك الذكي
            </h2>
            {isLoading ? (
                <p className="text-center text-gray-500">جارٍ تحليل تقدمك...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : advice ? (
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-200">{advice}</p>
            ) : (
                <p className="text-gray-500 text-sm mb-3">احصل على نصيحة مخصصة بناءً على أدائك الأخير للمساعدة في تحفيزك.</p>
            )}
            <button
                onClick={getAdvice}
                disabled={isLoading}
                className="w-full mt-3 bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-purple-300 flex items-center justify-center"
            >
                {isLoading ? '...لحظات' : 'احصل على نصيحة اليوم'}
            </button>
        </Card>
    );
};