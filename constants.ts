

// Mapping pour normaliser les noms de pays de l'API ESPN vers nos noms standardisés
export const countryMapping: Record<string, string> = {
    // North America
    "United States": "USA",
    "United States of America": "USA",
    "Costa Rica": "Costa Rica",
    "Haiti": "Haiti",
    "Jamaica": "Jamaica",
    "Panama": "Panama",
    
    // South America
    "Bolivia": "Bolivia",
    "Ecuador": "Ecuador",
    "Paraguay": "Paraguay",
    "Peru": "Peru",
    "Uruguay": "Uruguay",
    "Venezuela": "Venezuela",
    
    // Europe
    "Bosnia and Herzegovina": "Bosnia",
    "Bosnia-Herzegovina": "Bosnia",
    "Czechia": "Czechia",
    "Czech Republic": "Czechia",
    "Denmark": "Denmark",
    "North Macedonia": "N. Macedonia",
    "Northern Ireland": "N. Ireland",
    "Republic of Ireland": "Ireland",
    "Ireland Republic": "Ireland",
    "Romania": "Romania",
    "Scotland": "Scotland",
    "Slovakia": "Slovakia",
    "Slovenia": "Slovenia",
    "Sweden": "Sweden",
    "Switzerland": "Switzerland",
    "Turkey": "Türkiye",
    "Türkiye": "Türkiye",
    "Ukraine": "Ukraine",
    "Wales": "Wales",
    
    // Africa
    "Algeria": "Algeria",
    "Burkina Faso": "Burkina Faso",
    "Cabo Verde": "Cabo Verde",
    "Cape Verde": "Cabo Verde",
    "Cameroon": "Cameroon",
    "Central African Republic": "CAR",
    "Congo DR": "DR Congo",
    "Democratic Republic of the Congo": "DR Congo",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "Ivory Coast": "Côte d'Ivoire",
    "Egypt": "Egypt",
    "Equatorial Guinea": "Eq. Guinea",
    "Ghana": "Ghana",
    "Guinea": "Guinea",
    "Mali": "Mali",
    "Morocco": "Morocco",
    "Nigeria": "Nigeria",
    "Senegal": "Senegal",
    "South Africa": "South Africa",
    "Tunisia": "Tunisia",
    "Zambia": "Zambia",

    // Asia / Oceania
    "Australia": "Australia",
    "China PR": "China",
    "China": "China",
    "Iran": "IR Iran",
    "Iraq": "Iraq",
    "Japan": "Japan",
    "Jordan": "Jordan",
    "Korea Republic": "South Korea",
    "South Korea": "South Korea",
    "Kyrgyzstan": "Kyrgyzstan",
    "New Zealand": "New Zealand",
    "Oman": "Oman",
    "Qatar": "Qatar",
    "Saudi Arabia": "Saudi Arabia",
    "United Arab Emirates": "UAE",
    "Uzbekistan": "Uzbekistan",

    // Placeholders / Playoffs (Standardized to Match Group Standings Names)
    "Winner Playoff Path A": "Path A [UEFA]",
    "Winner Path A": "Path A [UEFA]",
    "Winner Playoff Path B": "Path B [UEFA]",
    "Winner Path B": "Path B [UEFA]",
    "Winner Playoff Path C": "Path C [UEFA]",
    "Winner Path C": "Path C [UEFA]",
    "Winner Playoff Path D": "Path D [UEFA]",
    "Winner Path D": "Path D [UEFA]",
    "Intercontinental Playoff Path 1": "Pathway 1",
    "Winner Pathway 1": "Pathway 1",
    "Winner of Intercontinental Playoff Path 1": "Pathway 1",
    "WINNER OF INTERCONTINENTAL PLAYOFF PATH 1": "Pathway 1",
    "Intercontinental Playoff Path 2": "Pathway 2",
    "Winner Pathway 2": "Pathway 2",
    "Winner of Intercontinental Playoff Path 2": "Pathway 2",
    "WINNER OF INTERCONTINENTAL PLAYOFF PATH 2": "Pathway 2"
};

// Map teams to groups for filtering
// Updated to only include Qualified Teams and Placeholders (removed specific playoff contenders)
export const GROUPS: Record<string, string[]> = {
    "A": ["Mexico", "South Africa", "South Korea", "Winner Path D", "Path D [UEFA]"],
    "B": ["Canada", "Winner Path A", "Path A [UEFA]", "Qatar", "Switzerland"],
    "C": ["Haiti", "Scotland", "Brazil", "Morocco"],
    "D": ["USA", "Paraguay", "Australia", "Winner Path C", "Path C [UEFA]"],
    "E": ["Côte d'Ivoire", "Ecuador", "Germany", "Curaçao"],
    "F": ["Netherlands", "Japan", "Winner Path B", "Path B [UEFA]", "Tunisia"],
    "G": ["IR Iran", "New Zealand", "Belgium", "Egypt"],
    "H": ["Saudi Arabia", "Uruguay", "Spain", "Cabo Verde"],
    "I": ["France", "Senegal", "Winner Pathway 2", "Pathway 2", "Norway"],
    "J": ["Argentina", "Algeria", "Austria", "Jordan"],
    "K": ["Portugal", "Winner Pathway 1", "Pathway 1", "Uzbekistan", "Colombia"],
    "L": ["Ghana", "Panama", "England", "Croatia"]
};

