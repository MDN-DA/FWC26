
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui';
import { UCLGroup, Fixture } from '../types';
import { groupFixtures } from '../data/groupFixtures';
import { wcFixtures } from '../data/fixtures';
import { countryMapping, getFlagCode, GROUPS } from '../constants';
import { calculateSimulatedStandings, SimulatedScores } from '../utils/simulatorLogic';
import { LeagueTable } from './LeagueTable';
import { Bracket } from './Bracket';
import { calculateBestThirds, getQualifyingThirdsKey } from '../utils/standingsUtils';
import { getKnockoutPairings } from '../data/combinations';
import { playoffCandidates } from '../data/playoffs';

interface SimulatorProps {
    initialGroups: UCLGroup[];
}

export const Simulator: React.FC<SimulatorProps> = ({ initialGroups }) => {
    // 1. State for Scores
    const [simScores, setSimScores] = useState<SimulatedScores>({});
    const [simKnockoutResults, setSimKnockoutResults] = useState<Record<number, { winner: string, scoreStr: string }>>({});
    
    // 2. State for Manual Playoff Resolution
    const [playoffMapping, setPlayoffMapping] = useState<Record<string, string>>({});
    
    const [simGroups, setSimGroups] = useState<UCLGroup[]>(initialGroups);
    const [activeGroup, setActiveGroup] = useState<string>('A');
    
    // Determine which playoffs are still placeholders in the API data
    const unresolvedPlayoffs = useMemo(() => {
        const found: string[] = [];
        initialGroups.forEach(g => {
            g.standings.entries.forEach(e => {
                // Check if the team name matches one of our known placeholders (e.g., "Path A [UEFA]")
                if (playoffCandidates[e.team.name]) {
                    found.push(e.team.name);
                }
            });
        });
        return found;
    }, [initialGroups]);

    const hasPlayoffsToConfig = unresolvedPlayoffs.length > 0;

    // Initialize view mode based on whether playoffs need setup
    const [viewMode, setViewMode] = useState<'setup' | 'groups' | 'bracket'>('groups');

    // Effect: Set initial view mode only once when data loads
    useEffect(() => {
        if (hasPlayoffsToConfig) {
            setViewMode('setup');
        } else {
            setViewMode('groups');
        }
    }, [hasPlayoffsToConfig]);

    // Effect: Update Groups when initialGroups changes or when Playoff Mapping changes
    useEffect(() => {
        let updatedGroups = JSON.parse(JSON.stringify(initialGroups));

        // Apply Playoff Mapping (Replace "Path A [UEFA]" with "Italy" in the group data)
        if (Object.keys(playoffMapping).length > 0) {
            updatedGroups.forEach((group: UCLGroup) => {
                group.standings.entries.forEach(entry => {
                    // entry.team.name matches "Path A [UEFA]"
                    if (playoffMapping[entry.team.name]) {
                        entry.team.name = playoffMapping[entry.team.name];
                        entry.team.displayName = playoffMapping[entry.team.name];
                    }
                });
            });
        }
        
        // Apply Scores
        updatedGroups = calculateSimulatedStandings(updatedGroups, simScores, playoffMapping);
        setSimGroups(updatedGroups);
    }, [simScores, initialGroups, playoffMapping]);

    // Data Calculation for Bracket
    const { pairings, bracketResults } = useMemo(() => {
        const best3rds = calculateBestThirds(simGroups);
        const key = getQualifyingThirdsKey(best3rds);
        const currentPairings = key ? getKnockoutPairings(key.split("")) : null;
        return { pairings: currentPairings, bracketResults: simKnockoutResults };
    }, [simGroups, simKnockoutResults]);

    const handleScoreChange = (matchId: number, team: 'home' | 'away', value: string) => {
        setSimScores(prev => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [team]: value
            }
        }));
    };

    const handleKnockoutPrediction = (matchId: number, winner: string) => {
        setSimKnockoutResults(prev => ({
            ...prev,
            [matchId]: {
                winner: winner,
                scoreStr: 'Sim' 
            }
        }));
    };

    const handlePlayoffSelect = (placeholder: string, team: string) => {
        setPlayoffMapping(prev => ({
            ...prev,
            [placeholder]: team
        }));
    };

    const handleRandomizeGroup = (groupLetter: string) => {
        const newScores = { ...simScores };
        groupFixtures.forEach(f => {
            const h = countryMapping[f.homeTeam] || f.homeTeam;
            const hResolved = playoffMapping[h] || h;
            const groupTeams = GROUPS[groupLetter];
            
            if (groupTeams && (groupTeams.includes(h) || groupTeams.includes(hResolved))) {
                 const scoreH = Math.floor(Math.random() * 4); 
                 const scoreA = Math.floor(Math.random() * 4);
                 newScores[f.matchNumber] = { home: scoreH, away: scoreA };
            }
        });
        setSimScores(newScores);
    };

    const handleReset = () => {
        if (window.confirm("Reset all predictions?")) {
            setSimScores({});
            setSimKnockoutResults({});
            setPlayoffMapping({});
        }
    };

    const currentGroupData = simGroups.find(g => g.name === `Group ${activeGroup}`);
    const currentGroupMatches = groupFixtures.filter(f => {
        const teams = GROUPS[activeGroup] || [];
        const h = countryMapping[f.homeTeam] || f.homeTeam;
        const hResolved = playoffMapping[h] || h;
        return teams.includes(h) || teams.includes(hResolved);
    });

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm sticky top-20 z-30">
                <div className="grid grid-cols-1 sm:flex sm:flex-row items-center gap-2 w-full xl:w-auto">
                    {/* Only show Setup button if there are unresolved playoffs */}
                    {hasPlayoffsToConfig && (
                        <button 
                            onClick={() => setViewMode('setup')}
                            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'setup' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}
                        >
                            1. Setup Playoffs
                        </button>
                    )}
                    <button 
                        onClick={() => setViewMode('groups')}
                        className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'groups' ? 'bg-host-blue text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {hasPlayoffsToConfig ? '2. Predict Groups' : '1. Predict Groups'}
                    </button>
                    <button 
                        onClick={() => setViewMode('bracket')}
                        className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'bracket' ? 'bg-host-red text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {hasPlayoffsToConfig ? '3. Knockout Stage' : '2. Knockout Stage'}
                    </button>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {viewMode === 'groups' && (
                         <button 
                            onClick={() => handleRandomizeGroup(activeGroup)}
                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                        >
                            Randomize {activeGroup}
                        </button>
                    )}
                    <button 
                        onClick={handleReset}
                        className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        Reset All
                    </button>
                </div>
            </div>

            {/* VIEW 1: SETUP PLAYOFFS (Only if needed) */}
            {viewMode === 'setup' && hasPlayoffsToConfig && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unresolvedPlayoffs.map((placeholder) => {
                        const candidates = playoffCandidates[placeholder] || [];
                        return (
                            <Card key={placeholder} title={placeholder} subTitle="Select Winner">
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-400">Who qualifies from this path?</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {candidates.map(team => {
                                            const isSelected = playoffMapping[placeholder] === team;
                                            const flag = getFlagCode(team);
                                            return (
                                                <button
                                                    key={team}
                                                    onClick={() => handlePlayoffSelect(placeholder, team)}
                                                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                                        isSelected 
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 ring-1 ring-green-500' 
                                                        : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {flag && <img src={`https://flagcdn.com/w40/${flag}.png`} className="w-5 h-3.5 rounded shadow-sm" alt={team} />}
                                                    <span className={`text-xs font-bold ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {team}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                    <div className="col-span-full flex justify-center mt-4">
                        <button 
                            onClick={() => setViewMode('groups')}
                            className="bg-host-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Next: Predict Group Stage &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW 2: GROUP STAGE SIM */}
            {viewMode === 'groups' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Group Selection & Matches */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Group Selector - FORCED GRID OF 6 ON MOBILE */}
                        <div className="grid grid-cols-6 sm:flex sm:flex-wrap gap-2 justify-center bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-200 dark:border-white/10">
                            {Object.keys(GROUPS).map(g => (
                                <button
                                    key={g}
                                    onClick={() => setActiveGroup(g)}
                                    className={`w-full sm:w-8 h-8 rounded-lg sm:rounded-full text-xs font-black flex items-center justify-center transition-all ${
                                        activeGroup === g 
                                        ? 'bg-host-blue text-white shadow-lg' 
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>

                        {/* Match Inputs */}
                        <div className="space-y-3">
                            {currentGroupMatches.map(fixture => {
                                const homeRaw = countryMapping[fixture.homeTeam] || fixture.homeTeam;
                                const awayRaw = countryMapping[fixture.awayTeam] || fixture.awayTeam;

                                const homeName = playoffMapping[homeRaw] || homeRaw;
                                const awayName = playoffMapping[awayRaw] || awayRaw;

                                const hFlag = getFlagCode(homeName);
                                const aFlag = getFlagCode(awayName);
                                const score = simScores[fixture.matchNumber] || { home: '', away: '' };

                                return (
                                    <div key={fixture.matchNumber} className="bg-white dark:bg-dark-card p-3 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-between gap-2">
                                        {/* Home */}
                                        <div className="flex items-center gap-3 w-1/3">
                                            {hFlag && <img src={`https://flagcdn.com/w40/${hFlag}.png`} className="w-6 h-4 object-cover rounded shadow-sm" alt={homeName} />}
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate hidden sm:block">{homeName}</span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate sm:hidden">{homeName.substring(0,3).toUpperCase()}</span>
                                        </div>

                                        {/* Inputs */}
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="20"
                                                value={score.home}
                                                onChange={(e) => handleScoreChange(fixture.matchNumber, 'home', e.target.value)}
                                                className="w-10 h-8 text-center bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded font-mono font-bold text-lg focus:ring-2 focus:ring-host-blue outline-none"
                                            />
                                            <span className="text-gray-300 dark:text-gray-600">-</span>
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="20"
                                                value={score.away}
                                                onChange={(e) => handleScoreChange(fixture.matchNumber, 'away', e.target.value)}
                                                className="w-10 h-8 text-center bg-gray-50 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded font-mono font-bold text-lg focus:ring-2 focus:ring-host-blue outline-none"
                                            />
                                        </div>

                                        {/* Away */}
                                        <div className="flex items-center justify-end gap-3 w-1/3">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate hidden sm:block">{awayName}</span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate sm:hidden">{awayName.substring(0,3).toUpperCase()}</span>
                                            {aFlag && <img src={`https://flagcdn.com/w40/${aFlag}.png`} className="w-6 h-4 object-cover rounded shadow-sm" alt={awayName} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Live Standings */}
                    <div className="lg:col-span-5">
                         <div className="sticky top-40">
                             <div className="bg-host-blue/10 border border-host-blue/20 p-2 rounded-lg mb-4 text-center">
                                 <p className="text-[10px] uppercase font-bold text-host-blue dark:text-blue-300 tracking-widest">
                                     Live Simulated Standings
                                 </p>
                             </div>
                             {currentGroupData && (
                                 <LeagueTable 
                                     title={`Group ${activeGroup}`} 
                                     standings={[currentGroupData]} 
                                     isUCL={false} 
                                     cols={1}
                                 />
                             )}
                         </div>
                    </div>
                </div>
            )}

            {/* VIEW 3: BRACKET SIM */}
            {viewMode === 'bracket' && (
                <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-xl text-center">
                        <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 uppercase tracking-wider mb-1">
                            Interactive Bracket
                        </h3>
                        <p className="text-xs text-yellow-700 dark:text-yellow-500">
                            Click on a team in any match to advance them to the next round.
                        </p>
                    </div>
                    
                    <Bracket 
                        fixtures={wcFixtures} 
                        groups={simGroups} 
                        results={bracketResults} 
                        pairings={pairings} 
                        onPrediction={handleKnockoutPrediction}
                        overrides={playoffMapping}
                    />
                </div>
            )}
        </div>
    );
};
