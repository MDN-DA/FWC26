
import React from 'react';

export const Footer: React.FC = () => {
    const solidarityLinks = [
        { name: 'Palestine', url: 'https://flagcdn.com/w40/ps.png' },
        { name: 'Sudan', url: 'https://flagcdn.com/w40/sd.png' },
        { name: 'DR Congo', url: 'https://flagcdn.com/w40/cd.png' },
        { name: 'Yemen', url: 'https://flagcdn.com/w40/ye.png' },
        { name: 'Kashmir', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Azad_Kashmir.svg' },
        { name: 'Ethiopia', url: 'https://flagcdn.com/w40/et.png' }
    ];

    return (
        <div className="mt-12 pt-10 border-t border-gray-400 dark:border-dark-border text-sm pb-8">
            <div className="w-full p-4 bg-gray-50 dark:bg-dark-card/50 border-l-4 border-host-red text-gray-700 dark:text-gray-300 rounded-r-lg">
                <p className="font-semibold text-center mb-4">
                    In solidarity with the people of Palestine, Sudan, DR Congo, Yemen, Kashmir, and Ethiopia in their struggle for freedom 🕊️ and justice ⚖️✊.
                </p>
                <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-3">
                    {solidarityLinks.map(item => (
                        <div key={item.name} className="flex items-center gap-2 transition-transform hover:scale-110">
                            <img src={item.url} alt={`${item.name} flag`} className="h-5 w-auto object-contain rounded-sm shadow-md" />
                            <span className="font-semibold">{item.name}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-4 pt-2 border-t border-gray-200 dark:border-dark-border/50 italic text-gray-500 dark:text-gray-400 text-center">
                    For a world where this struggle leads to a just and lasting peace for all. 🕊️
                </p>
            </div>
            
            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-host-blue dark:text-white">
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
                            className="h-6 w-auto object-contain group-hover:scale-110 transition-transform" 
                        />
                        <span className="font-black">Gunners-Stats</span>
                    </a>
                </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-dark-border/50 text-center text-gray-500 dark:text-gray-400">
                <h4 className="font-bold text-base text-gray-600 dark:text-gray-300 mb-2">Install as a Progressive Web App (PWA)</h4>
                <p className="text-xs max-w-md mx-auto">
                    For the best experience, add this app to your home screen.
                    <br />
                    <strong>On Mobile:</strong> Use your browser's "Add to Home Screen" option.
                    <br />
                    <strong>On Desktop:</strong> Click the install icon in the address bar.
                </p>
            </div>
        </div>
    );
};
