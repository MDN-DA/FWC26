
import React from 'react';
import { Card } from './ui';
import { Fixture, UCLGroup } from '../types';
import { competitionLogos, getFlagCode, countryMapping } from '../constants';
import { R32Pairings } from '../data/combinations';
import { resolveTeamName } from '../utils/standingsUtils';

interface BracketProps {
    fixtures: Fixture[];
    groups?: UCLGroup[];
    results?: Record<number, { winner: string, scoreStr?: string, status?: string }>;
    pairings?: R32Pairings | null;
    onPrediction?: (matchId: number, winner: string) => void;
    overrides?: Record<string, string>;
}

const TROPHY_URL = "https://static.vecteezy.com/system/resources/previews/068/283/711/non_2x/the-iconic-golden-fifa-world-cup-trophy-a-symbol-of-global-football-championship-victory-isolated-on-transparent-background-free-png.png";

const getMatch = (fixtures: Fixture[], id: number): Fixture | undefined => {
    return fixtures.find(f => f.matchNumber === id);
};

const MatchCard: React.FC<{ 
    match?: Fixture; 
    isFinal?: boolean; 
    align?: 'left' | 'right'; 
    groups?: UCLGroup[];
    fixtures: Fixture[];
    results?: Record<number, { winner: string, scoreStr?: string }>;
    pairings?: R32Pairings | null;
    onPrediction?: (matchId: number, winner: string) => void;
    overrides?: Record<string, string>;
}> = ({ match, isFinal = false, align = 'left', groups, fixtures, results, pairings, onPrediction, overrides }) => {
    const cardWidth = isFinal ? 'w-[170px]' : 'w-[150px]';
    if (!match) return <div className={`${cardWidth} h-[65px] bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-white/10 animate-pulse`} />;

    const homeTeamResolved = resolveTeamName(match.homeTeam, groups, fixtures, results, pairings, undefined, overrides);
    const awayTeamResolved = resolveTeamName(match.awayTeam, groups, fixtures, results, pairings, match.homeTeam, overrides);

    const homeFlag = getFlagCode(homeTeamResolved);
    const awayFlag = getFlagCode(awayTeamResolved);
    
    const matchResult = results?.[match.matchNumber];
    const scoreText = matchResult?.scoreStr || ""; 
    const [homeScore, awayScore] = scoreText.includes('-') ? scoreText.split('-').map(s => s.trim()) : ["", ""];
    
    const winner = matchResult?.winner;
    const isFinished = !!winner;

    const displayNameHome = countryMapping[homeTeamResolved] || homeTeamResolved;
    const displayNameAway = countryMapping[awayTeamResolved] || awayTeamResolved;

    const handlePredict = (teamName: string) => {
        if (onPrediction && match && teamName !== "?" && !teamName.includes("/")) {
            handlePredictionInternal(match.matchNumber, teamName);
        }
    };

    const handlePredictionInternal = (matchId: number, winner: string) => {
        if (onPrediction) onPrediction(matchId, winner);
    };

    const isInteractive = !!onPrediction;
    const homeIsWinner = winner === homeTeamResolved;
    const awayIsWinner = winner === awayTeamResolved;

    return (
        <div className={`
            flex flex-col bg-white dark:bg-dark-card rounded-lg ${cardWidth} relative z-20 overflow-hidden
            border transition-all duration-300
            ${isFinal 
                ? 'border-yellow-400 shadow-xl scale-110 ring-2 ring-yellow-400/20' 
                : isFinished ? 'border-host-blue' : 'border-gray-200 dark:border-white/10'
            }
            ${isInteractive ? 'cursor-default' : 'hover:scale-[1.03] shadow-sm hover:shadow-md'}
        `}>
            <div className="relative z-20 p-2 pt-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-1.5 border-b border-gray-100 dark:border-white/10 pb-1">
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">#{match.matchNumber}</span>
                    <span className={`text-[7px] font-black uppercase tracking-tighter ${isFinished ? 'text-green-500' : 'text-gray-400'}`}>
                        {isFinished ? 'FINAL' : match.date.substring(0, 5)}
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div 
                        onClick={() => handlePredict(homeTeamResolved)}
                        className={`flex justify-between items-center h-4.5 px-1 rounded transition-all ${
                            isInteractive && !homeTeamResolved.match(/^[123][A-L]$/) ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' : ''
                        } ${homeIsWinner ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            {homeFlag && <img src={`https://flagcdn.com/w40/${homeFlag}.png`} className="w-3.5 h-2.5 object-cover rounded-[1px]" alt="" />}
                            <span className={`text-[9px] font-black truncate ${homeIsWinner ? 'text-host-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {displayNameHome.toUpperCase()}
                            </span>
                        </div>
                        {isFinished && <span className="text-[10px] font-black text-gray-900 dark:text-white ml-1">{homeScore}</span>}
                    </div>

                    <div 
                        onClick={() => handlePredict(awayTeamResolved)}
                        className={`flex justify-between items-center h-4.5 px-1 rounded transition-all ${
                            isInteractive && !awayTeamResolved.match(/^[123][A-L]$/) ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' : ''
                        } ${awayIsWinner ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                        <div className="flex items-center gap-1.5 min-w-0">
                            {awayFlag && <img src={`https://flagcdn.com/w40/${awayFlag}.png`} className="w-3.5 h-2.5 object-cover rounded-[1px]" alt="" />}
                            <span className={`text-[9px] font-black truncate ${awayIsWinner ? 'text-host-blue dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {displayNameAway.toUpperCase()}
                            </span>
                        </div>
                        {isFinished && <span className="text-[10px] font-black text-gray-900 dark:text-white ml-1">{awayScore}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BracketNode: React.FC<{ 
    matchId: number; 
    prev1?: React.ReactNode; 
    prev2?: React.ReactNode; 
    fixtures: Fixture[];
    groups?: UCLGroup[];
    results?: Record<number, { winner: string, scoreStr?: string }>;
    pairings?: R32Pairings | null;
    side: 'left' | 'right';
    onPrediction?: (matchId: number, winner: string) => void;
    overrides?: Record<string, string>;
}> = ({ matchId, prev1, prev2, fixtures, groups, results, pairings, side, onPrediction, overrides }) => {
    const match = getMatch(fixtures, matchId);
    const isLeaf = !prev1 && !prev2;

    return (
        <div className={`flex ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center`}>
            <div className="flex flex-col justify-center relative">
                {prev1}
                {prev2}
            </div>
            {!isLeaf && (
                <div className="relative w-4 h-full">
                    <div className="absolute left-1/2 top-[25%] bottom-[25%] w-px bg-gray-200 dark:bg-white/10 -translate-x-1/2"></div>
                    <div className={`absolute top-[25%] w-1/2 h-px bg-gray-200 dark:bg-white/10 ${side === 'left' ? 'left-0' : 'right-0'}`}></div>
                    <div className={`absolute bottom-[25%] w-1/2 h-px bg-gray-200 dark:bg-white/10 ${side === 'left' ? 'left-0' : 'right-0'}`}></div>
                    <div className={`absolute top-1/2 w-1/2 h-px bg-gray-200 dark:bg-white/10 ${side === 'left' ? 'right-0' : 'left-0'}`}></div>
                </div>
            )}
            <div className="my-1">
                <MatchCard match={match} align={side} groups={groups} fixtures={fixtures} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} />
            </div>
        </div>
    );
};

export const Bracket: React.FC<BracketProps> = ({ fixtures, groups, results, pairings, onPrediction, overrides }) => {
    const renderNode = (id: number, p1Id: number | null, p2Id: number | null, side: 'left' | 'right') => {
        if (!p1Id || !p2Id) {
            return <BracketNode key={id} matchId={id} fixtures={fixtures} groups={groups} results={results} pairings={pairings} side={side} onPrediction={onPrediction} overrides={overrides} />;
        }
        return (
            <BracketNode 
                key={id} 
                matchId={id} 
                fixtures={fixtures} 
                groups={groups}
                results={results}
                pairings={pairings}
                side={side}
                prev1={renderNode(p1Id, null, null, side)} 
                prev2={renderNode(p2Id, null, null, side)}
                onPrediction={onPrediction}
                overrides={overrides}
            />
        );
    };

    const QF_Left_1 = <BracketNode matchId={97} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={renderNode(89, 74, 77, 'left')} prev2={renderNode(90, 73, 75, 'left')} />;
    const QF_Left_2 = <BracketNode matchId={98} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={renderNode(93, 83, 84, 'left')} prev2={renderNode(94, 81, 82, 'left')} />;
    const QF_Right_1 = <BracketNode matchId={99} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={renderNode(91, 76, 78, 'right')} prev2={renderNode(92, 79, 80, 'right')} />;
    const QF_Right_2 = <BracketNode matchId={100} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={renderNode(95, 86, 88, 'right')} prev2={renderNode(96, 85, 87, 'right')} />;

    return (
        <Card title="Tournament Tree" contentClassName="p-0 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin bg-gray-50/50 dark:bg-dark-bg/20">
                <div className="flex justify-center min-w-max py-6 px-4 gap-4 items-center">
                    <div className="flex flex-col justify-center">
                        <BracketNode matchId={101} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={QF_Left_1} prev2={QF_Left_2} />
                    </div>

                    <div className="flex flex-col items-center gap-4 px-2">
                        <div className="flex flex-col items-center">
                            <img src={TROPHY_URL} alt="Trophy" className="h-40 sm:h-56 w-auto object-contain drop-shadow-2xl mb-4" />
                            <MatchCard match={getMatch(fixtures, 104)} isFinal align="left" groups={groups} fixtures={fixtures} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} />
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-600 dark:text-yellow-400 mt-4 bg-yellow-400/10 border border-yellow-400/20 px-6 py-1.5 rounded-full shadow-sm">CHAMPION</div>
                        </div>
                        <div className="mt-8 opacity-70 scale-90 border-t border-gray-200 dark:border-white/5 pt-6 w-full flex flex-col items-center">
                            <h4 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em] mb-2 text-center">Third Place</h4>
                            <MatchCard match={getMatch(fixtures, 103)} align="left" groups={groups} fixtures={fixtures} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <BracketNode matchId={102} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} prev1={QF_Right_1} prev2={QF_Right_2} />
                    </div>
                </div>
            </div>
        </Card>
    );
};
