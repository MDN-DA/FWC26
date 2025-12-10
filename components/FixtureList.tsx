
import React, { useState, useMemo, useEffect } from 'react';
import { Fixture, UCLGroup } from '../types';
import { Card } from './ui';
import { getFlagCode, GROUPS, CITY_TIMEZONES, countryMapping } from '../constants';
import { resolveTeamName } from '../utils/standingsUtils';
import { R32Pairings } from '../data/combinations';

interface FixtureListProps {
    fixtures: Fixture[];
    filter?: 'all' | 'group' | 'knockout';
    liveScores?: Record<number, { scoreStr: string; status: string; minute?: string, winner: string }>;
    groups?: UCLGroup[];
    pairings?: R32Pairings | null;
    useLocalTime: boolean;
    highlightedMatchId?: number | null;
}

export const FixtureList: React.FC<FixtureListProps> = ({ fixtures, filter = 'all', liveScores = {}, groups, pairings, useLocalTime, highlightedMatchId }) => {
    const [matchdayFilter, setMatchdayFilter] = useState<'all' | 1 | 2 | 3>('all');
    const [groupFilter, setGroupFilter] = useState<string>('all');
    const [teamFilter, setTeamFilter] = useState<string>('all');

    useEffect(() => {
        setMatchdayFilter('all');
        setGroupFilter('all');
        setTeamFilter('all');
    }, [filter]);

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGroupFilter(e.target.value);
        if (e.target.value !== 'all') {
            setTeamFilter('all');
        }
    };

    const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTeamFilter(e.target.value);
        if (e.target.value !== 'all') {
            setGroupFilter('all');
            setMatchdayFilter('all');
        }
    };

    const allTeams = useMemo(() => {
        const teams = new Set<string>();
        fixtures.forEach(f => {
            teams.add(f.homeTeam);
            teams.add(f.awayTeam);
        });
        Object.values(GROUPS).flat().forEach(t => teams.add(t));
        return Array.from(teams)
            .filter(t => getFlagCode(t) !== null)
            .sort();
    }, [fixtures]);

    const filteredFixtures = fixtures.filter(fixture => {
        if (filter === 'group' && fixture.round !== 'Group Stage') return false;
        if (filter === 'knockout' && fixture.round === 'Group Stage') return false;

        if (filter === 'group' && matchdayFilter !== 'all') {
            const md1 = fixture.matchNumber >= 1 && fixture.matchNumber <= 24;
            const md2 = fixture.matchNumber >= 25 && fixture.matchNumber <= 48;
            const md3 = fixture.matchNumber >= 49 && fixture.matchNumber <= 72;
            
            if (matchdayFilter === 1 && !md1) return false;
            if (matchdayFilter === 2 && !md2) return false;
            if (matchdayFilter === 3 && !md3) return false;
        }

        if (filter === 'group' && groupFilter !== 'all') {
            const groupTeams = GROUPS[groupFilter] || [];
            const homeIn = groupTeams.includes(fixture.homeTeam) || fixture.homeTeam.includes(`Group ${groupFilter}`);
            const awayIn = groupTeams.includes(fixture.awayTeam) || fixture.awayTeam.includes(`Group ${groupFilter}`);
            if (!homeIn && !awayIn) return false;
        }

        if (teamFilter !== 'all') {
             const home = fixture.homeTeam;
             const away = fixture.awayTeam;
             if (home !== teamFilter && away !== teamFilter) return false;
        }

        return true;
    });

    const formatDateTime = (dateStr: string, timeStr: string, city: string) => {
        if (!useLocalTime) return { displayDate: dateStr.substring(0, 5), displayTime: timeStr };
        
        const offset = CITY_TIMEZONES[city] ?? -5; 
        const [day, month, year] = dateStr.split('/').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        const utcHour = hours - offset;
        
        const dateObj = new Date(Date.UTC(2000 + year, month - 1, day, utcHour, minutes));
        
        // Format date manually to DD/MM to ensure consistency
        const d = dateObj.getDate().toString().padStart(2, '0');
        const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        
        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        return { displayDate: `${d}/${m}`, displayTime: time };
    };

    const groupedFixtures = filteredFixtures.reduce((groups, fixture) => {
        const round = fixture.round;
        if (!groups[round]) groups[round] = [];
        groups[round].push(fixture);
        return groups;
    }, {} as Record<string, Fixture[]>);

    const roundOrder = ["Group Stage", "Round of 32", "Round of 16", "Quarter Final", "Semi Final", "Third Place", "Final"];
    const displayedRounds = roundOrder.filter(r => groupedFixtures[r] && groupedFixtures[r].length > 0);

    const getMD = (matchNum: number) => {
        if (matchNum <= 24) return 1;
        if (matchNum <= 48) return 2;
        if (matchNum <= 72) return 3;
        return 0;
    };

    const getTimeContextStyles = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const minutes = h * 60 + m;

        // Day: 07:00 (420) to 20:00 (1200)
        if (minutes >= 420 && minutes < 1200) {
             return { 
                icon: "☀️", 
                label: "Day", 
                className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/30" 
            };
        }

        // Prime: 20:00 (1200) to 23:30 (1410)
        if (minutes >= 1200 && minutes < 1410) {
            return { 
                icon: "💎", 
                label: "Prime", 
                className: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]" 
            };
        }

        // Sleep: 23:30 (1410) to 07:00 (420)
        // This covers everything else (late night / early morning)
        return { 
            icon: "💤", 
            label: "Night", 
            className: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30" 
        };
    };

    const MatchCard = ({ fixture, displayDate, displayTime }: any) => {
        const liveData = liveScores[fixture.matchNumber];
        const isLive = liveData?.status === "STATUS_IN_PROGRESS" || liveData?.status === "in_progress";
        const isFinished = liveData?.status === "STATUS_FINAL";
        const scoreStr = liveData?.scoreStr || "-"; // e.g. "2 - 1"
        const isHighlighted = fixture.matchNumber === highlightedMatchId;
        
        // Resolve Softcoded Names
        const homeTeamResolved = resolveTeamName(fixture.homeTeam, groups, fixtures, liveScores, pairings);
        const awayTeamResolved = resolveTeamName(fixture.awayTeam, groups, fixtures, liveScores, pairings, fixture.homeTeam);

        const homeFlag = getFlagCode(homeTeamResolved);
        const awayFlag = getFlagCode(awayTeamResolved);
        
        const displayNameHome = countryMapping[homeTeamResolved] || homeTeamResolved;
        const displayNameAway = countryMapping[awayTeamResolved] || awayTeamResolved;

        const timeContext = getTimeContextStyles(displayTime);

        return (
        <div 
            id={`match-${fixture.matchNumber}`}
            className={`
                bg-white dark:bg-white/5 border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group
                ${isHighlighted ? 'ring-2 ring-host-blue dark:ring-blue-400 scale-[1.02] shadow-lg z-10' : ''}
                ${isLive ? 'border-red-400 dark:border-red-500/50' : 'border-gray-200 dark:border-white/10'} 
            `}
        >
            {isLive && (
                <div className="absolute top-0 right-0 p-1.5 z-20">
                    <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase animate-pulse shadow-md">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Live {liveData?.minute ? `'${liveData.minute}` : ''}
                    </div>
                </div>
            )}
            
            <div className="flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 dark:border-white/5 pb-2">
                    <span className="text-gray-500 dark:text-gray-300 font-mono">{displayDate}</span>
                    
                    {/* Time Context Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full border ${timeContext.className}`} title={timeContext.label}>
                         <span className="text-sm leading-none">{timeContext.icon}</span>
                    </div>

                    <span className="bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded text-[9px]">#{fixture.matchNumber}</span>
                </div>
                
                <div className="flex items-start justify-between mt-1">
                    <div className="flex flex-col items-center w-[35%] text-center gap-2">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                            {homeFlag ? (
                                    <img src={`https://flagcdn.com/w80/${homeFlag}.png`} alt="" className="w-12 h-9 object-cover rounded shadow-md border border-gray-100 dark:border-white/10" />
                            ) : (
                                <div className="w-12 h-9 bg-gray-200 dark:bg-white/10 rounded shadow-md flex items-center justify-center text-[8px] text-gray-400">?</div>
                            )}
                        </div>
                        <span className={`text-[11px] leading-tight font-bold text-gray-800 dark:text-gray-200`}>
                            {displayNameHome}
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-[30%] pt-1">
                        {isLive || isFinished ? (
                            <span className={`text-2xl sm:text-3xl font-black ${isLive ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'} font-mono leading-none tracking-tight`}>
                                {scoreStr}
                            </span>
                        ) : (
                            <span className="text-xl sm:text-2xl font-black text-host-red font-mono leading-none tracking-tight">
                                {displayTime}
                            </span>
                        )}
                        <span className="text-[9px] text-gray-400 mt-2 uppercase font-medium text-center leading-tight">
                            {fixture.city}
                        </span>
                    </div>

                    <div className="flex flex-col items-center w-[35%] text-center gap-2">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                            {awayFlag ? (
                                    <img src={`https://flagcdn.com/w80/${awayFlag}.png`} alt="" className="w-12 h-9 object-cover rounded shadow-md border border-gray-100 dark:border-white/10" />
                            ) : (
                                <div className="w-12 h-9 bg-gray-200 dark:bg-white/10 rounded shadow-md flex items-center justify-center text-[8px] text-gray-400">?</div>
                            )}
                        </div>
                        <span className={`text-[11px] leading-tight font-bold text-gray-800 dark:text-gray-200`}>
                            {displayNameAway}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )};

    return (
        <Card title="Tournament Schedule" subTitle="Official Match List">
            <div className="flex flex-col gap-3 mb-6 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
                    <div className="relative w-full">
                         <select
                            className="w-full pl-3 pr-8 py-2.5 text-xs rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-host-blue transition-all appearance-none cursor-pointer font-medium"
                            value={teamFilter}
                            onChange={handleTeamChange}
                         >
                            <option value="all">Search / Select Team...</option>
                            {allTeams.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {filter === 'group' && (
                    <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-200 dark:border-white/10">
                        <div className="flex bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                            {(['all', 1, 2, 3] as const).map(md => (
                                <button
                                    key={md}
                                    onClick={() => setMatchdayFilter(md)}
                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-colors ${matchdayFilter === md ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                >
                                    {md === 'all' ? 'All' : `MD ${md}`}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <select 
                                className="appearance-none text-xs font-bold uppercase px-4 py-1.5 pr-8 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-bg focus:outline-none shadow-sm cursor-pointer hover:border-gray-300"
                                value={groupFilter}
                                onChange={handleGroupChange}
                            >
                                <option value="all">All Groups</option>
                                {Object.keys(GROUPS).map(g => (
                                    <option key={g} value={g}>Group {g}</option>
                                ))}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {displayedRounds.map(roundName => {
                    const roundFixtures = groupedFixtures[roundName];
                    const chunks: { label: string | null, matches: Fixture[] }[] = [];
                    
                    if (roundName === 'Group Stage') {
                        let currentMD = -1;
                        let currentBatch: Fixture[] = [];
                        roundFixtures.forEach(match => {
                            const md = getMD(match.matchNumber);
                            if (md !== currentMD) {
                                if (currentBatch.length > 0) {
                                    chunks.push({ 
                                        label: (filter === 'all' || (filter === 'group' && matchdayFilter === 'all')) ? `Matchday ${currentMD}` : null, 
                                        matches: currentBatch 
                                    });
                                }
                                currentMD = md;
                                currentBatch = [];
                            }
                            currentBatch.push(match);
                        });
                        if (currentBatch.length > 0) chunks.push({ label: (filter === 'all' || (filter === 'group' && matchdayFilter === 'all')) ? `Matchday ${currentMD}` : null, matches: currentBatch });
                    } else {
                        chunks.push({ label: null, matches: roundFixtures });
                    }

                    return (
                        <div key={roundName} className="animate-fadeIn">
                            <div className="mb-4 flex items-center gap-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-host-blue dark:text-white whitespace-nowrap">
                                    {roundName}
                                </h3>
                                <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>
                            </div>
                            <div className="space-y-6">
                                {chunks.map((chunk, chunkIndex) => (
                                    <div key={chunkIndex}>
                                        {chunk.label && (
                                            <div className="flex justify-center mb-4">
                                                <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                                                    {chunk.label}
                                                </span>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {chunk.matches.map(fixture => {
                                                const { displayDate, displayTime } = formatDateTime(fixture.date, fixture.time, fixture.city);

                                                return (
                                                    <MatchCard 
                                                        key={fixture.matchNumber}
                                                        fixture={fixture}
                                                        displayDate={displayDate}
                                                        displayTime={displayTime}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {displayedRounds.length === 0 && (
                     <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                         <span className="text-4xl mb-4">🔍</span>
                         <span className="font-medium">No fixtures match your filters.</span>
                     </div>
                )}
            </div>
        </Card>
    );
};
