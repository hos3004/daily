import React from 'react';
import { Page } from '../types';
import { HomeIcon, ChartBarIcon, GiftIcon, DocumentTextIcon, ClipboardListIcon } from './Icons';

interface BottomNavProps {
  activePage: Page;
  setPage: (page: Page) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, setPage }) => {
  const navItems = [
    { page: Page.Dashboard, label: 'الرئيسية', icon: <HomeIcon /> },
    { page: Page.Meals, label: 'الوجبات', icon: <ClipboardListIcon /> },
    { page: Page.Measurements, label: 'القياسات', icon: <ChartBarIcon /> },
    { page: Page.Rewards, label: 'المكافآت', icon: <GiftIcon /> },
    { page: Page.Info, label: 'معلومات', icon: <DocumentTextIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 right-0 left-0 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setPage(item.page)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm ${
              activePage === item.page ? 'text-primary' : 'text-gray-500'
            }`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
