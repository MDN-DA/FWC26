
import { ESPNResponse, UCLGroup, StandingEntry } from '../types';
import { countryMapping } from '../constants';

// Use a CORS proxy to bypass browser restrictions
// Switched to corsproxy.io for better reliability/uptime compared to allorigins
const CORS_PROXY = "https://corsproxy.io/?";

export const fetchData = async (
  url: string, 
  setData: (data: UCLGroup[] | StandingEntry[]) => void, 
  isGrouped: boolean
) => {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data: ESPNResponse = await response.json();

    if (data.children && data.children.length > 0) {
      const formattedGroups: UCLGroup[] = data.children.map(child => ({
        name: child.name,
        standings: {
          name: child.name,
          entries: child.standings.entries.map(entry => {
              // SYNCHRONISATION: Force country names to match internal constants
              const normalizedName = countryMapping[entry.team.name] || entry.team.name;
              return {
                  ...entry,
                  team: {
                      ...entry.team,
                      name: normalizedName,
                      displayName: normalizedName
                  }
              };
          })
        }
      }));
      setData(formattedGroups);
    } else if (data.standings) {
      setData(data.standings.entries);
    } else {
      console.warn("Unexpected API structure", data);
      setData([]);
    }
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    setData([]);
  }
};

export interface ScoreboardEvent {
    winner: string | null;
    status: string;
    scoreStr: string;
    minute?: string;
}

// Map "HomeTeam|AwayTeam" -> Event Data
export type ScoreboardMap = Record<string, ScoreboardEvent>;

export const fetchScoreboard = async (
    dates: string[], 
    callback: (results: ScoreboardMap) => void
) => {
    try {
        const promises = dates.map(date => 
            fetch(`${CORS_PROXY}${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${date}`)}`)
                .then(res => res.json())
                .catch(err => {
                    console.error(`Error fetching date ${date}`, err);
                    return null;
                })
        );

        const responses = await Promise.all(promises);
        
        const newResults: ScoreboardMap = {};

        responses.forEach(data => {
            if (data && data.events) {
                data.events.forEach((event: any) => {
                    const competition = event.competitions[0];
                    const statusType = event.status.type.name; // STATUS_FINAL, STATUS_SCHEDULED, STATUS_IN_PROGRESS
                    const minute = event.status.displayClock;
                    
                    const homeRaw = competition.competitors.find((c: any) => c.homeAway === 'home');
                    const awayRaw = competition.competitors.find((c: any) => c.homeAway === 'away');
                    
                    if (!homeRaw || !awayRaw) return;

                    // Normalize names to match our internal fixtures
                    const homeName = countryMapping[homeRaw.team.displayName] || homeRaw.team.displayName;
                    const awayName = countryMapping[awayRaw.team.displayName] || awayRaw.team.displayName;
                    
                    const scoreStr = `${homeRaw.score} - ${awayRaw.score}`;
                    let winner = null;

                    if (statusType === 'STATUS_FINAL') {
                        const scoreH = parseInt(homeRaw.score);
                        const scoreA = parseInt(awayRaw.score);
                        if (scoreH > scoreA) winner = homeName;
                        else if (scoreA > scoreH) winner = awayName;
                        else {
                            // Penalty logic usually comes here, simpler check for now
                            winner = "Draw"; 
                        }
                    }

                    // Create a unique key to map this result back to our fixtures
                    // We use both Home|Away and Away|Home to be safe
                    const key1 = `${homeName}|${awayName}`;
                    const key2 = `${awayName}|${homeName}`;

                    const eventData = {
                        winner,
                        status: statusType,
                        scoreStr,
                        minute
                    };

                    newResults[key1] = eventData;
                    newResults[key2] = eventData;
                });
            }
        });
        
        callback(newResults);
        
    } catch (error) {
        console.error("Error fetching scoreboard:", error);
    }
};
