
import React, { useState, useEffect, useMemo } from 'react';
import { UCLGroup, StandingEntry } from './types';
import { fetchData, fetchScoreboard } from './services/soccerService';
import { LeagueTable } from './components/LeagueTable';
import { Countdown } from './components/Countdown';
import { FixtureList } from './components/FixtureList';
import { Bracket } from './components/Bracket';
import { Playoffs } from './components/Playoffs';
import { Simulator } from './components/Simulator';
import { SplashScreen } from './components/SplashScreen';
import { Footer } from './components/Footer';
import { NavButton, FilterButton } from './components/Navigation';
import { BottomNav } from './components/BottomNav';
import { calculateBestThirds, hasGamesStarted, getQualifyingThirdsKey, resolveTeamName } from './utils/standingsUtils';
import { getKnockoutPairings, R32Pairings } from './data/combinations';
import { wcFixtures } from './data/fixtures';
import { uefaPlayoffs, interPlayoffs } from './data/playoffs';
import { competitionLogos } from './constants';
import { Card } from './components/ui';

type Tab = 'fixtures' | 'playoffs' | 'groups' | 'bracket' | 'simulator';
type FixtureFilter = 'all' | 'group' | 'knockout';

const App: React.FC = () => {
    const [worldCupStandings, setWorldCupStandings] = useState<UCLGroup[] | StandingEntry[]>([]);
    const [bestThirdPlaceData, setBestThirdPlaceData] = useState<StandingEntry[]>([]);
    const [liveScores, setLiveScores] = useState<Record<number, { winner: string, scoreStr: string, status: string, minute?: string }>>({});
    const [knockoutPairings, setKnockoutPairings] = useState<R32Pairings | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeTab, setActiveTab] = useState<Tab>('fixtures');
    const [fixtureFilter, setFixtureFilter] = useState<FixtureFilter>('all');
    const [showSplash, setShowSplash] = useState(true);
    const [gamesStarted, setGamesStarted] = useState(false);
    const [useLocalTime, setUseLocalTime] = useState(false);
    const [highlightedMatchId, setHighlightedMatchId] = useState<number | null>(null);
    
    // ISOLATION: playoffWinners n'est plus passé aux autres composants
    const [playoffWinners, setPlayoffWinners] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            let fetchedGroups: UCLGroup[] = [];
            let currentPairings: R32Pairings | null = null;

            await fetchData(
                "https://site.web.api.espn.com/apis/v2/sports/soccer/fifa.world/standings", 
                (data) => {
                    setWorldCupStandings(data);
                    if (Array.isArray(data) && data.length > 0 && 'standings' in data[0]) {
                         fetchedGroups = data as UCLGroup[];
                         setGamesStarted(hasGamesStarted(fetchedGroups));
                         const best3rds = calculateBestThirds(fetchedGroups);
                         setBestThirdPlaceData(best3rds);
                         const keyStr = getQualifyingThirdsKey(best3rds);
                         if (keyStr) {
                             currentPairings = getKnockoutPairings(keyStr.split(""));
                             setKnockoutPairings(currentPairings);
                         }
                    } else {
                        setBestThirdPlaceData(calculateBestThirds([]));
                        setGamesStarted(false);
                    }
                },
                true 
            );

            const datesToFetch = ["20260611-20260719", new Date().toISOString().slice(0, 10).replace(/-/g, "")];
            await fetchScoreboard(datesToFetch, (results) => {
                 const mappedScores: Record<number, any> = {};
                 wcFixtures.forEach(fixture => {
                     // Utilisation des noms résolus SANS overrides pour le mode réel
                     const homeResolved = resolveTeamName(fixture.homeTeam, fetchedGroups, wcFixtures, undefined, currentPairings);
                     const awayResolved = resolveTeamName(fixture.awayTeam, fetchedGroups, wcFixtures, undefined, currentPairings, fixture.homeTeam);
                     const key = `${homeResolved}|${awayResolved}`;
                     const keyReverse = `${awayResolved}|${homeResolved}`;
                     if (results[key]) mappedScores[fixture.matchNumber] = results[key];
                     else if (results[keyReverse]) mappedScores[fixture.matchNumber] = results[keyReverse];
                 });
                 setLiveScores(mappedScores);
            });
            setLoading(false);
        };
        loadData();
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []); // On ne recharge pas si playoffWinners change, isolation totale.

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    const handleJumpToMatch = (matchId: number) => {
        setActiveTab('fixtures');
        setFixtureFilter('all');
        setHighlightedMatchId(matchId);
        setTimeout(() => {
            const element = document.getElementById(`match-${matchId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => setHighlightedMatchId(null), 3000);
            }
        }, 150);
    };

    if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-roboto">
            <nav className="fixed w-full top-0 left-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center gap-3">
                            <img src={competitionLogos["World Cup"]} alt="Logo" className="h-8 sm:h-12 w-auto object-contain" />
                            <div className="flex flex-col justify-center">
                                <h1 className="flex flex-wrap gap-x-1.5 font-display font-black text-xl sm:text-2xl uppercase tracking-tighter drop-shadow-sm">
                                    <span className="text-black dark:text-white">FIFA</span>
                                    <span className="text-host-green">World</span>
                                    <span className="text-host-red">Cup</span>
                                    <span className="text-host-blue dark:text-blue-400">2026</span>
                                </h1>  
                                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mt-0.5 whitespace-nowrap">Unofficial Tracker • by Gunners-Stats</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={() => setUseLocalTime(!useLocalTime)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all ${useLocalTime ? 'bg-host-blue text-white border-host-blue shadow-md' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10'}`}>
                                <span className="text-base sm:text-lg leading-none">{useLocalTime ? '🕒' : '🏟️'}</span>
                                <span className="hidden sm:inline">{useLocalTime ? 'Local' : 'Venue'}</span>
                            </button>
                            <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-24 pb-20">
                {activeTab !== 'playoffs' && (
                    <div className="mb-8 animate-slideDown">
                        <Countdown groups={worldCupStandings as UCLGroup[]} liveScores={liveScores} pairings={knockoutPairings} onMatchClick={handleJumpToMatch} activeTab={activeTab} />
                    </div>
                )}

                <div className="animate-fadeIn">
                    {activeTab === 'fixtures' && <FixtureList fixtures={wcFixtures} filter={fixtureFilter} liveScores={liveScores} groups={worldCupStandings as UCLGroup[]} pairings={knockoutPairings} useLocalTime={useLocalTime} highlightedMatchId={highlightedMatchId} />}
                    {activeTab === 'playoffs' && <Playoffs uefa={uefaPlayoffs} inter={interPlayoffs} useLocalTime={useLocalTime} liveScores={liveScores as any} />}
                    {activeTab === 'groups' && (
                        <div className="space-y-6">
                            <LeagueTable title="Group Stage Standings" standings={worldCupStandings} cols={3} />
                            <LeagueTable title="Best 3rd Place Teams" standings={bestThirdPlaceData} solidCutoffs={[8]} />
                        </div>
                    )}
                    {activeTab === 'bracket' && <Bracket fixtures={wcFixtures} groups={worldCupStandings as UCLGroup[]} results={liveScores} pairings={knockoutPairings} />}
                    {activeTab === 'simulator' && (
                        <Card title="Tournament Simulator" subTitle="Predict the Outcomes">
                            <Simulator initialGroups={worldCupStandings as UCLGroup[]} initialPlayoffWinners={playoffWinners} onPlayoffSync={setPlayoffWinners} />
                        </Card>
                    )}
                </div>
                <Footer />
            </main>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;
