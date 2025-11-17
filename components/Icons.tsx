import React from 'react';

export const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const GiftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 00-2-2h- vedit.com -2a2 2 0 00-2 2v2m0 13h4m-4 0H6a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2v13zm10 0V8a2 2 0 00-2-2h-2a2 2 0 00-2 2v13m0 0h4m-4 0h-4" />
    </svg>
);

export const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056 12.02 12.02 0 009-2.056c0-1.857-.358-3.63-1-5.252" />
    </svg>
);

export const DocumentTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l.643-.643a1 1 0 00-1.414-1.414l-.644.644a1 1 0 00-.223.447A4.987 4.987 0 008 6c0 .934.236 1.807.654 2.591l-2.438 2.438c-.39.39-.39 1.022 0 1.414a1 1 0 001.414 0l2.438-2.438a4.987 4.987 0 006.128-.016 1 1 0 10-1.39-1.432 2.987 2.987 0 01-4.04-4.283A1 1 0 0012.395 2.553zM8.346 14.849a1 1 0 00-1.414 0l-2.438 2.438a1 1 0 000 1.414 1 1 0 001.414 0l2.438-2.438a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

export const WaterDropIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-8 w-8 ${className}`}>
        <path fillRule="evenodd" d="M12.54 22.223a23.953 23.953 0 0 1-3.693-5.032c-.52-1.022-.996-2.073-1.42-3.152a26.108 26.108 0 0 1-1.42-3.152c-.227-.521-.43-1.05-.6-1.592C5.23 8.78 5.25 7.85 5.62 7.003c.368-.848.96-1.572 1.703-2.126C8.062 4.322 9.043 4 10.125 4a6.76 6.76 0 0 1 4.34 1.586c.928.72 1.636 1.705 2.074 2.827.438 1.122.438 2.333 0 3.455a26.108 26.108 0 0 1-1.42 3.152c-.424 1.08-.899 2.13-1.42 3.152a23.953 23.953 0 0 1-3.693 5.032Z" clipRule="evenodd" />
    </svg>
);

export const NoCarbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="21" x2="21" y2="3"></line>
        <path d="M16 8c-2 0-3 1-3 3v5" />
        <path d="M13 16c0 1.5.5 3 3 3s3-1.5 3-3v-5c0-2-1-3-3-3" />
        <path d="M4 11c0 1.5.5 3 3 3s3-1.5 3-3V6c0-2-1-3-3-3S4 4 4 6v5Z" />
    </svg>
);

export const HealthyMealIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
        <path d="M7 2v20" />
        <path d="M15 15v6" />
        <path d="M15 3v5c0 1.1.9 2 2 2h.5a2.5 2.5 0 010 5h-.5a2 2 0 01-2 2v-6c0-1.1-.9-2-2-2h-1" />
    </svg>
);

export const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export const ExerciseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 9h4v6H2z" />
        <path d="M18 9h4v6h-4z" />
        <path d="M7 11h10v2H7z" />
    </svg>
);

export const PillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 000-18 9 9 0 000 18z" />
        <path d="M12 3v18" />
    </svg>
);

export const BreakfastIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 5h.01" />
        <path d="M12 5h.01" />
        <path d="M7 5h.01" />
        <path d="M12 12a5 5 0 01-5-5h10a5 5 0 01-5 5z" />
        <path d="M8 12v8a4 4 0 004 4h0a4 4 0 004-4v-8" />
        <path d="M16 12a4 4 0 11-8 0" />
    </svg>
);

export const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

export const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const ShieldExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06l-2.475 2.475a.75.75 0 11-1.06-1.06l2.475-2.475a.75.75 0 011.06 0zm9.192 0a.75.75 0 011.06 0l2.475 2.475a.75.75 0 11-1.06 1.06l-2.475-2.475a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 012 10zm14.25.75a.75.75 0 000-1.5h-3.5a.75.75 0 000 1.5h3.5zM6.464 13.536a.75.75 0 01-1.06 0l-2.475-2.475a.75.75 0 011.06-1.06l2.475 2.475a.75.75 0 010 1.06zm7.072 0a.75.75 0 011.06 0l2.475 2.475a.75.75 0 01-1.06 1.06l-2.475-2.475a.75.75 0 010-1.06zM10 18a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 18z" clipRule="evenodd" />
    </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.586a2 2 0 001.414-.586l.707-.707A2 2 0 017.414 4h5.172a2 2 0 011.414.586l.707.707A2 2 0 0015.414 6H16a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm5 3a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
    </svg>
);

export const BrainIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a2.5 2.5 0 013.11 4.43c.27.27.49.57.66.89a2.5 2.5 0 01-1.38 4.02c-.53.15-1.07.22-1.62.22a2.5 2.5 0 01-1.38-4.02c.17-.32.39-.62.66-.89A2.5 2.5 0 0110 3.5z" />
        <path d="M6.89 7.93a2.5 2.5 0 01-3.11-4.43C3.51 3.77 3.29 4.07 3.12 4.39a2.5 2.5 0 011.38 4.02c.53.15 1.07.22 1.62.22a2.5 2.5 0 011.38-4.02c-.17-.32-.39-.62-.66-.89z" />
        <path d="M10 16.5a2.5 2.5 0 01-3.11-4.43c-.27-.27-.49-.57-.66-.89a2.5 2.5 0 011.38-4.02c.53-.15 1.07-.22 1.62-.22a2.5 2.5 0 011.38 4.02c-.17.32-.39.62-.66.89A2.5 2.5 0 0110 16.5z" />
        <path d="M13.11 7.93a2.5 2.5 0 013.11-4.43c.27.27.49.57.66.89a2.5 2.5 0 01-1.38 4.02c-.53.15-1.07.22-1.62.22a2.5 2.5 0 01-1.38-4.02c.17-.32.39-.62.66-.89z" />
    </svg>
);