// UTC Offsets for Host Cities (Standard Time / Daylight Time considerations for June)
// Mexico (UTC-6 for CDMX/Guadalajara/Monterrey)
// USA/Canada (EDT UTC-4, CDT UTC-5, PDT UTC-7)
export const CITY_TIMEZONES: Record<string, number> = {
    "Mexico City": -6,
    "Guadalajara": -6,
    "Monterrey": -6,
    "Zapopan": -6,
    "Guadalupe": -6,
    "Toronto": -4,
    "Vancouver": -7,
    "Los Angeles": -7,
    "San Francisco": -7,
    "Santa Clara": -7,
    "Seattle": -7,
    "New York/NJ": -4,
    "New York": -4,
    "Boston": -4,
    "Philadelphia": -4,
    "Miami": -4,
    "Atlanta": -4,
    "Dallas": -5,
    "Houston": -5,
    "Kansas City": -5
};

export const clubLogos: Record<string, string> = {
  // Add manual overrides here if needed
};

export const competitionLogos: Record<string, string> = {
  "World Cup": "https://i.postimg.cc/QNcBC3sT/FWC26.png"
};

export const BRAND_LOGO = "https://i.postimg.cc/QNcBC3sT/FWC26.png"; 

// Helper to map country names to ISO codes for FlagCDN
export const getFlagCode = (teamName: string): string | null => {
    if (!teamName) return null;
    const lower = teamName.toLowerCase().trim();
    // Helper to catch "Winner Path X" etc
    if (lower.includes("winner") || lower.includes("path") || lower.includes("pathway")) return null;
    // Catch short codes like "1A", "2B"
    if (lower.match(/^\d[a-z]$/)) return null;
    // Catch matchup codes like "w73"
    if (lower.match(/^w\s?\d+$/) || lower.match(/^l\s?\d+$/)) return null;

    const map: Record<string, string> = {
        "argentina": "ar", "australia": "au", "austria": "at", "belgium": "be",
        "brazil": "br", "cameroon": "cm", "canada": "ca", "costa rica": "cr",
        "croatia": "hr", "denmark": "dk", "ecuador": "ec", "england": "gb-eng",
        "france": "fr", "germany": "de", "ghana": "gh", "iran": "ir", "ir iran": "ir",
        "japan": "jp", "mexico": "mx", "morocco": "ma", "netherlands": "nl",
        "poland": "pl", "portugal": "pt", "qatar": "qa", "saudi arabia": "sa",
        "senegal": "sn", "serbia": "rs", "south korea": "kr", "korea republic": "kr", "spain": "es",
        "switzerland": "ch", "tunisia": "tn", "united states": "us", "usa": "us",
        "uruguay": "uy", "wales": "gb-wls", "ukraine": "ua", "scotland": "gb-sct",
        "italy": "it", "sweden": "se", "czechia": "cz", "czech republic": "cz", "turkey": "tr", "türkiye": "tr",
        "romania": "ro", "slovakia": "sk", "norway": "no", "ireland": "ie", "republic of ireland": "ie",
        "northern ireland": "gb-nir", "n. ireland": "gb-nir", 
        "bosnia and herzegovina": "ba", "bosnia": "ba",
        "north macedonia": "mk", "n. macedonia": "mk",
        "albania": "al", "israel": "il", "colombia": "co",
        "chile": "cl", "peru": "pe", "paraguay": "py", "venezuela": "ve",
        "bolivia": "bo", "egypt": "eg", "algeria": "dz", "nigeria": "ng",
        "ivory coast": "ci", "cote d'ivoire": "ci", "côte d'ivoire": "ci", "mali": "ml", "south africa": "za",
        "dr congo": "cd", "congo dr": "cd", "new caledonia": "nc", "jamaica": "jm",
        "suriname": "sr", "iraq": "iq", "new zealand": "nz", "fiji": "fj",
        "panama": "pa", "honduras": "hn", "el salvador": "sv", "slovenia": "si",
        "hungary": "hu", "georgia": "ge", "iceland": "is", "finland": "fi",
        "cabo verde": "cv", "cape verde": "cv", "uzbekistan": "uz", "jordan": "jo", "haiti": "ht",
        "curaçao": "cw", "curacao": "cw", "guinea": "gn", "kosovo": "xk", "burkina faso": "bf", "zambia": "zm", "uae": "ae", "united arab emirates": "ae", "oman": "om", "kyrgyzstan": "kg", "china": "cn", "china pr": "cn"
    };
    return map[lower] || null;
};