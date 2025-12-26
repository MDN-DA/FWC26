
import { UCLGroup, StandingEntry, Fixture } from '../types';
import { R32Pairings } from '../data/combinations';

export const calculateBestThirds = (groups: UCLGroup[]): StandingEntry[] => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const now = new Date();
    const releaseDate = new Date('2026-06-18T00:00:00Z');
    const isPastRelease = now >= releaseDate;
    const started = hasGamesStarted(groups);

    if (!groups || groups.length === 0 || !started || !isPastRelease) {
        return letters.map((l, i) => ({
            team: { id: `3${l}`, name: `3${l}`, displayName: `3${l}`, abbreviation: `GRP ${l}` },
            stats: [
                { name: 'rank', value: i + 1, displayValue: (i + 1).toString() },
                { name: 'points', value: 0, displayValue: "0" },
                { name: 'gamesPlayed', value: 0, displayValue: "0" },
                { name: 'wins', value: 0, displayValue: "0" },
                { name: 'ties', value: 0, displayValue: "0" },
                { name: 'losses', value: 0, displayValue: "0" },
                { name: 'pointDifferential', value: 0, displayValue: "0" },
                { name: 'pointsFor', value: 0, displayValue: "0" }
            ]
        } as unknown as StandingEntry));
    }

    const thirdPlaceTeams: StandingEntry[] = [];
    groups.forEach(group => {
        if (group?.standings?.entries?.length >= 3) {
            const team = group.standings.entries[2]; 
            if (team) {
                thirdPlaceTeams.push({ 
                    ...team, 
                    team: { ...team.team, abbreviation: `GRP ${group.name.replace('Group ', '')}` } 
                });
            }
        }
    });

    thirdPlaceTeams.sort((a, b) => {
        const getVal = (entry: StandingEntry, name: string) => entry.stats.find(s => s.name === name)?.value || 0;
        if (getVal(a, 'points') !== getVal(b, 'points')) return getVal(b, 'points') - getVal(a, 'points');
        if (getVal(a, 'pointDifferential') !== getVal(b, 'pointDifferential')) return getVal(b, 'pointDifferential') - getVal(a, 'pointDifferential');
        return getVal(b, 'pointsFor') - getVal(a, 'pointsFor');
    });

    return thirdPlaceTeams.map((entry, index) => ({
        ...entry,
        stats: [{ name: 'rank', value: index + 1 }, ...entry.stats.filter(s => s.name === 'rank')]
    }));
};

export const hasGamesStarted = (groups: UCLGroup[]): boolean => {
    if (!groups || groups.length === 0) return false;
    let totalGames = 0;
    groups.forEach(group => {
        group?.standings?.entries?.forEach(e => {
            totalGames += e.stats.find(s => s.name === 'gamesPlayed')?.value || 0;
        });
    });
    return totalGames > 0;
};

export const getQualifyingThirdsKey = (bestThirds: StandingEntry[]): string | null => {
    if (!bestThirds || bestThirds.length < 8) return "ABCDEFGH"; 
    const top8 = bestThirds.slice(0, 8);
    const isReady = top8.every(e => !e.team.name.match(/^3[A-L]$/));
    if (!isReady) return "ABCDEFGH";
    return top8.map(entry => (entry.team.abbreviation || "").replace("GRP ", "").trim()).sort().join("");
};

export const resolveTeamName = (
    name: string, 
    groups: UCLGroup[] | undefined, 
    fixtures: Fixture[] | undefined, 
    results?: Record<number, { winner: string }>,
    pairings?: R32Pairings | null,
    homeTeamContext?: string,
    overrides?: Record<string, string>
): string => {
    if (!name) return "?";
    if (overrides && overrides[name]) return overrides[name];

    const now = new Date();
    const releaseDate = new Date('2026-06-18T00:00:00Z');
    const tournamentStartDate = new Date('2026-06-11T00:00:00Z');
    const isSimulation = overrides && Object.keys(overrides).length > 0;
    const isPastRelease = now >= releaseDate;
    const isTournamentStarted = now >= tournamentStartDate;

    // 1. Resolution des vainqueurs de matchs (W74, W89...)
    const matchWinnerMatch = name.match(/^W\s?(\d+)$/);
    if (matchWinnerMatch) {
        const matchId = parseInt(matchWinnerMatch[1]);
        if (results && results[matchId]?.winner) return results[matchId].winner;
        return name; 
    }
    
    // 2. Resolution des perdants de matchs (L101, L102...)
    const matchLoserMatch = name.match(/^L\s?(\d+)$/);
    if (matchLoserMatch) {
         const matchId = parseInt(matchLoserMatch[1]);
         if (results?.[matchId]?.winner && fixtures) {
             const f = fixtures.find(fx => fx.matchNumber === matchId);
             if (f) {
                 const h = resolveTeamName(f.homeTeam, groups, fixtures, results, pairings, undefined, overrides);
                 const a = resolveTeamName(f.awayTeam, groups, fixtures, results, pairings, f.homeTeam, overrides);
                 return results[matchId].winner === h ? a : h;
             }
         }
         return name;
    }

    // 3. Resolution des 3èmes places complexes
    if (name.startsWith("3(") || name.startsWith("3A") || name.startsWith("3C")) {
        // En mode simulator ou après MD3
        if (pairings && homeTeamContext) {
             const opponentCode = pairings[homeTeamContext as keyof R32Pairings];
             if (opponentCode && opponentCode.startsWith("3")) {
                  // On tente de resoudre le code spécifique du pairing (ex: 3E)
                  const letter = opponentCode.slice(-1);
                  const grp = groups?.find(g => g.name.endsWith(letter));
                  if (grp && grp.standings.entries.length >= 3 && (isSimulation || (isTournamentStarted && isPastRelease))) {
                      return grp.standings.entries[2].team.name;
                  }
             }
        }
    }

    // 4. Resolution des Group Winners / Runners up (1A, 2B...)
    const groupMatch = name.match(/^([123])([A-L])$/);
    if (groupMatch && groups?.length) {
        const rank = parseInt(groupMatch[1]);
        const letter = groupMatch[2];
        const group = groups.find(g => g.name.endsWith(letter));
        if (group?.standings?.entries?.length >= rank) {
             const sorted = [...group.standings.entries].sort((a, b) => 
                (a.stats.find(s => s.name === 'rank')?.value || 99) - (b.stats.find(s => s.name === 'rank')?.value || 99)
             );
             const entry = sorted[rank - 1];
             if (entry && (isSimulation || (isTournamentStarted && isPastRelease && (entry.stats.find(s => s.name === 'gamesPlayed')?.value || 0) >= 2))) {
                 return entry.team.name;
             }
        }
    }
    
    return name;
};
