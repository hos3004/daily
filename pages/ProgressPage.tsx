
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/Card';

export const ProgressPage: React.FC = () => {
    const { dailyLogs, measurements, points } = useData();

    const committedDaysThisMonth = dailyLogs.filter(log => {
        const logDate = new Date(log.date);
        const today = new Date();
        return logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear();
    }).length;

    let totalWeightLoss = 0;
    if (measurements.length > 1) {
        const firstWeight = measurements[0].weight;
        const lastWeight = measurements[measurements.length - 1].weight;
        totalWeightLoss = firstWeight - lastWeight;
    }
    
    let totalWaistLoss = 0;
    const waistMeasurements = measurements.filter(m => m.waist);
    if (waistMeasurements.length > 1) {
        const firstWaist = waistMeasurements[0].waist!;
        const lastWaist = waistMeasurements[waistMeasurements.length - 1].waist!;
        totalWaistLoss = firstWaist - lastWaist;
    }

    const StatCard: React.FC<{title: string, value: string | number, unit: string}> = ({title, value, unit}) => (
        <Card className="text-center">
            <p className="text-gray-500">{title}</p>
            <p className="text-3xl font-bold my-1">{value}</p>
            <p className="text-gray-500">{unit}</p>
        </Card>
    );

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">لوحة التقدم</h1>
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="أيام الالتزام" value={points.streak_days} unit="أيام متتالية 🔥"/>
                <StatCard title="التزام هذا الشهر" value={committedDaysThisMonth} unit="يوم"/>
                <StatCard title="نزول الوزن الكلي" value={totalWeightLoss.toFixed(1)} unit="كجم 📉"/>
                <StatCard title="نزول محيط البطن" value={totalWaistLoss.toFixed(1)} unit="سم 📏"/>
                <StatCard title="مجموع النقاط" value={points.lifetime_points} unit="نقطة"/>
                <StatCard title="إجمالي الأيام المسجلة" value={dailyLogs.length} unit="يوم"/>
            </div>
        </div>
    );
};
