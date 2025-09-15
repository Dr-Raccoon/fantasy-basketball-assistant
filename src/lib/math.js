// Sum team totals for both raw stats and value contributions
export function calcTeamTotals(players, cats){
  const totals = { stats:{}, values:{}, value_total:0, count: players.length };
  for (const c of cats){ totals.stats[c]=0; totals.values[c]=0; }
  for (const p of players){
    for (const c of cats){
      totals.stats[c]  += Number(p.stats[c]||0);
      totals.values[c] += Number(p.values[c]||0);
    }
    totals.value_total += Number(p.value_total||0);
  }
  return totals;
}
