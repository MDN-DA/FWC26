


export interface PlayoffMatch {
    date: string;
    time?: string;
    team1: { name: string; flag?: string };
    team2: { name: string; flag?: string };
    venue?: string;
    isFinal?: boolean;
}

export interface PlayoffPath {
    name: string;
    matches: {
        semis: PlayoffMatch[];
        final: PlayoffMatch;
    };
    winner?: string;
}

export const uefaPlayoffs: PlayoffPath[] = [
    {
        name: "Path A",
        matches: {
            semis: [
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Wales" }, team2: { name: "Bosnia" }, venue: "Cardiff" },
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Italy" }, team2: { name: "N. Ireland" }, venue: "Bergamo" }
            ],
            final: { date: "31 Mar 2026", time: "20:45", team1: { name: "Winner SF2" }, team2: { name: "Winner SF1" }, venue: "Cardiff or Zenica", isFinal: true }
        }
    },
    {
        name: "Path B",
        matches: {
            semis: [
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Ukraine" }, team2: { name: "Sweden" }, venue: "TBD" },
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Poland" }, team2: { name: "Albania" }, venue: "Warsaw" }
            ],
            final: { date: "31 Mar 2026", time: "20:45", team1: { name: "Winner SF3" }, team2: { name: "Winner SF4" }, venue: "TBD or Solna", isFinal: true }
        }
    },
    {
        name: "Path C",
        matches: {
            semis: [
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Slovakia" }, team2: { name: "Kosovo" }, venue: "Bratislava" },
                { date: "26 Mar 2026", time: "18:00", team1: { name: "Türkiye" }, team2: { name: "Romania" }, venue: "Istanbul" }
            ],
            final: { date: "31 Mar 2026", time: "20:45", team1: { name: "Winner SF6" }, team2: { name: "Winner SF5" }, venue: "Bratislava or Pristina", isFinal: true }
        }
    },
    {
        name: "Path D",
        matches: {
            semis: [
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Czechia" }, team2: { name: "Ireland" }, venue: "Praha" },
                { date: "26 Mar 2026", time: "20:45", team1: { name: "Denmark" }, team2: { name: "N. Macedonia" }, venue: "Copenhagen" }
            ],
            final: { date: "31 Mar 2026", time: "20:45", team1: { name: "Winner SF8" }, team2: { name: "Winner SF7" }, venue: "Praha or Dublin", isFinal: true }
        }
    }
];

export const interPlayoffs: PlayoffPath[] = [
     {
        name: "Pathway 1",
        matches: {
            semis: [
                 { date: "26 Mar 2026", time: "20:00", team1: { name: "New Caledonia" }, team2: { name: "Jamaica" }, venue: "Guadalajara 🇲🇽" }
            ],
            final: { date: "31 Mar 2026", time: "15:00", team1: { name: "DR Congo" }, team2: { name: "Winner Match 1" }, venue: "Guadalajara 🇲🇽", isFinal: true }
        }
    },
    {
        name: "Pathway 2",
        matches: {
            semis: [
                 { date: "26 Mar 2026", time: "17:00", team1: { name: "Bolivia" }, team2: { name: "Suriname" }, venue: "Monterrey 🇲🇽" }
            ],
            final: { date: "31 Mar 2026", time: "21:00", team1: { name: "Iraq" }, team2: { name: "Winner Match 2" }, venue: "Monterrey 🇲🇽", isFinal: true }
        }
    }
];

// Candidates for Simulator Dropdowns
// Keys MUST match the normalized name in constants.ts > countryMapping for the logic to work
export const playoffCandidates: Record<string, string[]> = {
    "Path A [UEFA]": ["Wales", "Bosnia", "Italy", "N. Ireland"],
    "Path B [UEFA]": ["Ukraine", "Sweden", "Poland", "Albania"],
    "Path C [UEFA]": ["Slovakia", "Kosovo", "Türkiye", "Romania"],
    "Path D [UEFA]": ["Czechia", "Ireland", "Denmark", "N. Macedonia"],
    "Pathway 1": ["New Caledonia", "Jamaica", "DR Congo"],
    "Pathway 2": ["Bolivia", "Suriname", "Iraq"]
};
