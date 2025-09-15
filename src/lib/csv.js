import { NINE_CATS } from '../schema.js';

// Heuristics to guess columns by name (case-insensitive)
const NAME_HINTS = {
  name: [/^name$/i, /player/],
  team: [/^team$/i],
  positions: [/pos/i, /position/i],
};

function normalizeName(s){ return String(s||'').trim(); }
function splitPositions(s){ return String(s||'').split(/[\/,|; ]+/).filter(Boolean); }

export function guessMapping(columns){
  const lower = columns.map(c => c.toLowerCase());
  const find = (reArr) => columns.find(c => reArr.some(re => re.test(c))) || null;

  const statCols = {}; const valueCols = {};
  // basic fields
  const nameCol = find(NAME_HINTS.name) || columns[0];
  const teamCol = find(NAME_HINTS.team) || null;
  const posCol  = find(NAME_HINTS.positions) || null;

  // Try match categories
  for (const cat of NINE_CATS){
    const base = cat.replace('%','pct').replace('3PM','3pm');
    const statGuess = columns.find(c => c.toLowerCase().includes(base.toLowerCase()) && !c.toLowerCase().includes('value'))
      || columns.find(c => c.toLowerCase().startsWith(base.toLowerCase()));
    const valGuess = columns.find(c => c.toLowerCase().includes('value_' + base.toLowerCase()))
      || columns.find(c => c.toLowerCase().includes(base.toLowerCase()) && c.toLowerCase().includes('value'));
    statCols[cat]  = statGuess || null;
    valueCols[cat] = valGuess || null;
  }
  return { nameCol, teamCol, posCol, statCols, valueCols };
}

// Parse CSV File -> raw rows
export function parseCsvFile(file){
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}

// Normalize rows into app Player objects
export function normalizePlayers(rows, mapping){
  const { nameCol, teamCol, posCol, statCols, valueCols } = mapping;
  let id = 1;
  return rows.map(r => {
    const name = normalizeName(r[nameCol]);
    if (!name) return null;
    const p = {
      id: String(id++),
      name,
      nbaTeam: teamCol ? String(r[teamCol]||'').toUpperCase() : '',
      positions: posCol ? splitPositions(r[posCol]) : [],
      stats: {}, values: {}, raw: r,
    };
    for (const cat of NINE_CATS){
      const sCol = statCols[cat];
      const vCol = valueCols[cat];
      p.stats[cat] = sCol ? Number(r[sCol] ?? 0) : 0;
      p.values[cat] = vCol ? Number(r[vCol] ?? 0) : 0;
    }
    // convenience: total value
    p.value_total = Object.values(p.values).reduce((a,b)=>a+(Number(b)||0),0);
    return p;
  }).filter(Boolean);
}
