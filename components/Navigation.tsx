
import React from 'react';

type Tab = 'fixtures' | 'playoffs' | 'groups' | 'bracket' | 'simulator';
type FixtureFilter = 'all' | 'group' | 'knockout';

interface NavButtonProps {
    id: Tab;
    label: string;
    icon: React.ReactElement<any>;
    activeColorClass: string;
    iconBgClass: string;
    activeTab: Tab;
    setActiveTab: (id: Tab) => void;
}

export const NavButton: React.FC<NavButtonProps> = ({ id, label, icon, activeColorClass, iconBgClass, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;
    return (
        <button 
            onClick={() => setActiveTab(id)}
            className={`
                group flex flex-col items-center justify-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-300 w-full h-24 sm:h-40 max-w-[160px] mx-auto
                ${isActive 
                    ? `bg-opacity-30 dark:bg-opacity-10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.05] border-[2px] z-10 ${activeColorClass}` 
                    : 'bg-white/60 dark:bg-dark-card/60 backdrop-blur-md border border-white/40 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-dark-card/80'
                }
            `}
        >
            <div className={`
                w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 ease-out
                ${isActive ? 'scale-110 rotate-3 shadow-lg' : 'grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:rotate-0'}
                ${iconBgClass}
            `}>
                {React.cloneElement(icon, { className: "w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow-md" })}
            </div>

            <div className="flex flex-col items-center">
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                    {label}
                </span>
                <div className={`h-0.5 rounded-full mt-1 transition-all duration-300 ${isActive ? 'w-full bg-gray-900 dark:bg-white' : 'w-0 group-hover:w-1/2 bg-gray-300'}`}></div>
            </div>
        </button>
    );
};

export const FilterButton: React.FC<{ filter: FixtureFilter, label: string, currentFilter: FixtureFilter, setFilter: (f: FixtureFilter) => void }> = ({ filter, label, currentFilter, setFilter }) => (
    <button
        onClick={() => setFilter(filter)}
        className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
            currentFilter === filter
            ? 'bg-host-blue text-white border-host-blue shadow-md'
            : 'bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5'
        }`}
    >
        {label}
    </button>
);
