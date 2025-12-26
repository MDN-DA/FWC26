
// Mapping pour normaliser les noms de pays de l'API ESPN vers nos noms standardisés
export const countryMapping: Record<string, string> = {
    // North America
    "United States": "USA",
    "United States of America": "USA",
    "Costa Rica": "Costa Rica",
    "Haiti": "Haiti",
    "Jamaica": "Jamaica",
    "Panama": "Panama",
    "Curacao": "Curaçao",
    "Curaçao": "Curaçao",
    
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

    // Placeholders / Playoffs
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
export const GROUPS: Record<string, string[]> = {
    "A": ["Mexico", "South Africa", "South Korea", "Path D [UEFA]"],
    "B": ["Canada", "Path A [UEFA]", "Qatar", "Switzerland"],
    "C": ["Haiti", "Scotland", "Brazil", "Morocco"],
    "D": ["USA", "Paraguay", "Australia", "Path C [UEFA]"],
    "E": ["Côte d'Ivoire", "Ecuador", "Germany", "Curaçao"],
    "F": ["Netherlands", "Japan", "Path B [UEFA]", "Tunisia"],
    "G": ["IR Iran", "New Zealand", "Belgium", "Egypt"],
    "H": ["Saudi Arabia", "Uruguay", "Spain", "Cabo Verde"],
    "I": ["France", "Senegal", "Pathway 2", "Norway"],
    "J": ["Argentina", "Algeria", "Austria", "Jordan"],
    "K": ["Portugal", "Pathway 1", "Uzbekistan", "Colombia"],
    "L": ["Ghana", "Panama", "England", "Croatia"]
};

// Fuseaux horaires (Standard Time Mars 2026)
export const CITY_TIMEZONES: Record<string, number> = {
    "Mexico City": -6,
    "Guadalajara": -6,
    "Monterrey": -6,
    "Toronto": -4,
    "Vancouver": -7,
    "Los Angeles": -7,
    "New York/NJ": -4,
    "Dallas": -5,
    "Houston": -5,
    "Kansas City": -5,
    "Miami": -4,
    "Atlanta": -4,
    "Philadelphia": -4,
    "Seattle": -7,
    "San Francisco": -7,
    "Boston": -4,
    "Cardiff": 0,
    "Bergamo": 1,
    "Zenica": 1,
    "Warsaw": 1,
    "Valencia": 1,
    "Solna": 1,
    "Bratislava": 1,
    "Pristina": 1,
    "Istanbul": 3,
    "Praha": 1,
    "Dublin": 0,
    "Copenhagen": 1
};

export const competitionLogos: Record<string, string> = {
  "World Cup": "https://i.postimg.cc/QNcBC3sT/FWC26.png"
};

export const getFlagCode = (teamName: string): string | null => {
    if (!teamName) return null;
    const lower = teamName.toLowerCase().trim();
    if (lower.includes("winner") || lower.includes("path") || lower.includes("pathway") || lower.match(/^\d[a-z]$/) || lower.match(/^w\s?\d+$/) || lower.match(/^l\s?\d+$/)) return null;

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
        "northern ireland": "gb-nir", "n. ireland": "gb-nir", "bosnia": "ba", "north macedonia": "mk", "n. macedonia": "mk",
        "albania": "al", "israel": "il", "colombia": "co", "chile": "cl", "peru": "pe", "paraguay": "py", "venezuela": "ve",
        "bolivia": "bo", "egypt": "eg", "algeria": "dz", "nigeria": "ng", "ivory coast": "ci", "cote d'ivoire": "ci", "côte d'ivoire": "ci", 
        "mali": "ml", "south africa": "za", "dr congo": "cd", "congo dr": "cd", "new caledonia": "nc", "jamaica": "jm",
        "suriname": "sr", "iraq": "iq", "new zealand": "nz", "fiji": "fj", "panama": "pa", "honduras": "hn", "el salvador": "sv", 
        "slovenia": "si", "hungary": "hu", "georgia": "ge", "iceland": "is", "finland": "fi", "cabo verde": "cv", "uzbekistan": "uz", 
        "jordan": "jo", "haiti": "ht", "curaçao": "cw", "guinea": "gn", "kosovo": "xk", "burkina faso": "bf", "zambia": "zm", "uae": "ae", "oman": "om", "kyrgyzstan": "kg", "china": "cn"
    };
    return map[lower] || null;
};
