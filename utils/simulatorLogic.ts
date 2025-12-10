

import { UCLGroup, StandingEntry } from '../types';
import { groupFixtures } from '../data/groupFixtures';
import { countryMapping } from '../constants';

// Type pour les scores simulés: { matchId: { home: 2, away: 1 } }
export type SimulatedScores = Record<number, { home: number | string; away: number | string }>;

// Fonction principale pour recalculer les classements
export const calculateSimulatedStandings = (
    originalGroups: UCLGroup[],
    simScores: SimulatedScores,
    playoffMapping?: Record<string, string>
): UCLGroup[] => {
    // 1. Deep copy des groupes pour ne pas modifier l'état original
    const newGroups: UCLGroup[] = JSON.parse(JSON.stringify(originalGroups));

    // 2. Initialiser tous les stats à 0
    newGroups.forEach(group => {
        group.standings.entries.forEach(entry => {
            resetStats(entry);
        });
    });

    // 3. Parcourir tous les matchs de groupe et appliquer les scores
    groupFixtures.forEach(fixture => {
        const score = simScores[fixture.matchNumber];
        
        // Si pas de score entré, on passe
        if (!score || score.home === '' || score.away === '') return;

        const hScore = typeof score.home === 'string' ? parseInt(score.home) : score.home;
        const aScore = typeof score.away === 'string' ? parseInt(score.away) : score.away;

        if (isNaN(hScore) || isNaN(aScore)) return;

        // RESOLUTION LOGIC
        // 1. Normalize the name from the fixture (e.g., "Winner Path A" -> "Path A [UEFA]")
        const homeNormalized = countryMapping[fixture.homeTeam] || fixture.homeTeam;
        const awayNormalized = countryMapping[fixture.awayTeam] || fixture.awayTeam;

        // 2. Check if this team has been mapped in the Simulator Setup (e.g. "Path A [UEFA]" -> "Italy")
        const homeFinal = playoffMapping?.[homeNormalized] || homeNormalized;
        const awayFinal = playoffMapping?.[awayNormalized] || awayNormalized;

        // 3. Find the teams in the groups using the FINAL resolved name
        const homeEntry = findTeamEntry(newGroups, homeFinal);
        const awayEntry = findTeamEntry(newGroups, awayFinal);

        if (homeEntry && awayEntry) {
            updateEntryStats(homeEntry, hScore, aScore);
            updateEntryStats(awayEntry, aScore, hScore);
        }
    });

    // 4. Trier les classements (Points > Différence > Buts Pour)
    newGroups.forEach(group => {
        group.standings.entries.sort((a, b) => {
            const ptsA = getStat(a, 'points');
            const ptsB = getStat(b, 'points');
            if (ptsA !== ptsB) return ptsB - ptsA;

            const gdA = getStat(a, 'pointDifferential');
            const gdB = getStat(b, 'pointDifferential');
            if (gdA !== gdB) return gdB - gdA;

            const gfA = getStat(a, 'pointsFor');
            const gfB = getStat(b, 'pointsFor');
            return gfB - gfA;
        });

        // Mettre à jour les rangs visuels
        group.standings.entries.forEach((entry, idx) => {
            setStat(entry, 'rank', idx + 1);
        });
    });

    return newGroups;
};

// Helpers
const findTeamEntry = (groups: UCLGroup[], teamName: string): StandingEntry | undefined => {
    for (const group of groups) {
        // Recherche souple (nom ou display name)
        const entry = group.standings.entries.find(e => 
            e.team.name === teamName || 
            e.team.displayName === teamName
        );
        if (entry) return entry;
    }
    return undefined;
};

const getStat = (entry: StandingEntry, name: string): number => {
    return entry.stats.find(s => s.name === name)?.value || 0;
};

const setStat = (entry: StandingEntry, name: string, value: number) => {
    const stat = entry.stats.find(s => s.name === name);
    if (stat) {
        stat.value = value;
        stat.displayValue = value.toString();
    } else {
        entry.stats.push({ name, value, displayValue: value.toString() });
    }
};

const resetStats = (entry: StandingEntry) => {
    setStat(entry, 'gamesPlayed', 0);
    setStat(entry, 'wins', 0);
    setStat(entry, 'ties', 0);
    setStat(entry, 'losses', 0);
    setStat(entry, 'pointsFor', 0);
    setStat(entry, 'pointsAgainst', 0);
    setStat(entry, 'pointDifferential', 0);
    setStat(entry, 'points', 0);
};

const updateEntryStats = (entry: StandingEntry, goalsFor: number, goalsAgainst: number) => {
    setStat(entry, 'gamesPlayed', getStat(entry, 'gamesPlayed') + 1);
    setStat(entry, 'pointsFor', getStat(entry, 'pointsFor') + goalsFor);
    setStat(entry, 'pointsAgainst', getStat(entry, 'pointsAgainst') + goalsAgainst);
    setStat(entry, 'pointDifferential', getStat(entry, 'pointDifferential') + (goalsFor - goalsAgainst));

    if (goalsFor > goalsAgainst) {
        setStat(entry, 'wins', getStat(entry, 'wins') + 1);
        setStat(entry, 'points', getStat(entry, 'points') + 3);
    } else if (goalsFor === goalsAgainst) {
        setStat(entry, 'ties', getStat(entry, 'ties') + 1);
        setStat(entry, 'points', getStat(entry, 'points') + 1);
    } else {
        setStat(entry, 'losses', getStat(entry, 'losses') + 1);
    }
};