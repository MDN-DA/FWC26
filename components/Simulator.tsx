
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui';
import { UCLGroup } from '../types';
import { groupFixtures } from '../data/groupFixtures';
import { countryMapping, getFlagCode, GROUPS } from '../constants';
import { calculateSimulatedStandings, SimulatedScores } from '../utils/simulatorLogic';
import { LeagueTable } from './LeagueTable';
import { Bracket } from './Bracket';
import { calculateBestThirds, getQualifyingThirdsKey } from '../utils/standingsUtils';
import { getKnockoutPairings } from '../data/combinations';
import { playoffCandidates } from '../data/playoffs';
import { wcFixtures } from '../data/fixtures';

interface SimulatorProps {
    initialGroups: UCLGroup[];
    initialPlayoffWinners?: Record<string, string>;
    onPlayoffSync?: (winners: Record<string, string>) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({ initialGroups, initialPlayoffWinners = {}, onPlayoffSync }) => {
    const [simScores, setSimScores] = useState<SimulatedScores>({});
    const [simKnockoutResults, setSimKnockoutResults] = useState<Record<number, { winner: string, scoreStr: string }>>({});
    const [playoffMapping, setPlayoffMapping] = useState<Record<string, string>>(initialPlayoffWinners);
    
    // Détection de la période des play-offs (Skip Setup après le 31 Mars 2026)
    const [viewMode, setViewMode] = useState<'setup' | 'groups' | 'bracket'>('groups');
    const isPlayoffPeriod = useMemo(() => new Date() < new Date("2026-04-01T00:00:00Z"), []);

    useEffect(() => {
        if (isPlayoffPeriod) setViewMode('setup');
        else setViewMode('groups');
    }, [isPlayoffPeriod]);

    const [simGroups, setSimGroups] = useState<UCLGroup[]>(initialGroups);
    const [activeGroup, setActiveGroup] = useState<string>('A');
    
    const unresolvedPlayoffs = useMemo(() => {
        const found: string[] = [];
        initialGroups.forEach(g => {
            g.standings.entries.forEach(e => {
                if (playoffCandidates[e.team.name]) found.push(e.team.name);
            });
        });
        return Array.from(new Set(found));
    }, [initialGroups]);

    useEffect(() => {
        let updatedGroups = JSON.parse(JSON.stringify(initialGroups));
        if (Object.keys(playoffMapping).length > 0) {
            updatedGroups.forEach((group: UCLGroup) => {
                group.standings.entries.forEach(entry => {
                    if (playoffMapping[entry.team.name]) {
                        entry.team.name = playoffMapping[entry.team.name];
                        entry.team.displayName = playoffMapping[entry.team.name];
                    }
                });
            });
        }
        updatedGroups = calculateSimulatedStandings(updatedGroups, simScores, playoffMapping);
        setSimGroups(updatedGroups);
    }, [simScores, initialGroups, playoffMapping]);

    const { pairings, bracketResults } = useMemo(() => {
        const best3rds = calculateBestThirds(simGroups);
        const key = getQualifyingThirdsKey(best3rds);
        return { pairings: key ? getKnockoutPairings(key.split("")) : null, bracketResults: simKnockoutResults };
    }, [simGroups, simKnockoutResults]);

    const handlePlayoffSelect = (placeholder: string, team: string) => {
        const newMapping = { ...playoffMapping, [placeholder]: team };
        setPlayoffMapping(newMapping);
        if (onPlayoffSync) onPlayoffSync(newMapping);
    };

    const handleRandomScores = () => {
        // Applique des scores aléatoires à TOUS les matchs de TOUS les groupes pour un simulateur "pur jeu"
        const newScores = { ...simScores };
        groupFixtures.forEach(f => {
            newScores[f.matchNumber] = {
                home: Math.floor(Math.random() * 5), // Scores de 0 à 4
                away: Math.floor(Math.random() * 5)
            };
        });
        setSimScores(newScores);
    };

    const handleReset = () => {
        if (window.confirm("Reset all predictions?")) {
            setSimScores({});
            setSimKnockoutResults({});
            setPlayoffMapping({});
            if (onPlayoffSync) onPlayoffSync({});
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm sticky top-20 z-30">
                <div className="grid grid-cols-1 sm:flex sm:flex-row items-center gap-2 w-full xl:w-auto">
                    {isPlayoffPeriod && (
                        <button onClick={() => setViewMode('setup')} className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'setup' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}>1. Setup Playoffs</button>
                    )}
                    <button onClick={() => setViewMode('groups')} className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'groups' ? 'bg-host-blue text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}>{isPlayoffPeriod ? '2. Predict Groups' : '1. Predict Groups'}</button>
                    <button onClick={() => setViewMode('bracket')} className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${viewMode === 'bracket' ? 'bg-host-red text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}>{isPlayoffPeriod ? '3. Knockout Stage' : '2. Knockout Stage'}</button>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleRandomScores} 
                        className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-400 text-white hover:bg-amber-500 shadow-md transition-all active:scale-95 flex items-center gap-2"
                        title="Randomize all match scores"
                    >
                        <span>🎲</span> RANDOM ALL
                    </button>
                    <button onClick={handleReset} className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Reset</button>
                </div>
            </div>

            {viewMode === 'setup' && isPlayoffPeriod && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unresolvedPlayoffs.map((placeholder) => {
                        const candidates = playoffCandidates[placeholder] || [];
                        return (
                            <Card key={placeholder} title={placeholder} subTitle="Select Winner">
                                <div className="space-y-3">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Who qualifies from this path?</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {candidates.map(team => {
                                            const isSelected = playoffMapping[placeholder] === team;
                                            const flag = getFlagCode(team);
                                            return (
                                                <button key={team} onClick={() => handlePlayoffSelect(placeholder, team)} className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${isSelected ? 'bg-green-50 dark:bg-green-900/20 border-green-500 ring-1 ring-green-500' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300'}`}>
                                                    {flag && <img src={`https://flagcdn.com/w40/${flag}.png`} className="w-5 h-3.5 rounded shadow-sm" alt={team} />}
                                                    <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{team}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                    <div className="col-span-full flex justify-center mt-4"><button onClick={() => setViewMode('groups')} className="bg-host-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Next: Predict Group Stage &rarr;</button></div>
                </div>
            )}

            {viewMode === 'groups' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="grid grid-cols-6 sm:flex sm:flex-wrap gap-2 justify-center bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-200 dark:border-white/10">
                            {Object.keys(GROUPS).map(g => (
                                <button key={g} onClick={() => setActiveGroup(g)} className={`w-full sm:w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${activeGroup === g ? 'bg-host-blue text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-gray-200'}`}>{g}</button>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {groupFixtures.filter(f => {
                                const teams = GROUPS[activeGroup] || [];
                                const h = countryMapping[f.homeTeam] || f.homeTeam;
                                const hResolved = playoffMapping[h] || h;
                                return teams.includes(h) || teams.includes(hResolved);
                            }).map(fixture => {
                                const h = playoffMapping[countryMapping[fixture.homeTeam]||fixture.homeTeam] || (countryMapping[fixture.homeTeam]||fixture.homeTeam);
                                const a = playoffMapping[countryMapping[fixture.awayTeam]||fixture.awayTeam] || (countryMapping[fixture.awayTeam]||fixture.awayTeam);
                                const score = simScores[fixture.matchNumber] || { home: '', away: '' };
                                return (
                                    <div key={fixture.matchNumber} className="bg-white dark:bg-dark-card p-3 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 w-1/3">
                                            {getFlagCode(h) && <img src={`https://flagcdn.com/w40/${getFlagCode(h)}.png`} className="w-6 h-4 rounded shadow-sm" alt="" />}
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{h}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={score.home} onChange={(e) => setSimScores(p => ({...p, [fixture.matchNumber]: {...p[fixture.matchNumber], home: e.target.value}}))} className="w-10 h-8 text-center bg-gray-50 dark:bg-dark-bg border border-gray-300 rounded font-mono font-bold" />
                                            <span className="text-gray-300">-</span>
                                            <input type="number" value={score.away} onChange={(e) => setSimScores(p => ({...p, [fixture.matchNumber]: {...p[fixture.matchNumber], away: e.target.value}}))} className="w-10 h-8 text-center bg-gray-50 dark:bg-dark-bg border border-gray-300 rounded font-mono font-bold" />
                                        </div>
                                        <div className="flex items-center justify-end gap-3 w-1/3">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{a}</span>
                                            {getFlagCode(a) && <img src={`https://flagcdn.com/w40/${getFlagCode(a)}.png`} className="w-6 h-4 rounded shadow-sm" alt="" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                         <div className="sticky top-40">
                             <div className="bg-host-blue/10 border border-host-blue/20 p-2 rounded-lg mb-4 text-center font-black uppercase text-[10px] text-host-blue dark:text-blue-300 tracking-widest">Simulated Group {activeGroup}</div>
                             {simGroups.find(g => g.name === `Group ${activeGroup}`) && <LeagueTable title={`Group ${activeGroup}`} standings={[simGroups.find(g => g.name === `Group ${activeGroup}`)!]} isUCL={false} cols={1} overrides={playoffMapping} />}
                         </div>
                    </div>
                </div>
            )}

            {viewMode === 'bracket' && (
                <Bracket fixtures={wcFixtures} groups={simGroups} results={simKnockoutResults} pairings={pairings} onPrediction={(mid, win) => setSimKnockoutResults(p => ({...p, [mid]: {winner: win, scoreStr: 'Sim'}}))} overrides={playoffMapping} />
            )}
        </div>
    );
};
