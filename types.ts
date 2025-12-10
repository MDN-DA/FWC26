
export interface Logo {
  href: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface Team {
  id: string;
  uid?: string;
  location?: string;
  name: string;
  abbreviation?: string;
  displayName?: string;
  shortDisplayName?: string;
  isActive?: boolean;
  logos?: Logo[];
}

export interface Stat {
  name: string;
  displayName?: string;
  shortDisplayName?: string;
  description?: string;
  abbreviation?: string;
  type?: string;
  value?: number;
  displayValue?: string;
}

export interface StandingEntry {
  team: Team;
  stats: Stat[];
  link?: string;
}

export interface StandingsData {
  name: string;
  displayName?: string;
  entries: StandingEntry[];
}

export interface UCLGroup {
  name: string;
  standings: StandingsData;
}

// Helper type for the raw API response from ESPN
export interface ESPNResponse {
  children?: {
    name: string;
    abbreviation: string;
    standings: {
      entries: StandingEntry[];
    };
  }[];
  // Fallback if not grouped
  standings?: {
    entries: StandingEntry[];
  };
}

export interface OptaData {
  team: string;
  xPts: number;
  title?: string;
  ucl?: string;
  winner?: string;
  qf?: string;
  sf?: string;
  final?: string;
}

export interface Fixture {
    matchNumber: number;
    round: string;
    date: string;
    time: string; // GMT
    homeTeam: string;
    awayTeam: string;
    venue: string;
    city: string;
}
