
import { UCLGroup, StandingEntry, Fixture } from '../types';
import { R32Pairings } from '../data/combinations';

export const calculateBestThirds = (groups: UCLGroup[]): StandingEntry[] => {
    if (!groups || groups.length === 0) return [];

    const thirdPlaceTeams: StandingEntry[] = [];
    
    // Extract 3rd place from each group
    groups.forEach(group => {
        if (group && group.standings && group.standings.entries && group.standings.entries.length >= 3) {
            // Assuming API returns sorted array. Index 2 is 3rd place.
            const team = group.standings.entries[2]; 
            if (team) {
                // Create a copy with the group name added to abbreviation for display
                const teamCopy = { 
                    ...team, 
                    team: { 
                        ...team.team, 
                        abbreviation: `GRP ${group.name.replace('Group ', '')}` 
                    } 
                };
                thirdPlaceTeams.push(teamCopy);
            }
        }
    });

    // Sort: Points > GD > GF
    thirdPlaceTeams.sort((a, b) => {
        const getVal = (entry: StandingEntry, name: string) => entry.stats.find(s => s.name === name)?.value || 0;
        
        const ptsA = getVal(a, 'points');
        const ptsB = getVal(b, 'points');
        if (ptsA !== ptsB) return ptsB - ptsA;

        const gdA = getVal(a, 'pointDifferential');
        const gdB = getVal(b, 'pointDifferential');
        if (gdA !== gdB) return gdB - gdA;

        const gfA = getVal(a, 'pointsFor');
        const gfB = getVal(b, 'pointsFor');
        return gfB - gfA;
    });

    // Add rank stat to display
    return thirdPlaceTeams.map((entry, index) => ({
        ...entry,
        stats: [
            { name: 'rank', value: index + 1 },
            ...entry.stats.filter(s => s.name === 'rank')
        ]
    }));
};

export const hasGamesStarted = (groups: UCLGroup[]): boolean => {
    if (!groups) return false;
    let totalGames = 0;
    groups.forEach(group => {
        if (group && group.standings && group.standings.entries) {
            group.standings.entries.forEach(e => {
                const played = e.stats.find(s => s.name === 'gamesPlayed')?.value || 0;
                totalGames += played;
            });
        }
    });
    return totalGames > 0;
};

// Generate the key (e.g., "ABCDFGHJ") based on the current top 8 third-place teams
export const getQualifyingThirdsKey = (bestThirds: StandingEntry[]): string | null => {
    if (!bestThirds || bestThirds.length < 8) return null;
    
    const top8 = bestThirds.slice(0, 8);
    
    const groupLetters = top8.map(entry => {
        // We stored "GRP A" in abbreviation in calculateBestThirds
        const abbr = entry.team.abbreviation || ""; 
        return abbr.replace("GRP ", "").trim();
    });

    return groupLetters.sort().join("");
};

// Central Resolver Logic for Teams
export const resolveTeamName = (
    name: string, 
    groups: UCLGroup[] | undefined, 
    fixtures: Fixture[] | undefined, 
    results?: Record<number, { winner: string }>,
    pairings?: R32Pairings | null,
    homeTeamContext?: string,
    overrides?: Record<string, string> // New optional parameter for simulator
): string => {
    if (!name) return "?";

    // 0. Simulator Overrides (e.g. Winner Path A -> Ukraine)
    if (overrides && overrides[name]) return overrides[name];

    // 1. Winner of previous match (e.g., "W 73" or "W73")
    const matchWinnerMatch = name.match(/^W\s?(\d+)$/);
    if (matchWinnerMatch) {
        const matchId = parseInt(matchWinnerMatch[1]);
        if (results && results[matchId] && results[matchId].winner) {
            return results[matchId].winner;
        }
        return name; 
    }
    
    // Loser logic for Third Place match
    const matchLoserMatch = name.match(/^L\s?(\d+)$/);
    if (matchLoserMatch) {
         const matchId = parseInt(matchLoserMatch[1]);
         if (results && results[matchId] && results[matchId].winner && fixtures) {
             const fixture = fixtures.find(f => f.matchNumber === matchId);
             if (fixture) {
                 const home = resolveTeamName(fixture.homeTeam, groups, fixtures, results, pairings, undefined, overrides);
                 const away = resolveTeamName(fixture.awayTeam, groups, fixtures, results, pairings, fixture.homeTeam, overrides);
                 const winner = results[matchId].winner;
                 if (winner === home) return away;
                 if (winner === away) return home;
             }
         }
         return name;
    }

    // 2. Best 3rds logic (e.g., "3(A/B/C)")
    if (name.startsWith("3(") && pairings && homeTeamContext) {
        const opponentCode = pairings[homeTeamContext as keyof R32Pairings];
        if (opponentCode && opponentCode !== "TBD") {
             // Recursive call to resolve "3F" -> "Netherlands"
             return resolveTeamName(opponentCode, groups, fixtures, results, pairings, undefined, overrides);
        }
    }

    // 3. Group Rank (e.g., "1A", "2B", "3C")
    if (!groups || groups.length === 0) return name;

    const groupMatch = name.match(/^([123])([A-L])$/);
    if (groupMatch) {
        const rank = parseInt(groupMatch[1]);
        const groupLetter = groupMatch[2];
        
        const group = groups.find(g => g.name.endsWith(groupLetter));
        if (group && group.standings && group.standings.entries && group.standings.entries.length >= rank) {
             const sortedEntries = [...group.standings.entries].sort((a, b) => {
                 const rankA = a.stats.find(s => s.name === 'rank')?.value || 99;
                 const rankB = b.stats.find(s => s.name === 'rank')?.value || 99;
                 return rankA - rankB;
             });
             
             const entry = sortedEntries[rank - 1];
             if (entry) {
                 // Only show real name if they have played at least 3 games
                 // UNLESS we are in simulation mode (overrides object is present, even if empty), then always show
                 const gamesPlayed = entry.stats.find(s => s.name === 'gamesPlayed')?.value || 0;
                 if (gamesPlayed < 3 && !overrides) {
                     return name; 
                 }
                 return entry.team.name;
             }
        }
    }
    
    return name;
};
