export const NINE_CATS = ["PTS","REB","AST","STL","BLK","3PM","FG%","FT%","TOV"];

// Default teams (you can rename them in the UI in Draft > Team selector)
export const DEFAULT_TEAMS = Array.from({length: 12}, (_,i) => ({
  id: `t${i+1}`,
  name: `Team ${i+1}`,
  rosterSlots: ["PG","SG","G","SF","PF","F","C","UTIL","UTIL","UTIL","BN","BN","BN"], // display-only for now
}));
