
import React from 'react';
import { Card } from './ui';
import { PlayoffMatch, PlayoffPath } from '../data/playoffs';
import { getFlagCode } from '../constants';

const MatchRow = ({ match, isSemi = false }: { match: PlayoffMatch, isSemi?: boolean }) => {
    const flag1 = getFlagCode(match.team1.name);
    const flag2 = getFlagCode(match.team2.name);

    return (
        <div className={`relative bg-white dark:bg-dark-card border border-gray-200 dark:border-white/10 rounded-xl p-3 mb-3 shadow-sm ${match.isFinal ? 'border-l-4 border-l-yellow-400' : 'hover:shadow-md transition-shadow'}`}>
            <div className="flex justify-between text-[11px] text-gray-400 mb-2 font-mono uppercase font-medium tracking-wide">
                <span>{match.date}</span>
                <span>{match.venue || 'TBD'}</span>
            </div>
            <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-3">
                    {flag1 ? (
                        <img src={`https://flagcdn.com/w40/${flag1}.png`} alt="" className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                    ) : (
                         <div className="w-5 h-3.5 bg-gray-100 dark:bg-white/10 rounded-[2px]"></div>
                    )}
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team1.name}</span>
                </div>
                <span className="text-gray-300 font-bold">-</span>
            </div>
            <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-3">
                     {flag2 ? (
                        <img src={`https://flagcdn.com/w40/${flag2}.png`} alt="" className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
                    ) : (
                         <div className="w-5 h-3.5 bg-gray-100 dark:bg-white/10 rounded-[2px]"></div>
                    )}
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{match.team2.name}</span>
                </div>
                <span className="text-gray-300 font-bold">-</span>
            </div>
            {match.isFinal && <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl shadow-sm tracking-wider">FINAL</div>}
        </div>
    );
};

const PathCard: React.FC<{ path: PlayoffPath }> = ({ path }) => {
    return (
        <div className="bg-gray-50/50 dark:bg-dark-border/20 rounded-2xl p-4 border border-gray-100 dark:border-white/5 relative">
            <h4 className="text-sm font-black text-host-red uppercase mb-4 flex justify-between tracking-wide px-1">
                {path.name}
                <span className="text-gray-400 dark:text-gray-500 text-[10px] font-bold tracking-widest bg-white dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-100 dark:border-white/5">BRACKET</span>
            </h4>
            
            <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto pb-2 scrollbar-thin">
                {/* Semis Column */}
                <div className="flex flex-col gap-1 min-w-[240px]">
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-2 pl-1 tracking-wider">Semi-Finals</div>
                    {path.matches.semis.map((m, i) => (
                        <div key={i} className="relative">
                            <MatchRow match={m} isSemi />
                            {/* Connector Line Logic */}
                            <div className="absolute -right-4 top-1/2 w-4 h-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                            {i === 0 && <div className="absolute -right-4 top-1/2 w-px h-[calc(100%+16px)] bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>}
                        </div>
                    ))}
                </div>

                {/* Connector to Final */}
                <div className="w-4 sm:w-8 h-px bg-gray-300 dark:bg-gray-600 hidden sm:block mt-6"></div>

                {/* Final Column */}
                <div className="flex flex-col justify-center min-w-[240px]">
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-2 pl-1 tracking-wider">Final</div>
                    <MatchRow match={path.matches.final} />
                </div>
            </div>
        </div>
    );
};

export const Playoffs: React.FC<{ uefa: PlayoffPath[], inter: PlayoffPath[] }> = ({ uefa, inter }) => {
    return (
        <div className="space-y-8">
            <Card title="UEFA Play-offs" subTitle="Qualifying Path">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {uefa.map((path) => <PathCard key={path.name} path={path} />)}
                </div>
            </Card>

            <Card title="Inter-confederation Play-offs" subTitle="Final Spots">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {inter.map((path) => <PathCard key={path.name} path={path} />)}
                </div>
            </Card>
        </div>
    );
}
