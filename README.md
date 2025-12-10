
# 🏆 World Cup 2026 Tracker (Gunners-Stats Edition)

An interactive and **automated** dashboard to track the FIFA World Cup 2026™.  
Designed as an ultra-fast Progressive Web App (PWA), featuring real-time score updates, a complete tournament simulator, and dynamic final bracket management.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg) ![Status](https://img.shields.io/badge/status-Live-green.svg)

## ✨ Key Features

### ⚡️ Real-Time & Automation ("Softcoded Way")
*   **Live Scores**: Direct connection to ESPN's hidden API to retrieve scores, goalscorers, and game time down to the second.
*   **Smart Bracket**: The knockout tree fills up **automatically**.
    *   *Group Stage*: As soon as a team plays 3 matches, "1A" becomes "Mexico".
    *   *Knockout*: As soon as Match 73 is finished, "Winner Match 73" becomes "France" in the next round.
    *   *Complexity*: Automatic management of **Best 3rd Place Teams** according to the 495 possible combinations of FIFA regulations.
*   **Synchronization**: Team names are normalized (e.g., "Korea Republic" -> "South Korea") to ensure perfect consistency between the API and display.

### 🎮 Tournament Simulator (New)
*   **Predictions**: Enter your scores for all group stage matches.
*   **Instant Calculation**: Standings (Points, Goal Difference, Goals For) update in real-time.
*   **Playoff Resolver**: Manually choose winners for playoffs (e.g., Ukraine vs Scotland) to fill gaps in the bracket.
*   **Interactive Bracket**: Click on any match in the tree to advance a team to the final and simulate your own champion.

### 🌍 User Experience
*   **Timezone Management**: Automatic conversion from stadium time ("Venue Time") to user's local time ("My Local Time").
*   **Visual Context**: Dynamic badges indicating time of day (☀️ Day, 🌙 Evening, 💎 Prime Time, 💤 Night) to plan viewing.
*   **Mobile Navigation**: Bottom navigation bar ("App-like") for fluid smartphone usage.
*   **PWA**: Installable on mobile (iOS/Android) and Desktop. Works offline and in full screen.

### 🎨 Design & UI
*   **Dark Mode**: Native Dark/Light mode support.
*   **Responsive**:
    *   *Mobile*: Touch navigation, smooth scrolling.
    *   *Desktop*: Wide view (1800px), optimized group grids (3 columns), Bracket without horizontal scrolling.
*   **Identity**: Integrated FWC26 logo, Animated Splash Screen on startup.

## 🛠 Tech Stack

*   **Framework**: React 18 (TypeScript)
*   **Style**: Tailwind CSS (with custom animations)
*   **Data**: ESPN API (Undocumented endpoints) + Internal fixtures logic.
*   **Build**: Vite / Create React App structure.

## 📂 Project Structure

```bash
/src
  /components
    Bracket.tsx       # The knockout tree (recursive & interactive logic)
    Simulator.tsx     # Simulation engine (Score input + Calculations)
    FixtureList.tsx   # Match list with filters and Live Scores
    LeagueTable.tsx   # Group tables (Grid or List view)
    Playoffs.tsx      # UEFA & Intercontinental Playoffs
    Countdown.tsx     # Smart countdown (next match)
    BottomNav.tsx     # Mobile navigation bar
    SplashScreen.tsx  # Loading screen
  /data
    fixtures.ts       # Complete schedule
    combinations.ts   # Logic for group 3rd place teams
    playoffs.ts       # Playoff structure
  /services
    soccerService.ts  # API Fetcher & Data Normalizer
  /utils
    standingsUtils.ts # "The Brain": Name resolution (1A -> France)
    simulatorLogic.ts # Points calculation algorithm for simulator
  App.tsx             # Entry point and global state management
```

## 🚀 How it works?

### Name Resolution Logic (`resolveTeamName`)
This is the heart of automation. It takes a code (e.g., "W73", "1A", "3(ACD)") and transforms it into a real team name by consulting:
1.  Live results (for Match Winners).
2.  API standings (for Group Winners).
3.  The combinations table (for 3rd place teams).
4.  Simulator overrides (if the user makes predictions).

## 📱 Installation (PWA)

1.  Open the site on your mobile.
2.  Tap "Share" (iOS) or the menu (Android).
3.  Select **"Add to Home Screen"**.

---

*Crafted with ❤️ by Gunners-Stats*
