
// This file contains the logic for the combinations of 3rd place team allocations
// for the Round of 32 in the 2026 FIFA World Cup.

export type R32Pairings = {
    "1A": string;
    "1B": string;
    "1D": string;
    "1E": string;
    "1G": string;
    "1I": string;
    "1K": string;
    "1L": string;
};

export const getKnockoutPairings = (qualifyingGroups: string[]): R32Pairings | null => {
    // qualifyingGroups should be an array of strings like ["A", "B", "C", "D", "E", "F", "G", "H"]
    
    // Default fallback (Tournament start)
    if (!qualifyingGroups || qualifyingGroups.length !== 8) {
        return {
            "1A": "3C/E/F/H/I",
            "1B": "3E/F/G/I/J",
            "1D": "3B/E/F/I/J",
            "1E": "3A/B/C/D/F",
            "1G": "3A/E/H/I/J",
            "1I": "3C/D/F/G/H",
            "1K": "3D/E/I/J/L",
            "1L": "3E/H/I/J/K"
        };
    }

    const key = qualifyingGroups.sort().join("");

    // Partial table of combinations (Example logic)
    // The real table has 495 entries.
    const combinations: Record<string, R32Pairings> = {
        // Example: Groups A-H all qualify
        "ABCDEFGH": { "1A": "3E", "1B": "3H", "1D": "3G", "1E": "3I", "1G": "3D", "1I": "3J", "1K": "3F", "1L": "3K" }, 
        // Add more specific combinations as needed for simulation accuracy
    };

    if (combinations[key]) {
        return combinations[key];
    }

    // Algorithmic Fallback (Simulated distribution) if exact key missing
    // This assigns available 3rd places to group winners in a round-robin fashion for the UI
    const thirds = [...qualifyingGroups];
    return {
        "1A": `3${thirds[0] || '?'}`,
        "1B": `3${thirds[1] || '?'}`,
        "1D": `3${thirds[2] || '?'}`,
        "1E": `3${thirds[3] || '?'}`,
        "1G": `3${thirds[4] || '?'}`,
        "1I": `3${thirds[5] || '?'}`,
        "1K": `3${thirds[6] || '?'}`,
        "1L": `3${thirds[7] || '?'}`
    };
};
