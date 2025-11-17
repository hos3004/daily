import React, { useState } from 'react';
import { Card } from './Card';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INFO_SECTIONS, MEALS_DATA } from '../constants';

export const AIMealPlanner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [request, setRequest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState('');
    const [error, setError] = useState('');

    const dietRules = INFO_SECTIONS.find(s => s.title.includes("الأساسيات الخمسة"))?.content.replace(/<[^>]*>?/gm, '') || '';
    const existingMeals = MEALS_DATA.map(m => `- ${m.title}: ${m.ingredients.join(', ')}`).join('\n');
    
    const handleGeneratePlan = async () => {
        if (!request) {
            setError("الرجاء كتابة طلبك أولاً.");
            return;
        }
        setIsLoading(true);
        setError('');
        setPlan('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                أنت خبير تغذية متخصص في إنشاء خطط وجبات.
                قواعد النظام الغذائي الصارمة هي: "${dietRules}".
                لدينا قائمة بالوجبات المعتمدة مسبقًا:
                ${existingMeals}

                طلب المستخدم هو: "${request}"

                مهمتك هي إنشاء خطة وجبات أو اقتراحات جديدة ومبتكرة بناءً على طلب المستخدم، مع الالتزام التام بقواعد النظام.
                يجب أن تكون الردود باللغة العربية وبتنسيق Markdown بسيط وواضح.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            
            setPlan(response.text);

        } catch (err) {
            console.error("Error generating meal plan:", err);
            setError("عذراً، حدث خطأ أثناء إنشاء الخطة. الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-center">إنشاء خطة وجبات</h2>
                <textarea
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="مثال: أريد 3 أفكار فطور غنية بالبروتين وبدون بيض..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary mb-3"
                ></textarea>
                
                {isLoading ? (
                    <p className="text-center p-4">جارٍ إنشاء الخطة...</p>
                ) : error ? (
                    <p className="text-center p-4 text-red-500">{error}</p>
                ) : plan && (
                    <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{plan}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 mt-4">
                    <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300">
                        {isLoading ? '...لحظات' : 'أنشئ الخطة'}
                    </button>
                    <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        إغلاق
                    </button>
                </div>
            </Card>
        </div>
    );
};