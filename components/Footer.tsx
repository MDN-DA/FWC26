
import React from 'react';

export const Footer: React.FC = () => {
    // Liste élargie de 12 nations (13 drapeaux au total avec le Kashmir)
    const solidarityData = [
        { name: 'Sudan', urls: ['https://flagcdn.com/w40/sd.png'] },
        { name: 'Palestine', urls: ['https://flagcdn.com/w40/ps.png'] },
        { name: 'DR Congo', urls: ['https://flagcdn.com/w40/cd.png'] },
        { name: 'Yemen', urls: ['https://flagcdn.com/w40/ye.png'] },
        { name: 'Syria', urls: ['https://flagcdn.com/w40/sy.png'] },
        { name: 'Ethiopia', urls: ['https://flagcdn.com/w40/et.png'] },
        { name: 'Somalia', urls: ['https://flagcdn.com/w40/so.png'] },
        { 
            name: 'Kashmir', 
            urls: [
                'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Azad_Kashmir.svg',
                'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Jammu_and_Kashmir_(1952-2019).svg'
            ] 
        },
        { name: 'Afghanistan', urls: ['https://flagcdn.com/w40/af.png'] },
        { name: 'Rohingya', urls: ['https://upload.wikimedia.org/wikipedia/commons/8/83/Rohingya_flag.svg'] },
        { name: 'Uyghurs', urls: ['https://upload.wikimedia.org/wikipedia/commons/2/2c/Kokbayraq_flag.svg'] },
        { name: 'Chad', urls: ['https://flagcdn.com/w40/td.png'] }
    ];

    return (
        <div className="mt-12 pt-10 border-t border-gray-400 dark:border-dark-border text-sm pb-8">
            <div className="w-full max-w-6xl mx-auto p-5 bg-gray-50 dark:bg-dark-card/50 border-l-4 border-host-red text-gray-700 dark:text-gray-300 rounded-r-lg shadow-sm">
                <p className="font-bold text-center mb-6 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 px-2">
                    In solidarity with the people struggling for freedom 🕊️ and justice ⚖️✊.
                </p>
                
                <div className="flex flex-col items-center">
                    {/* 
                        Layout Logic:
                        - Mobile: Grid 6 columns x 2 rows (12 items)
                        - Desktop: Flex row single line
                    */}
                    <div className="grid grid-cols-6 md:flex md:flex-row md:flex-nowrap items-center justify-center gap-2.5 sm:gap-4 px-2 py-2">
                        {solidarityData.map((item) => (
                            <div key={item.name} className="flex items-center justify-center gap-0.5 transition-all duration-300 hover:scale-125 hover:-translate-y-1 cursor-help" title={item.name}>
                                {item.urls.map((url, i) => (
                                    <img 
                                        key={i}
                                        src={url} 
                                        alt={item.name} 
                                        className="h-4 w-6 sm:h-5 sm:w-8 object-cover rounded-[1px] shadow-sm border border-black/10 dark:border-white/20" 
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-8 pt-5 border-t border-gray-200 dark:border-dark-border/50 italic text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed max-w-3xl mx-auto px-4">
                    "Standing in firm solidarity with these nations and all oppressed people across the globe, united in the pursuit of freedom and justice for all." 🕊️
                </p>
            </div>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-2 text-host-blue dark:text-white">
                <div className="flex items-center flex-wrap justify-center gap-2 text-lg tracking-wide">
                    <span className="font-bold text-sm sm:text-lg">Crafted with ❤️ by</span>
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
                        <span className="font-black text-sm sm:text-lg">Gunners-Stats</span>
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
