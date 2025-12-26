
import React, { useState, useEffect } from 'react';
import { Fixture, UCLGroup } from '../types';
import { CITY_TIMEZONES, getFlagCode, countryMapping, GROUPS } from '../constants';
import { wcFixtures } from '../data/fixtures';
import { resolveTeamName } from '../utils/standingsUtils';
import { R32Pairings } from '../data/combinations';

interface CountdownProps {
    groups?: UCLGroup[];
    liveScores?: Record<number, any>;
    pairings?: R32Pairings | null;
    onMatchClick?: (matchId: number) => void;
    activeTab?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({ groups, liveScores, pairings, onMatchClick, activeTab }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [nextMatches, setNextMatches] = useState<Fixture[]>([]);
  const [statusText, setStatusText] = useState("Countdown to Kickoff");
  
  // Logic to determine active teams for the background
  const [backgroundFlags, setBackgroundFlags] = useState<string[]>([]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      
      // 1. Filter matches that haven't started yet (or are just about to)
      const futureMatches = wcFixtures.filter(f => {
          const offset = CITY_TIMEZONES[f.city] ?? -5;
          const [day, month, year] = f.date.split('/').map(Number);
          const [hours, minutes] = f.time.split(':').map(Number);
          const utcHour = hours - offset;
          const matchDate = new Date(Date.UTC(2000 + year, month - 1, day, utcHour, minutes));
          
          return matchDate.getTime() > now;
      }).sort((a, b) => {
          const getMs = (f: Fixture) => {
              const offset = CITY_TIMEZONES[f.city] ?? -5;
              const [day, month, year] = f.date.split('/').map(Number);
              const [hours, minutes] = f.time.split(':').map(Number);
              return new Date(Date.UTC(2000 + year, month - 1, day, hours - offset, minutes)).getTime();
          };
          return getMs(a) - getMs(b);
      });

      if (futureMatches.length === 0) {
          setStatusText("Tournament Concluded");
          setNextMatches([]);
          return;
      }

      const firstMatch = futureMatches[0];
      
      // 2. Find ALL matches starting at this same time (Simultaneous Kickoffs)
      const getMatchTimeMs = (f: Fixture) => {
          const offset = CITY_TIMEZONES[f.city] ?? -5;
          const [day, month, year] = f.date.split('/').map(Number);
          const [hours, minutes] = f.time.split(':').map(Number);
          return new Date(Date.UTC(2000 + year, month - 1, day, hours - offset, minutes)).getTime();
      };

      const firstMatchTime = getMatchTimeMs(firstMatch);
      const simultaneous = futureMatches.filter(f => getMatchTimeMs(f) === firstMatchTime);
      
      setNextMatches(simultaneous);

      // 3. Calc Time Left
      const distance = firstMatchTime - now;

      if (distance < 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setStatusText("LIVE NOW");
      } else {
          // LOGIQUE CONTEXTUELLE DYNAMIQUE (DEMANDE UTILISATEUR)
          let context = "";
          if (firstMatch.matchNumber === 1) {
              context = "Opening Match";
          } else if (firstMatch.round === "Group Stage") {
              let grpName = "?";
              for (const [letter, teams] of Object.entries(GROUPS)) {
                  if (teams.includes(firstMatch.homeTeam) || firstMatch.homeTeam.includes(letter)) {
                      grpName = letter;
                      break;
                  }
              }
              context = `Group ${grpName}`;
          } else {
              context = firstMatch.round;
          }

          if (simultaneous.length > 1) {
              setStatusText(`Simultaneous Kickoff (${context.toUpperCase()})`);
          } else {
              setStatusText(context.toUpperCase());
          }

          const totalSeconds = Math.floor(distance / 1000);
          const totalMinutes = Math.floor(totalSeconds / 60);
          const totalHours = Math.floor(totalMinutes / 60);
          const totalDays = Math.floor(totalHours / 24);

          const hours = totalHours % 24;
          const minutes = totalMinutes % 60;
          const seconds = totalSeconds % 60;

          setTimeLeft({ days: totalDays, hours, minutes, seconds });
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [groups, pairings]);

  // Update Background Flags when nextMatches changes
  useEffect(() => {
      if (nextMatches.length === 0) {
          setBackgroundFlags([]);
          return;
      }

      const flags: string[] = [];
      nextMatches.forEach(match => {
          const homeName = resolveTeamName(match.homeTeam, groups, wcFixtures, liveScores, pairings);
          const awayName = resolveTeamName(match.awayTeam, groups, wcFixtures, liveScores, pairings, match.homeTeam);
          
          const hFlag = getFlagCode(homeName);
          const aFlag = getFlagCode(awayName);
          
          if (hFlag) flags.push(hFlag);
          if (aFlag) flags.push(aFlag);
      });
      
      // Limit to 4 flags max for visual sanity
      setBackgroundFlags(flags.slice(0, 4));

  }, [nextMatches, groups, liveScores, pairings]);

  const handleClick = () => {
      if (nextMatches.length > 0 && onMatchClick) {
          onMatchClick(nextMatches[0].matchNumber);
      }
  };

  if (!timeLeft) return null;

  // Logic to cascade hiding units
  const showDays = timeLeft.days > 0;
  // Show hours if days are present OR if hours > 0
  const showHours = showDays || timeLeft.hours > 0;

  return (
    <div 
        onClick={handleClick}
        className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 bg-slate-900/60 transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:scale-[1.005] py-8 sm:py-10"
    >
        {/* Dynamic Background with HD Flags - Transparent Aspect */}
        <div className="absolute inset-0 flex z-0">
            {backgroundFlags.length > 0 ? (
                backgroundFlags.map((code, index) => (
                    <div 
                        key={index} 
                        className="flex-1 h-full bg-cover bg-center opacity-30 saturate-100 transition-all duration-1000 mix-blend-overlay"
                        style={{ backgroundImage: `url(https://flagcdn.com/w2560/${code}.png)` }}
                    ></div>
                ))
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-host-green via-host-blue to-host-red opacity-20"></div>
            )}
        </div>

        {/* Lighter Gradient Overlay - More transparent */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-black/30"></div>

        {/* Content */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center text-white px-2 sm:px-4 text-center">
            
            {/* Status Badge */}
            <div className="mb-4 sm:mb-6 animate-fadeIn">
                <span className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-lg border border-white/20 backdrop-blur-md ${statusText === "LIVE NOW" ? 'bg-red-600 animate-pulse' : 'bg-black/50'}`}>
                    {statusText}
                </span>
            </div>

            {/* Timer - ONLY DAYS HOURS MIN SEC */}
            <div className="flex flex-wrap justify-center items-end gap-3 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 font-mono leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {showDays && (
                    <div className="flex flex-col items-center">
                        <span className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">{timeLeft.days}</span>
                        <span className="text-[9px] sm:text-xs uppercase text-gray-300 font-bold tracking-widest mt-1 sm:mt-2">Days</span>
                    </div>
                )}

                {showHours && (
                    <div className="flex flex-col items-center">
                        <span className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] sm:text-xs uppercase text-gray-300 font-bold tracking-widest mt-1 sm:mt-2">Hours</span>
                    </div>
                )}
                
                <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] sm:text-xs uppercase text-gray-300 font-bold tracking-widest mt-1 sm:mt-2">Mins</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-host-red">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] sm:text-xs uppercase text-gray-300 font-bold tracking-widest mt-1 sm:mt-2">Secs</span>
                </div>
            </div>

            {/* Match Info */}
            <div className="w-full max-w-4xl mx-auto drop-shadow-lg">
                {nextMatches.length === 1 ? (
                    // Single Match Display
                    <div className="flex items-center justify-center gap-2 sm:gap-4 animate-slideUp max-w-full">
                         <div className="text-right w-1/2 min-w-0">
                             <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-white truncate px-1">
                                 {countryMapping[resolveTeamName(nextMatches[0].homeTeam, groups, wcFixtures, liveScores, pairings)] || resolveTeamName(nextMatches[0].homeTeam, groups, wcFixtures, liveScores, pairings)}
                             </h3>
                         </div>
                         <span className="text-host-red font-black text-xl sm:text-3xl italic tracking-tighter drop-shadow-lg mx-1 shrink-0">VS</span>
                         <div className="text-left w-1/2 min-w-0">
                             <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-white truncate px-1">
                                 {countryMapping[resolveTeamName(nextMatches[0].awayTeam, groups, wcFixtures, liveScores, pairings, nextMatches[0].homeTeam)] || resolveTeamName(nextMatches[0].awayTeam, groups, wcFixtures, liveScores, pairings, nextMatches[0].homeTeam)}
                             </h3>
                         </div>
                    </div>
                ) : (
                    // Simultaneous Matches Display (Grid)
                    <div className="flex flex-wrap justify-center gap-2 w-full animate-slideUp">
                        {nextMatches.slice(0, 2).map((match, i) => (
                            <div key={match.matchNumber} className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold bg-black/50 px-3 py-2 rounded-lg border border-white/20 shadow-lg backdrop-blur-md min-w-[150px] sm:min-w-[280px]">
                                <span className="truncate flex-1 text-right text-white">{resolveTeamName(match.homeTeam, groups, wcFixtures, liveScores, pairings)}</span>
                                <span className="text-host-red text-[9px] sm:text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded">VS</span>
                                <span className="truncate flex-1 text-left text-white">{resolveTeamName(match.awayTeam, groups, wcFixtures, liveScores, pairings, match.homeTeam)}</span>
                            </div>
                        ))}
                        {nextMatches.length > 2 && (
                             <div className="w-full text-[10px] text-white/80 text-center uppercase tracking-widest mt-1 font-bold shadow-black drop-shadow-md">
                                 + {nextMatches.length - 2} other matches
                             </div>
                        )}
                    </div>
                )}
                
                <div className="mt-4 sm:mt-5 text-[10px] sm:text-xs text-gray-300 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 drop-shadow-md">
                    <svg className="w-3 h-3 text-host-blue" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {nextMatches.length > 0 && nextMatches[0].venue}, {nextMatches.length > 0 && nextMatches[0].city}
                </div>
            </div>
        </div>
    </div>
  );
};
