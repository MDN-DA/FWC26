
import React, { useEffect, useState } from 'react';
import { competitionLogos } from '../constants';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // Start fading out after 2 seconds
        const timer1 = setTimeout(() => {
            setOpacity(0);
        }, 2000);

        // Remove from DOM after transition
        const timer2 = setTimeout(() => {
            setIsVisible(false);
            onFinish();
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-host-green via-host-red to-host-blue transition-opacity duration-500 ease-out text-white px-4"
            style={{ opacity: opacity }}
        >
            <div className="animate-bounce mb-8">
                <img 
                    src={competitionLogos["World Cup"]} 
                    alt="FIFA World Cup 26" 
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-md"
                />
            </div>
            <div className="flex gap-3">
                 <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                 <div className="h-3 w-3 rounded-full bg-white/80 animate-pulse delay-75"></div>
                 <div className="h-3 w-3 rounded-full bg-white/60 animate-pulse delay-150"></div>
            </div>
            <h1 className="mt-8 text-lg sm:text-xl font-black tracking-widest uppercase text-white drop-shadow-md text-center leading-relaxed">
                Unofficial Tracker <br className="block sm:hidden" /> <span className="hidden sm:inline">• </span> by Gunners-Stats
            </h1>
        </div>
    );
};
