import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Measurement } from '../types';

const MeasurementInput: React.FC<{
  label: string;
  unit: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOptional?: boolean;
}> = ({ label, unit, value, onChange, isOptional = true }) => (
  <div>
    <label htmlFor={label} className="block text-sm font-medium text-gray-700">
      {label} <span className="text-gray-400">{isOptional ? `(${unit}، اختياري)` : `(${unit})`}</span>
    </label>
    <input
      type="number"
      id={label}
      step="0.1"
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
      required={!isOptional}
    />
  </div>
);


const AddMeasurementModal: React.FC<{
    onClose: () => void;
    onSave: (measurement: Omit<Measurement, 'date'>) => void;
}> = ({ onClose, onSave }) => {
    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [fatPercentage, setFatPercentage] = useState('');
    const [visceralFat, setVisceralFat] = useState('');
    const [bodyWater, setBodyWater] = useState('');
    const [proteinPercentage, setProteinPercentage] = useState('');
    const [bmr, setBmr] = useState('');
    const [muscleMass, setMuscleMass] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weightNum = parseFloat(weight);
        if (!weightNum || isNaN(weightNum)) {
          alert('الرجاء إدخال وزن صحيح.');
          return;
        }
        
        const measurementData: Omit<Measurement, 'date'> = {
            weight: weightNum,
            waist: waist ? parseFloat(waist) : undefined,
            fat_percentage: fatPercentage ? parseFloat(fatPercentage) : undefined,
            visceral_fat: visceralFat ? parseFloat(visceralFat) : undefined,
            body_water: bodyWater ? parseFloat(bodyWater) : undefined,
            protein_percentage: proteinPercentage ? parseFloat(proteinPercentage) : undefined,
            bmr: bmr ? parseFloat(bmr) : undefined,
            muscle_mass: muscleMass ? parseFloat(muscleMass) : undefined,
        };
        onSave(measurementData);
    };

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 animate-scale-in"
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">إضافة قياس جديد</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                           <MeasurementInput label="الوزن" unit="كجم" value={weight} onChange={e => setWeight(e.target.value)} isOptional={false} />
                           <MeasurementInput label="محيط البطن" unit="سم" value={waist} onChange={e => setWaist(e.target.value)} />
                           <MeasurementInput label="نسبة الدهون" unit="%" value={fatPercentage} onChange={e => setFatPercentage(e.target.value)} />
                           <MeasurementInput label="دهون حشوية" unit="" value={visceralFat} onChange={e => setVisceralFat(e.target.value)} />
                           <MeasurementInput label="الماء في الجسم" unit="%" value={bodyWater} onChange={e => setBodyWater(e.target.value)} />
                           <MeasurementInput label="نسبة البروتين" unit="%" value={proteinPercentage} onChange={e => setProteinPercentage(e.target.value)} />
                           <MeasurementInput label="معدل الحرق الأساسي" unit="BMR" value={bmr} onChange={e => setBmr(e.target.value)} />
                           <MeasurementInput label="العضلات" unit="كجم" value={muscleMass} onChange={e => setMuscleMass(e.target.value)} />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">حفظ القياس</button>
                    </div>
                </form>
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


export const MeasurementsPage: React.FC = () => {
  const { measurements, addMeasurement } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveMeasurement = (measurementData: Omit<Measurement, 'date'>) => {
      addMeasurement(measurementData);
      setIsModalOpen(false);
      setMessage('تم حفظ القياس بنجاح!');
      window.scrollTo(0,0);
      setTimeout(() => setMessage(''), 3000);
  };
  
  const lastMeasurement = useMemo(() => measurements.length > 0 ? measurements[0] : null, [measurements]);
  const previousMeasurement = useMemo(() => measurements.length > 1 ? measurements[1] : null, [measurements]);
  
  const weightDifference = useMemo(() => {
    if (lastMeasurement && previousMeasurement) {
      return lastMeasurement.weight - previousMeasurement.weight;
    }
    return 0;
  }, [lastMeasurement, previousMeasurement]);

  const chartData = useMemo(() => {
    if (measurements.length < 2) return [];

    const reversed = [...measurements].reverse();
    const first = reversed[0];
    const lastThree = reversed.slice(-3);

    const dataPoints = new Map<string, Measurement>();
    dataPoints.set(first.date, first);
    lastThree.forEach(m => dataPoints.set(m.date, m));

    return Array.from(dataPoints.values()).map(m => ({
        name: new Date(m.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        'الوزن (كجم)': m.weight,
    }));
  }, [measurements]);
  
  const renderDifference = (diff: number) => {
      const absDiff = Math.abs(diff).toFixed(1);
      if (diff < 0) {
          return <span className="text-green-300 font-bold">↓ {absDiff} كجم</span>;
      }
      if (diff > 0) {
          return <span className="text-red-300 font-bold">↑ {absDiff} كجم</span>;
      }
      return <span className="text-gray-300">لا تغيير</span>;
  };

  return (
    <>
      <div className="p-4 space-y-6 pb-24">
        <h1 className="text-3xl font-bold text-gray-800">الوزن والقياسات</h1>
        
        {message && <p className="text-center text-green-600 p-2 bg-green-100 rounded-md transition-all duration-300">{message}</p>}

        {lastMeasurement ? (
            <Card className="bg-gradient-to-br from-primary to-emerald-400 text-white shadow-lg">
                <p className="text-lg opacity-80">آخر قياس</p>
                <div className="flex justify-between items-baseline my-2">
                    <p className="text-5xl font-bold">{lastMeasurement.weight}<span className="text-2xl opacity-80">كجم</span></p>
                    {weightDifference !== 0 && renderDifference(weightDifference)}
                </div>
                <p className="text-xs opacity-70">{new Date(lastMeasurement.date).toLocaleString('ar-EG', {dateStyle: 'full', timeStyle: 'short'})}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/20 text-sm">
                   {lastMeasurement.waist && <p><strong>البطن:</strong> {lastMeasurement.waist} سم</p>}
                   {lastMeasurement.fat_percentage && <p><strong>الدهون:</strong> {lastMeasurement.fat_percentage}%</p>}
                   {lastMeasurement.muscle_mass && <p><strong>العضلات:</strong> {lastMeasurement.muscle_mass} كجم</p>}
                   {lastMeasurement.body_water && <p><strong>الماء:</strong> {lastMeasurement.body_water}%</p>}
                   {lastMeasurement.bmr && <p><strong>الحرق:</strong> {lastMeasurement.bmr}</p>}
                </div>
            </Card>
        ) : (
            <Card className="text-center">
                <h2 className="text-xl font-semibold">أهلاً بك!</h2>
                <p className="text-gray-600 mt-2">لا توجد قياسات مسجلة بعد. ابدأ رحلتك الآن بإضافة قياسك الأول.</p>
            </Card>
        )}

        {chartData.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold mb-4">منحنى التقدم</h2>
            <p className="text-sm text-gray-500 mb-4">نظرة سريعة على أول وزن لك مقارنة بآخر قياساتك.</p>
            <div style={{direction: 'ltr'}} className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']}/>
                    <Tooltip contentStyle={{direction: 'rtl'}} />
                    <Legend />
                    <Line type="monotone" dataKey="الوزن (كجم)" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} dot={{r: 5}} />
                  </LineChart>
                </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-20 right-0 left-0 p-4 z-10 flex justify-center">
         <button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition-all duration-300 text-lg shadow-lg active:scale-95 transform hover:scale-105"
         >
            ➕ إضافة قياس جديد
         </button>
      </div>

      {isModalOpen && (
          <AddMeasurementModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveMeasurement}
          />
      )}
    </>
  );
};
