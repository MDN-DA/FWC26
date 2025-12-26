
import React from 'react';
import { StandingEntry, UCLGroup, Stat } from '../types';
import { Card } from './ui';
import { countryMapping, getFlagCode } from '../constants';

export const LeagueTable: React.FC<{ 
    title: React.ReactNode; 
    subTitle?: string;
    standings: StandingEntry[] | UCLGroup[]; 
    isUCL?: boolean; 
    solidCutoffs?: number[]; 
    dottedCutoffs?: number[];
    customCutoffs?: number[]; 
    cols?: number; 
    id?: string;
    logo?: string;
    overrides?: Record<string, string>;
}> = ({ title, subTitle, standings, isUCL, solidCutoffs, dottedCutoffs, customCutoffs, cols = 1, id, logo, overrides }) => {
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'rank', direction: 'asc' });

    const isGroupedDataRaw = Array.isArray(standings) && standings.length > 0 && 'standings' in standings[0] && 'name' in standings[0];
    const renderAsGrid = isGroupedDataRaw && standings.length > 1;

    if (!standings || standings.length === 0) {
        return <Card title={title} id={id} logo={logo}><div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-host-blue"></div></div></Card>;
    }

    const getStatValue = (entry: StandingEntry, statName: string) => {
        return entry.stats.find((s: Stat) => s.name === statName)?.value ?? 0;
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else if (['rank', 'losses', 'pointsAgainst'].includes(key)) {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const headers: { key: string; label: string; className?: string, sortable: boolean }[] = [
        { key: 'rank', label: 'Pos', sortable: true, className: 'sticky left-0 z-10 bg-white/95 dark:bg-dark-card/95 w-8 text-center' },
        { key: 'club', label: 'Team', sortable: false, className: 'sticky left-8 z-10 bg-white/95 dark:bg-dark-card/95 shadow-[1px_0_2px_-1px_rgba(0,0,0,0.1)] pl-2' },
        { key: 'gamesPlayed', label: 'P', sortable: false },
        { key: 'wins', label: 'W', sortable: true },
        { key: 'ties', label: 'D', sortable: true },
        { key: 'losses', label: 'L', sortable: true },
        { key: 'pointsFor', label: 'GF', sortable: true, className: 'hidden sm:table-cell' },
        { key: 'pointsAgainst', label: 'GA', sortable: true, className: 'hidden sm:table-cell' },
        { key: 'pointDifferential', label: 'GD', sortable: true },
        { key: 'points', label: 'Pts', sortable: true },
    ];

    const renderTableBody = (entries: StandingEntry[], isMini = false) => {
        const sortedEntries = [...entries];
        if (sortConfig !== null) {
            sortedEntries.sort((a, b) => {
                const aValue = getStatValue(a, sortConfig.key) || (sortConfig.key === 'rank' ? 999 : 0);
                const bValue = getStatValue(b, sortConfig.key) || (sortConfig.key === 'rank' ? 999 : 0);
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return (
        <tbody className="divide-y divide-gray-200/50 dark:divide-dark-border/50">
            {sortedEntries.map((entry: StandingEntry, index: number) => {
                const rawName = entry.team.name;
                const resolvedName = (overrides && overrides[rawName]) || rawName;
                const displayName = countryMapping[resolvedName] || resolvedName;
                const flagCode = getFlagCode(resolvedName);

                const rank = getStatValue(entry, 'rank') || (index + 1);
                const isHost = ['Mexico', 'Canada', 'USA', 'United States'].includes(resolvedName);

                const renderSeparator = () => {
                    let Separator = null;
                    if (sortConfig?.key === 'rank' && sortConfig.direction === 'asc') {
                        if (solidCutoffs?.includes(rank)) {
                            Separator = <div className="h-0.5 bg-black/50 dark:bg-gray-600/80 my-0.5"></div>;
                        } else if (dottedCutoffs?.includes(rank)) {
                            Separator = <div className="h-px border-t border-dashed border-gray-400/70 dark:border-gray-700/70 my-0.5"></div>;
                        } else if (customCutoffs?.includes(rank)) {
                            Separator = <div className="h-0.5 bg-black/50 dark:bg-gray-600/80 my-0.5"></div>;
                        } else if (!solidCutoffs && !dottedCutoffs && !customCutoffs) {
                             if (!isMini && rank === 2) Separator = <div className="h-px border-t border-dashed border-gray-400/70 dark:border-gray-700/70 my-0.5"></div>;
                        }
                    }
                    return Separator ? <tr><td colSpan={headers.length} className="p-0">{Separator}</td></tr> : null;
                };
                
                const gd = getStatValue(entry, 'pointDifferential');
                const cellPadding = isMini ? 'p-2' : 'p-1.5';
                const flagSize = isMini ? 'w-[22px] h-[16px]' : 'w-[16px] h-[12px]';

                return (
                <React.Fragment key={entry.team.id}>
                <tr className={`group transition-colors duration-200 even:bg-black/5 dark:even:bg-white/5 ${isHost ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-white/30 dark:hover:bg-white/10'}`}>
                    <td className={`${cellPadding} text-center sticky left-0 font-medium ${isHost ? 'bg-blue-50/95 dark:bg-blue-900/20' : 'bg-white/95 dark:bg-dark-card/95 group-even:bg-gray-50/95 dark:group-even:bg-dark-card/95'}`}>{rank}</td>
                    <td className={`${cellPadding} sticky left-8 ${isHost ? 'bg-blue-50/95 dark:bg-blue-900/20' : 'bg-white/95 dark:bg-dark-card/95 group-even:bg-gray-50/95 dark:group-even:bg-dark-card/95'} shadow-[1px_0_2px_-1px_rgba(0,0,0,0.1)] pl-2`}>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                {flagCode && (
                                    <img 
                                        src={`https://flagcdn.com/w40/${flagCode}.png`} 
                                        alt={`Flag of ${resolvedName}`}
                                        className={`${flagSize} rounded-[2px] shadow-sm object-cover`} 
                                    />
                                )}
                                <span className={`min-w-0 truncate max-w-[120px] sm:max-w-none font-bold ${isHost ? 'text-host-blue dark:text-blue-400' : ''}`} title={resolvedName}>
                                    {displayName}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className={`${cellPadding} text-center`}>{getStatValue(entry, 'gamesPlayed')}</td>
                    <td className={`${cellPadding} text-center font-bold text-green-600 dark:text-green-400`}>{getStatValue(entry, 'wins')}</td>
                    <td className={`${cellPadding} text-center font-bold text-orange-500`}>{getStatValue(entry, 'ties')}</td>
                    <td className={`${cellPadding} text-center font-bold text-red-600 dark:text-red-400`}>{getStatValue(entry, 'losses')}</td>
                    <td className={`${cellPadding} text-center hidden sm:table-cell`}>{getStatValue(entry, 'pointsFor')}</td>
                    <td className={`${cellPadding} text-center hidden sm:table-cell`}>{getStatValue(entry, 'pointsAgainst')}</td>
                    <td className={`${cellPadding} text-center font-bold ${gd > 0 ? 'text-green-600 dark:text-green-400' : gd < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{entry.stats.find((s: Stat) => s.name === 'pointDifferential')?.displayValue}</td>
                    <td className={`${cellPadding} text-center font-black ${isHost ? 'text-host-blue dark:text-blue-400' : ''}`}>{getStatValue(entry, 'points')}</td>
                </tr>
                {renderSeparator()}
                </React.Fragment>
            )})}
        </tbody>
        );
    };
    
    if (renderAsGrid) {
        let gridClass = "grid-cols-1 md:grid-cols-2";
        if (cols === 3) gridClass = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
        if (cols === 4) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

        return (
            <Card title={title} subTitle={subTitle} id={id} contentClassName="p-3" logo={logo}>
                <div className={`grid ${gridClass} gap-6 relative z-10`}>
                    {(standings as UCLGroup[]).map((group) => (
                        <div key={group.name} className="bg-gray-50/80 dark:bg-dark-border/20 rounded-xl p-3 backdrop-blur-sm border border-white/20 shadow-sm transition-all hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-md duration-300">
                            <h4 className="text-sm font-black text-host-blue dark:text-white mb-3 uppercase border-b-2 border-gray-200 dark:border-white/10 pb-2 flex justify-between tracking-wide">
                                <span>{group.name}</span>
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm text-left font-roboto">
                                    <thead className="text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
                                        <tr>
                                            {headers.map(h => (
                                                 <th key={h.key} className={`p-1.5 ${h.className || ''}`}>{h.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    {renderTableBody(group.standings.entries, true)}
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    let flatEntries: StandingEntry[] = [];
    if (isGroupedDataRaw && !renderAsGrid) {
        flatEntries = (standings as UCLGroup[])[0].standings.entries;
    } else {
        flatEntries = standings as StandingEntry[];
    }

    return (
        <Card title={title} subTitle={subTitle} id={id} contentClassName="p-0 sm:p-0" logo={logo}>
            <div className="overflow-auto max-h-[600px] p-0 relative z-10 scrollbar-thin">
                <table className="w-full text-xs sm:text-sm text-left font-roboto border-collapse">
                    <thead className="text-gray-500 dark:text-gray-400 uppercase text-[10px] sm:text-xs font-semibold bg-white/95 dark:bg-dark-card/95 sticky top-0 z-20 shadow-sm">
                        <tr>
                            {headers.map(h => (
                                <th 
                                    key={h.key} 
                                    className={`p-1.5 ${h.sortable ? 'cursor-pointer hover:text-gray-800 dark:hover:text-gray-200' : ''} ${h.className || ''}`} 
                                    onClick={() => h.sortable && requestSort(h.key)}
                                >
                                    <div className={`flex items-center justify-center ${h.key === 'club' ? 'justify-start' : ''}`}>
                                        {h.label}
                                        {sortConfig && sortConfig.key === h.key && (
                                            <span className="ml-0.5">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {renderTableBody(flatEntries)}
                </table>
            </div>
        </Card>
    );
};
