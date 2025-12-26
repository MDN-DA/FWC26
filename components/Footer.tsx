
import React from 'react';

export const Footer: React.FC = () => {
    const solidarityData = [
        // Group 1 (Africa)
        { name: 'Sudan', url: 'https://flagcdn.com/w40/sd.png', group: 1 },
        { name: 'DR Congo', url: 'https://flagcdn.com/w40/cd.png', group: 1 },
        { name: 'Ethiopia', url: 'https://flagcdn.com/w40/et.png', group: 1 },
        // Group 2 (Asia)
        { name: 'Palestine', url: 'https://flagcdn.com/w40/ps.png', group: 2 },
        { name: 'Yemen', url: 'https://flagcdn.com/w40/ye.png', group: 2 },
        { name: 'Kashmir', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Azad_Kashmir.svg', group: 2 },
        { name: 'Rohingya', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Rohingya_flag.svg/330px-Rohingya_flag.svg.png', group: 2 },
        { name: 'Uyghurs', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kokbayraq_flag.svg/330px-Kokbayraq_flag.svg.png', group: 2 }
    ];

    const allItems = solidarityData;

    return (
        <div className="mt-12 pt-10 border-t border-gray-400 dark:border-dark-border text-sm pb-8">
            <div className="w-full max-w-5xl mx-auto p-6 bg-gray-50 dark:bg-dark-card/50 border-l-4 border-host-red text-gray-700 dark:text-gray-300 rounded-r-lg shadow-sm">
                <p className="font-bold text-center mb-6 text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    In solidarity with the people struggling for freedom 🕊️ and justice ⚖️✊.
                </p>
                
                <div className="flex flex-col items-center">
                    {/* 
                        Responsive Logic: 
                        - Mobile: Grid of 4 columns (2 rows for 8 items)
                        - Tablet/PC: Flex row (1 line)
                    */}
                    <div className="grid grid-cols-4 md:flex md:flex-row md:items-center justify-center gap-x-3 sm:gap-x-6 gap-y-5 md:gap-y-0 w-full">
                        {allItems.map((item, index) => (
                            <React.Fragment key={item.name}>
                                {/* Subtle Separator for Desktop only between Groups */}
                                {index === 3 && (
                                    <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-white/10 mx-2"></div>
                                )}
                                <div className="flex flex-col md:flex-row items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-110 group cursor-default">
                                    <img 
                                        src={item.url} 
                                        alt={`${item.name} flag`} 
                                        className="h-5 w-8 object-cover rounded-[1px] shadow-md border border-black/5 dark:border-white/10" 
                                    />
                                    <span className="font-black text-[9px] sm:text-[10px] group-hover:text-host-red transition-colors whitespace-nowrap text-center">
                                        {item.name}
                                    </span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <p className="mt-8 pt-5 border-t border-gray-200 dark:border-dark-border/50 italic text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed max-w-3xl mx-auto px-4">
                    "Standing in firm solidarity with these nations and all oppressed people across the globe, united in the pursuit of freedom and justice for all." 🕊️
                </p>
            </div>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-host-blue dark:text-white">
                <div className="flex items-center flex-wrap justify-center gap-2 text-lg tracking-wide">
                    <span className="font-bold">Crafted with ❤️ by</span>
                    <a 
                        href="https://gunners-stats.pages.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-arsenal-red hover:underline decoration-arsenal-red underline-offset-4 transition-all group"
                    >
                        <img 
                            src="https://i.postimg.cc/HLK52Xr6/Gunners-Stats.png" 
                            alt="Gunners-Stats Logo" 
                            className="h-7 w-auto object-contain group-hover:scale-110 transition-transform" 
                        />
                        <span className="font-black">Gunners-Stats</span>
                    </a>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border/50 text-center text-gray-500 dark:text-gray-400">
                <h4 className="font-bold text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-[0.2em]">Install as a Progressive Web App (PWA)</h4>
                <p className="text-[10px] max-w-md mx-auto opacity-70 px-4">
                    For the best experience, add this app to your home screen via your browser's menu to track the World Cup 2026 anywhere.
                </p>
            </div>
        </div>
    );
};
