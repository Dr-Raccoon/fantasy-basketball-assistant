import { state } from '../state.js';
import { parseCsvFile, guessMapping, normalizePlayers } from '../lib/csv.js';
import { NINE_CATS } from '../schema.js';

export function initUpload(root){
  root.innerHTML = '' +
  `<div class="panel">
     <h2>Upload Player Database (CSV)</h2>
     <p class="mono">Expected: one row per player. Include columns for raw stats and/or per-category values (z-scores). You can map columns after upload.</p>
     <div class="row" style="align-items:center">
       <input type="file" id="csvFile" accept=".csv" />
       <button id="btnLoadSample" class="ghost">Load sample</button>
       <button id="btnReset" class="ghost">Reset all</button>
     </div>
     <small class="hint">Your data is kept locally in your browser (localStorage). No server needed.</small>
   </div>
   <div id="mappingPanel" class="panel" style="display:none"></div>`;

  const fileInput = root.querySelector('#csvFile');
  const btnSample = root.querySelector('#btnLoadSample');
  const btnReset = root.querySelector('#btnReset');
  const mappingPanel = root.querySelector('#mappingPanel');

  btnReset.addEventListener('click', () => { if (confirm('Reset all data?')) { localStorage.clear(); location.reload(); } });

  btnSample.addEventListener('click', async () => {
    const res = await fetch('./data/sample_players.csv');
    const text = await res.text();
    const blob = new Blob([text], {type:'text/csv'});
    await handleFile(blob, 'sample_players.csv');
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await handleFile(file, file.name);
  });

  async function handleFile(file, name){
    const rows = await parseCsvFile(file);
    const columns = rows.length ? Object.keys(rows[0]) : [];
    const mapping = guessMapping(columns);
    renderMapping(mapping, columns, rows);
  }

  function renderMapping(mapping, columns, rows){
    mappingPanel.style.display = 'block';
    mappingPanel.innerHTML = '' +
    `<h3>Map Columns</h3>
     <div class="row">
       <div>
         <label>Player Name</label><br/>
         ${select('nameCol', mapping.nameCol, columns)}
       </div>
       <div>
         <label>NBA Team</label><br/>
         ${select('teamCol', mapping.teamCol, ['(none)', ...columns])}
       </div>
       <div>
         <label>Positions</label><br/>
         ${select('posCol', mapping.posCol, ['(none)', ...columns])}
       </div>
     </div>
     <hr class="sep"/>
     <div class="row">
       <div>
         <h4>Stat Columns</h4>
         ${NINE_CATS.map(c => `<div>${c}<br/>${select(`stat_${c}`, mapping.statCols[c], ['(none)', ...columns])}</div>`).join('')}
       </div>
       <div>
         <h4>Value Columns</h4>
         ${NINE_CATS.map(c => `<div>${c}<br/>${select(`value_${c}`, mapping.valueCols[c], ['(none)', ...columns])}</div>`).join('')}
       </div>
     </div>
     <div style="margin-top:10px" class="row">
       <button id="btnSaveMap" class="primary">Save Mapping & Load Players</button>
     </div>`;

    function select(id, current, opts){
      const options = opts.map(o => {
        const v = o === '(none)' ? '' : o;
        const sel = (current === o) ? 'selected' : '';
        return `<option value="${escapeHtml(v)}" ${sel}>${escapeHtml(String(o))}</option>`;
      }).join('');
      return `<select id="${id}">${options}</select>`;
    }

    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#039;"}[m])); }

    mappingPanel.querySelector('#btnSaveMap').addEventListener('click', () => {
      const get = id => mappingPanel.querySelector('#'+id).value || null;
      const statCols = {}; const valueCols = {};
      for (const c of NINE_CATS){
        statCols[c] = get('stat_'+c) || null;
        valueCols[c] = get('value_'+c) || null;
      }
      const finalMap = {
        nameCol: get('nameCol') || 'name',
        teamCol: get('teamCol') || null,
        posCol: get('posCol') || null,
        statCols, valueCols
      };
      state.setMapping(finalMap);
      const players = normalizePlayers(rows, finalMap);
      state.setPlayers(players);
      alert(`Loaded ${players.length} players.`);
    });
  }
}
