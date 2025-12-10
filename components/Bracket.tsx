
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

// Helper to find match by ID
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
    if (!match) return <div className="w-[165px] h-[60px] bg-gray-100/50 rounded-lg animate-pulse border border-gray-200" />;

    const homeTeamResolved = resolveTeamName(match.homeTeam, groups, fixtures, results, pairings, undefined, overrides);
    const awayTeamResolved = resolveTeamName(match.awayTeam, groups, fixtures, results, pairings, match.homeTeam, overrides);

    const homeFlag = getFlagCode(homeTeamResolved);
    const awayFlag = getFlagCode(awayTeamResolved);
    
    const matchResult = results?.[match.matchNumber];
    const scoreText = matchResult?.scoreStr || ""; 
    const [homeScore, awayScore] = scoreText.includes('-') ? scoreText.split('-').map(s => s.trim()) : ["", ""];
    
    // In simulation mode, checking if a winner is selected
    const winner = matchResult?.winner;
    const isFinished = !!winner;

    // Adjusted font sizing for narrower cards (w-165px)
    const getNameClass = (name: string) => {
        if (name.length > 18) return 'text-[9px]';
        if (name.length > 12) return 'text-[10px]';
        return 'text-xs';
    };
    const displayNameHome = countryMapping[homeTeamResolved] || homeTeamResolved;
    const displayNameAway = countryMapping[awayTeamResolved] || awayTeamResolved;

    const handlePredict = (teamName: string) => {
        if (onPrediction && match) {
            onPrediction(match.matchNumber, teamName);
        }
    };

    const isInteractive = !!onPrediction;
    const homeIsWinner = winner === homeTeamResolved;
    const awayIsWinner = winner === awayTeamResolved;

    return (
        <div className={`
            flex flex-col bg-white dark:bg-dark-card rounded-xl p-2 w-[165px] relative z-20 
            border transition-all duration-200
            ${isFinal 
                ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-110' 
                : 'border-gray-200 dark:border-white/10 shadow-sm'
            }
            ${!isFinal && !isInteractive ? 'hover:shadow-lg hover:border-gray-300 dark:hover:border-white/20' : ''}
        `}>
            <div className="flex justify-between items-center mb-1 border-b border-gray-50 dark:border-white/5 pb-0.5">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                    #{match.matchNumber}
                </span>
                <span className={`text-[9px] font-bold ${isFinished ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
                    {isFinished ? 'FT' : match.date.substring(0, 5)}
                </span>
            </div>

            <div className="flex flex-col gap-1">
                {/* Home Team */}
                <div 
                    onClick={() => isInteractive && handlePredict(homeTeamResolved)}
                    className={`flex justify-between items-center h-4 rounded px-1 -mx-1 transition-colors ${
                        isInteractive ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' : ''
                    } ${homeIsWinner ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        {homeFlag ? (
                             <img src={`https://flagcdn.com/w40/${homeFlag}.png`} alt="" className="w-4 h-3 object-cover rounded-[2px] shadow-sm flex-shrink-0" />
                        ) : (
                             <div className="w-4 h-3 bg-gray-100 dark:bg-white/10 rounded-[2px] flex-shrink-0"></div>
                        )}
                        <span className={`font-bold truncate leading-none ${homeIsWinner ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'} ${getNameClass(displayNameHome)}`} title={homeTeamResolved}>
                            {displayNameHome}
                        </span>
                    </div>
                    {isFinished && <span className="font-bold text-xs">{homeScore}</span>}
                    {isInteractive && homeIsWinner && <span className="text-[10px] text-green-600">✔</span>}
                </div>

                {/* Away Team */}
                <div 
                    onClick={() => isInteractive && handlePredict(awayTeamResolved)}
                    className={`flex justify-between items-center h-4 rounded px-1 -mx-1 transition-colors ${
                        isInteractive ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' : ''
                    } ${awayIsWinner ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        {awayFlag ? (
                            <img src={`https://flagcdn.com/w40/${awayFlag}.png`} alt="" className="w-4 h-3 object-cover rounded-[2px] shadow-sm flex-shrink-0" />
                        ) : (
                             <div className="w-4 h-3 bg-gray-100 dark:bg-white/10 rounded-[2px] flex-shrink-0"></div>
                        )}
                        <span className={`font-bold truncate leading-none ${awayIsWinner ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'} ${getNameClass(displayNameAway)}`} title={awayTeamResolved}>
                            {displayNameAway}
                        </span>
                    </div>
                    {isFinished && <span className="font-bold text-xs">{awayScore}</span>}
                    {isInteractive && awayIsWinner && <span className="text-[10px] text-green-600">✔</span>}
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
                <div className="relative w-2 h-full">
                    <div className="absolute left-1/2 top-[25%] bottom-[25%] w-px bg-gray-300 dark:bg-gray-600 -translate-x-1/2"></div>
                    <div className={`absolute top-[25%] w-1/2 h-px bg-gray-300 dark:bg-gray-600 ${side === 'left' ? 'left-0' : 'right-0'}`}></div>
                    <div className={`absolute bottom-[25%] w-1/2 h-px bg-gray-300 dark:bg-gray-600 ${side === 'left' ? 'left-0' : 'right-0'}`}></div>
                    <div className={`absolute top-1/2 w-1/2 h-px bg-gray-300 dark:bg-gray-600 ${side === 'left' ? 'right-0' : 'left-0'}`}></div>
                </div>
            )}

            <div className={`my-0.5 sm:my-1 ${isLeaf ? 'py-1' : ''}`}>
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

    const QF_Left_1 = (
        <BracketNode matchId={97} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={renderNode(89, 74, 77, 'left')}
            prev2={renderNode(90, 73, 75, 'left')}
        />
    );
    const QF_Left_2 = (
        <BracketNode matchId={98} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={renderNode(93, 83, 84, 'left')}
            prev2={renderNode(94, 81, 82, 'left')}
        />
    );

    const QF_Right_1 = (
        <BracketNode matchId={99} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={renderNode(91, 76, 78, 'right')}
            prev2={renderNode(92, 79, 80, 'right')}
        />
    );
    const QF_Right_2 = (
        <BracketNode matchId={100} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={renderNode(95, 86, 88, 'right')}
            prev2={renderNode(96, 85, 87, 'right')}
        />
    );

    const SF_Left = (
        <BracketNode matchId={101} side="left" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={QF_Left_1}
            prev2={QF_Left_2}
        />
    );

    const SF_Right = (
        <BracketNode matchId={102} side="right" fixtures={fixtures} groups={groups} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides}
            prev1={QF_Right_1}
            prev2={QF_Right_2}
        />
    );

    return (
        <Card title="Knockout Bracket" subTitle={onPrediction ? "Click Teams to Advance" : "Official Tournament Tree"} contentClassName="p-0">
            {/* Added scrollbar-thin class to allow horizontal scrolling on PC while keeping it styled */}
            <div className="overflow-x-auto scrollbar-thin bg-gray-50/50 dark:bg-dark-bg/50 rounded-lg relative">
                 <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <img 
                        src={competitionLogos["World Cup"]} 
                        alt="Background" 
                        className="w-[60%] max-w-[800px] h-auto opacity-[0.03] dark:opacity-[0.05] grayscale mix-blend-multiply dark:mix-blend-overlay"
                    />
                </div>

                <div className="flex justify-center min-w-max py-8 px-4 gap-3 relative z-10 items-center">
                    <div className="flex flex-col justify-center">{SF_Left}</div>

                    <div className="flex flex-col items-center gap-4 px-0 relative">
                        <div className="absolute top-[45%] -left-3 w-3 h-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="absolute top-[45%] -right-3 w-3 h-px bg-gray-300 dark:bg-gray-600"></div>

                        <div className="flex flex-col items-center">
                            <div className="mb-6 animate-pulse drop-shadow-2xl z-30">
                                {/* Increased Trophy Size significantly (x2.5) */}
                                <img src={TROPHY_URL} alt="Trophy" className="h-52 sm:h-80 w-auto object-contain hover:scale-110 transition-transform duration-500" />
                            </div>
                            <MatchCard match={getMatch(fixtures, 104)} isFinal align="left" groups={groups} fixtures={fixtures} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} />
                            <div className="h-6 w-px bg-yellow-400"></div>
                            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-1.5 rounded-full shadow-sm">
                                Champion
                            </div>
                        </div>

                        <div className="flex flex-col items-center opacity-80 scale-95 mt-4">
                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Third Place</h4>
                            <MatchCard match={getMatch(fixtures, 103)} align="left" groups={groups} fixtures={fixtures} results={results} pairings={pairings} onPrediction={onPrediction} overrides={overrides} />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">{SF_Right}</div>
                </div>
            </div>
        </Card>
    );
};
