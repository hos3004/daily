import React, { useState, useRef } from 'react';
import { Card } from './Card';
import { CameraIcon } from './Icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INFO_SECTIONS } from '../constants';
import { useData } from '../contexts/DataContext';

async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export const AIMealAnalyzer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addMealToLog } = useData();
    
    const dietRules = INFO_SECTIONS.find(s => s.title.includes("الأساسيات الخمسة"))?.content.replace(/<[^>]*>?/gm, '') || '';

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysis('');
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) {
            setError("الرجاء تحديد صورة أولاً.");
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                أنت مساعد صحي خبير. قم بتحليل الوجبة في الصورة. 
                1. صف المكونات الرئيسية التي تراها.
                2. بناءً على قواعد النظام الغذائي التالية، قم بتقييم مدى توافق الوجبة. قواعد النظام: "${dietRules}".
                3. قدم تقييمك النهائي بشكل مشجع ومختصر باللغة العربية.
            `;
            
            const imagePart = await fileToGenerativePart(imageFile);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [{ text: prompt }, imagePart] },
            });
            
            setAnalysis(response.text);

        } catch (err) {
            console.error("Error analyzing meal:", err);
            setError("عذراً، حدث خطأ أثناء تحليل الوجبة. قد تكون الصورة غير واضحة أو هناك مشكلة في الشبكة.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveMeal = () => {
        const mealTitle = analysis.split('\n')[0] || "وجبة تم تحليلها";
        const today = new Date().toISOString().split('T')[0];
        addMealToLog(today, { type: 'lunch', title: mealTitle });
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-center">تحليل الوجبة بالصورة</h2>
                
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                ) : (
                    <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 mb-4">
                        <CameraIcon className="h-12 w-12" />
                        <span>اضغط لاختيار صورة</span>
                    </button>
                )}

                {isLoading ? (
                    <p className="text-center p-4">جارٍ تحليل الوجبة...</p>
                ) : error ? (
                    <p className="text-center p-4 text-red-500">{error}</p>
                ) : analysis && (
                    <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                        <p className="whitespace-pre-wrap">{analysis}</p>
                    </div>
                )}
                
                <div className="flex flex-col gap-3 mt-4">
                    <button onClick={handleAnalyze} disabled={!imageFile || isLoading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300">
                        {isLoading ? '...لحظات' : 'حلل الوجبة'}
                    </button>
                    {analysis && <button onClick={handleSaveMeal} className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">تسجيل الوجبة</button>}
                    <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        إغلاق
                    </button>
                </div>
            </Card>
        </div>
    );
};