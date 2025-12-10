
import React from 'react';

type Tab = 'fixtures' | 'playoffs' | 'groups' | 'bracket' | 'simulator';

interface BottomNavProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems: { id: Tab; label: string; icon: React.ReactElement }[] = [
        {
            id: 'fixtures',
            label: 'Matches',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        },
        {
            id: 'playoffs',
            label: 'Play-offs',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        },
        {
            id: 'groups',
            label: 'Groups',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        },
        {
            id: 'bracket',
            label: 'Bracket',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        },
        {
            id: 'simulator',
            label: 'Predict',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-[9999] bg-white/90 dark:bg-dark-card/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)] transform translate-z-0">
            <div className="flex justify-around items-center w-full mx-auto h-[70px] px-2 md:px-12">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="relative group flex flex-col items-center justify-center w-full h-full"
                        >
                            <div className={`transition-all duration-300 ease-out flex flex-col items-center gap-1 ${isActive ? '-translate-y-1' : ''}`}>
                                <div className={`p-1.5 rounded-2xl transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-host-blue text-white shadow-lg shadow-blue-900/20' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-white/10 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                }`}>
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { 
                                        className: `w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}` 
                                    })}
                                </div>
                                <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight transition-colors duration-300 ${
                                    isActive ? 'text-host-blue dark:text-white' : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-host-blue dark:bg-white animate-fadeIn"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
