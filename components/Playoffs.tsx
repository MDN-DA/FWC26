
import React, { useState, useEffect } from 'react';
import { PlayoffMatch, PlayoffPath } from '../data/playoffs';
import { getFlagCode, countryMapping, CITY_TIMEZONES } from '../constants';

interface PlayoffsProps {
    uefa: PlayoffPath[];
    inter: PlayoffPath[];
    winners?: Record<string, string>;
    useLocalTime: boolean;
    liveScores?: Record<string, { scoreStr: string, status: string, minute?: string, winner?: string }>;
}

const VenueFlag: React.FC<{ city: string }> = ({ city }) => {
    const cities = city.split('/').map(c => c.trim());
    const cityToFlag: Record<string, string> = {
        "Cardiff": "gb-wls", "Zenica": "ba", "Bergamo": "it", "Warsaw": "pl",
        "Solna": "se", "Valencia": "es", "Bratislava": "sk", "Pristina": "xk",
        "Istanbul": "tr", "Praha": "cz", "Dublin": "ie", "Copenhagen": "dk",
        "Guadalajara": "mx", "Monterrey": "mx"
    };
    return (
        <div className="flex items-center gap-1.5">
            {cities.map((c, i) => {
                const code = cityToFlag[c];
                if (!code) return null;
                return (
                    <img key={i} src={`https://flagcdn.com/w40/${code}.png`} className="w-4 h-2.5 rounded-[1px] shadow-sm object-cover border border-white/20" alt={c} title={c} />
                );
            })}
        </div>
    );
};

