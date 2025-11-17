
import React, { useState } from 'react';
import { Page } from './types';
import { DataProvider } from './contexts/DataContext';
import { BottomNav } from './components/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { HabitsPage } from './pages/HabitsPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { RewardsPage } from './pages/RewardsPage';
import { ProgressPage } from './pages/ProgressPage';
import { InfoPage } from './pages/InfoPage';
import { ResetPage } from './pages/ResetPage';
import { MealsPage } from './pages/MealsPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <DashboardPage setPage={setActivePage} />;
      case Page.Habits:
        return <HabitsPage />;
      case Page.Measurements:
        return <MeasurementsPage />;
      case Page.Rewards:
        return <RewardsPage />;
      case Page.Progress:
         return <ProgressPage />;
      case Page.Info:
        return <InfoPage />;
      case Page.Reset:
        return <ResetPage setPage={setActivePage} />;
      case Page.Meals:
        return <MealsPage />;
      default:
        return <DashboardPage setPage={setActivePage} />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        <main key={activePage} className="pb-20 page-fade-in">
          {renderPage()}
        </main>
        <BottomNav activePage={activePage} setPage={setActivePage} />
      </div>
    </DataProvider>
  );
};

export default App;