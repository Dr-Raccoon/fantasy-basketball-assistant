import { state } from '../state.js';
import { NINE_CATS } from '../schema.js';

export function initTeams(root){
  root.innerHTML = '' +
  `<div class="panel">
     <h2>Teams Overview</h2>
     <small class="hint">Totals are simple sums of player contributions (both raw stats and category values). You can undraft from the draft page.</small>
   </div>
   <div class="panel table-wrap"><table id="teamsTbl"><thead></thead><tbody></tbody></table></div>`;

  const thead = root.querySelector('#teamsTbl thead');
  const tbody = root.querySelector('#teamsTbl tbody');

  function render(){
    const totals = state.getTeamTotals();
    thead.innerHTML = `<tr>
      <th>Team</th>
      <th class="mono">#</th>
      <th class="mono">Value Σ</th>
      ${NINE_CATS.map(c => `<th>${c} (value)</th>`).join('')}
      ${NINE_CATS.map(c => `<th>${c} (stat)</th>`).join('')}
    </tr>`;

    tbody.innerHTML = state.teams.map(t => {
      const tt = totals[t.id] || {stats:{},values:{},value_total:0,count:0};
      return `<tr>
        <td>${escape(t.name)}</td>
        <td class="mono">${tt.count||0}</td>
        <td class="mono">${(tt.value_total||0).toFixed(2)}</td>
        ${NINE_CATS.map(c => `<td class="mono">${(tt.values[c]||0).toFixed(2)}</td>`).join('')}
        ${NINE_CATS.map(c => `<td class="mono">${(tt.stats[c]||0).toFixed(2)}</td>`).join('')}
      </tr>`;
    }).join('');
  }

  function escape(s){ return String(s||'').replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;"}[m])); }

  state.on('teams', render);
  state.on('drafted', render);
  state.on('players', render);
  render();
}