const PlayoffFixtureCard: React.FC<{ 
    match: PlayoffMatch; 
    pathWinner?: string; 
    useLocalTime: boolean; 
    resolvedFinalVenue?: string; 
    liveData?: { scoreStr: string; status: string; minute?: string }; 
}> = ({ match, pathWinner, useLocalTime, resolvedFinalVenue, liveData }) => {
    const [mode, setMode] = useState<'time' | 'countdown'>('time');
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    const flag1 = getFlagCode(match.team1.name);
    const flag2 = getFlagCode(match.team2.name);
    const currentVenue = resolvedFinalVenue || match.venue || '';
    const isMatchLive = liveData?.status === "STATUS_IN_PROGRESS";
    const isMatchFinal = liveData?.status === "STATUS_FINAL";

    const getTargetTime = () => {
        if (!match.time) return 0;
        const cleanCity = currentVenue.split('/')[0].trim();
        const offset = CITY_TIMEZONES[cleanCity] ?? 0;
        const [day, monthStr] = match.date.split(' ');
        const monthMap: Record<string, number> = { 'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11 };
        const month = monthMap[monthStr] || 2;
        const [hours, minutes] = match.time.split(':').map(Number);
        return new Date(Date.UTC(2026, month, parseInt(day), hours - offset, minutes)).getTime();
    };

    useEffect(() => {
        const target = getTargetTime();
        const update = () => {
            const distance = target - new Date().getTime();
            if (distance <= 0) {
                setTimeLeft(null);
                setMode('time');
            } else {
                setTimeLeft({
                    d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        };
        const timer = setInterval(update, 1000);
        update();
        return () => clearInterval(timer);
    }, [match.date, match.time, currentVenue]);

    useEffect(() => {
        if (isMatchLive || isMatchFinal) return;
        const flipInterval = setInterval(() => {
            setMode(prev => prev === 'time' ? 'countdown' : 'time');
        }, 5000);
        return () => clearInterval(flipInterval);
    }, [isMatchLive, isMatchFinal]);

    const { displayDate, displayTime } = (() => {
        if (!match.time) return { displayDate: match.date, displayTime: 'TBD' };
        const target = getTargetTime();
        const dateObj = new Date(target);
        if (!useLocalTime) return { displayDate: match.date.substring(0, 6), displayTime: match.time };
        return { 
            displayDate: `${dateObj.getDate().toString().padStart(2,'0')}/${(dateObj.getMonth()+1).toString().padStart(2,'0')}`, 
            displayTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
        };
    })();

    return (
        <div className={`relative bg-white dark:bg-dark-card border rounded-2xl p-4 shadow-sm transition-all duration-300 overflow-hidden ${match.isFinal ? 'border-yellow-400 ring-1 ring-yellow-400/10' : 'border-gray-100 dark:border-white/5'}`}>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-white/5 pb-2 mb-4">
                <span className="text-gray-400 font-mono">{displayDate}</span>
                <div className="flex items-center gap-1.5">
                    {isMatchLive && <div className="bg-red-600 text-white px-2 py-0.5 rounded text-[8px] font-bold animate-pulse">LIVE</div>}
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${match.isFinal ? 'bg-yellow-400 text-white' : 'bg-gray-800 text-white'}`}>
                        {match.isFinal ? 'FINAL' : 'SF'}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex flex-col items-center w-[30%] text-center gap-2">
                    {flag1 ? <img src={`https://flagcdn.com/w80/${flag1}.png`} alt="" className="w-10 h-7.5 object-cover rounded shadow-sm border border-gray-100 dark:border-white/10" /> : <div className="w-10 h-7.5 bg-gray-200 dark:bg-white/10 rounded flex items-center justify-center text-[8px]">?</div>}
                    <span className={`text-[10px] font-bold uppercase tracking-tight truncate w-full ${pathWinner === match.team1.name ? 'text-host-blue dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{countryMapping[match.team1.name] || match.team1.name}</span>
                </div>
                <div className="flex flex-col items-center justify-center w-[40%] h-12 relative overflow-hidden">
                    <div className={`absolute transition-all duration-700 flex flex-col items-center ${(mode === 'time' || isMatchLive || isMatchFinal) ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                        <span className={`text-xl font-black font-mono tracking-tighter ${isMatchLive ? 'text-red-600' : 'text-host-red dark:text-red-400'}`}>
                            {(isMatchLive || isMatchFinal) ? liveData?.scoreStr : displayTime}
                        </span>
                        <span className="text-[9px] font-black text-gray-300 italic -mt-1 uppercase">VS</span>
                    </div>
                    {!isMatchLive && !isMatchFinal && timeLeft && (
                        <div className={`absolute transition-all duration-700 flex flex-col items-center ${mode === 'countdown' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                            <div className="flex gap-1 font-mono text-gray-900 dark:text-white items-baseline">
                                {timeLeft.d > 0 && <span className="text-base font-black leading-none">{timeLeft.d}d</span>}
                                <span className="text-base font-black leading-none">{timeLeft.h.toString().padStart(2,'0')}h</span>
                                <span className="text-base font-black leading-none">{timeLeft.m.toString().padStart(2,'0')}m</span>
                                <span className="text-base font-black leading-none text-host-red">{timeLeft.s.toString().padStart(2,'0')}s</span>
                            </div>
                            <span className="text-[7px] font-black text-host-red uppercase tracking-widest mt-0.5 animate-pulse">Remaining</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center w-[30%] text-center gap-2">
                    {flag2 ? <img src={`https://flagcdn.com/w80/${flag2}.png`} alt="" className="w-10 h-7.5 object-cover rounded shadow-sm border border-gray-100 dark:border-white/10" /> : <div className="w-10 h-7.5 bg-gray-200 dark:bg-white/10 rounded flex items-center justify-center text-[8px]">?</div>}
                    <span className={`text-[10px] font-bold uppercase tracking-tight truncate w-full ${pathWinner === match.team2.name ? 'text-host-blue dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{countryMapping[match.team2.name] || match.team2.name}</span>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-2">
                <VenueFlag city={currentVenue} />
                <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest">{currentVenue}</span>
            </div>
        </div>
    );
};

export const Playoffs: React.FC<PlayoffsProps> = ({ uefa, inter, winners = {}, useLocalTime, liveScores = {} }) => {
    const resolveFinalCity = (path: PlayoffPath) => {
        const venue = path.matches.final.venue;
        if (!venue || !venue.includes('/')) return venue;
        const sf1 = path.matches.semis[0];
        const resSF1 = liveScores[`${sf1.team1.name}|${sf1.team2.name}`] || liveScores[`${sf1.team2.name}|${sf1.team1.name}`];
        const cities = venue.split('/').map(c => c.trim());
        if (resSF1 && resSF1.winner) return resSF1.winner === sf1.team1.name ? cities[0] : cities[1];
        return venue;
    };

    return (
        <div className="space-y-12 animate-fadeIn max-w-[1400px] mx-auto pb-10">
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-host-blue flex items-center justify-center text-white shadow-lg font-black italic text-xl">P</div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Qualifiers Dashboard</h3>
                        <p className="text-xs text-gray-500 font-medium tracking-tight uppercase tracking-widest">Real-time playoff results & Venue Automation</p>
                    </div>
                </div>
            </div>
            <section className="space-y-8">
                <div className="flex items-center gap-4"><h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">UEFA Paths</h2><div className="flex-1 h-px bg-gray-200 dark:bg-white/5"></div></div>
                {uefa.map(path => (
                    <div key={path.name} className="space-y-4">
                        <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg bg-host-blue flex items-center justify-center text-white font-black text-[10px]">{path.name.slice(-1)}</div><h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{path.name}</h4></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {path.matches.semis.map((m, i) => (<PlayoffFixtureCard key={i} match={m} useLocalTime={useLocalTime} liveData={liveScores[`${m.team1.name}|${m.team2.name}`] || liveScores[`${m.team2.name}|${m.team1.name}`]} />))}
                            <PlayoffFixtureCard match={path.matches.final} pathWinner={winners[`${path.name} [UEFA]`]} useLocalTime={useLocalTime} resolvedFinalVenue={resolveFinalCity(path)} liveData={liveScores[`${path.matches.final.team1.name}|${path.matches.final.team2.name}`] || liveScores[`${path.matches.final.team2.name}|${path.matches.final.team1.name}`]} />
                        </div>
                    </div>
                ))}
            </section>
            <section className="space-y-8">
                <div className="flex items-center gap-4"><h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Intercontinental Pathways</h2><div className="flex-1 h-px bg-gray-200 dark:bg-white/5"></div></div>
                {inter.map(path => (
                    <div key={path.name} className="space-y-4">
                        <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg bg-host-red flex items-center justify-center text-white font-black text-[10px]">{path.name.slice(-1)}</div><h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{path.name}</h4></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {path.matches.semis.map((m, i) => (<PlayoffFixtureCard key={i} match={m} useLocalTime={useLocalTime} liveData={liveScores[`${m.team1.name}|${m.team2.name}`] || liveScores[`${m.team2.name}|${m.team1.name}`]} />))}
                            <PlayoffFixtureCard match={path.matches.final} pathWinner={winners[path.name]} useLocalTime={useLocalTime} resolvedFinalVenue={path.matches.final.venue} liveData={liveScores[`${path.matches.final.team1.name}|${path.matches.final.team2.name}`] || liveScores[`${path.matches.final.team2.name}|${path.matches.final.team1.name}`]} />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
