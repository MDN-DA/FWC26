
import React, { useEffect, useState } from 'react';
import { competitionLogos } from '../constants';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // Start fading out after 2.5 seconds
        const timer1 = setTimeout(() => {
            setOpacity(0);
        }, 2500);

        // Remove from DOM after transition
        const timer2 = setTimeout(() => {
            setIsVisible(false);
            onFinish();
        }, 3200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex flex-col items-center p-8 text-slate-900 transition-opacity duration-700 ease-out overflow-hidden bg-gradient-to-br from-[#d1fae5] via-[#dbeafe] to-[#fee2e2]"
            style={{ opacity: opacity }}
        >
            {/* Background Texture Watermark - Centered - Darker blend for light bg */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none overflow-hidden select-none">
                <img 
                    src={competitionLogos["World Cup"]} 
                    className="w-[110%] h-auto object-cover scale-125 grayscale mix-blend-multiply rotate-6" 
                    alt="Background Watermark"
                />
            </div>

            {/* Main Content - Pushed down */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 animate-fadeIn pt-24 sm:pt-32">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                        {/* Typography */}
                        <h1 className="font-display text-3xl sm:text-6xl font-black tracking-tighter uppercase drop-shadow-sm leading-none text-slate-900">
                            FIFA
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-x-3 sm:gap-x-5 leading-none">
                            <h1 className="font-display text-4xl sm:text-7xl font-black tracking-tighter uppercase text-[#006847] drop-shadow-sm">
                                World
                            </h1>
                            <h1 className="font-display text-4xl sm:text-7xl font-black tracking-tighter uppercase text-[#CE1126] drop-shadow-sm">
                                Cup
                            </h1>
                        </div>
                         <h1 className="font-display text-4xl sm:text-7xl font-black tracking-tighter uppercase text-[#002868] drop-shadow-sm leading-none">
                            2026
                        </h1>
                    </div>
                </div>
            </div>
            
            {/* Loading Indicator */}
            <div className="relative z-10 mb-12 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[4px] border-slate-200 border-t-[#002868] rounded-full animate-spin"></div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] animate-pulse">Initializing...</p>
            </div>

            <p className="relative z-10 text-[10px] sm:text-xs text-slate-400 mt-auto pb-6 font-medium uppercase tracking-wide">
                Unofficial Tracker • Gunners-Stats
            </p>
        </div>
    );
};
