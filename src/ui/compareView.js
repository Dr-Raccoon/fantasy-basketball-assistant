import { state } from '../state.js';
import { NINE_CATS } from '../schema.js';

export function initCompare(root){
  root.innerHTML = '' +
  `<div class="panel">
     <h2>Head-to-Head Compare</h2>
     <div class="row" style="align-items:center">
       <label>My Team:</label> <select id="mine"></select>
       <label>Opponent:</label> <select id="opp"></select>
     </div>
   </div>
   <div class="panel table-wrap"><table id="cmp"><thead></thead><tbody></tbody></table></div>`;

  const mineSel = root.querySelector('#mine');
  const oppSel = root.querySelector('#opp');
  const thead = root.querySelector('#cmp thead');
  const tbody = root.querySelector('#cmp tbody');

  function populate(){
    const opts = state.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    mineSel.innerHTML = opts;
    oppSel.innerHTML = opts;
    if (state.teams.length > 1) oppSel.selectedIndex = 1;
    render();
  }

  function render(){
    const totals = state.getTeamTotals();
    const myId = mineSel.value || state.teams[0]?.id;
    const opId = oppSel.value || state.teams[1]?.id;
    const A = totals[myId] || {stats:{},values:{}};
    const B = totals[opId] || {stats:{},values:{}};

    thead.innerHTML = `<tr>
      <th>Category</th>
      <th>${escape(teamName(myId))}</th>
      <th>${escape(teamName(opId))}</th>
    </tr>`;

    tbody.innerHTML = NINE_CATS.map(c => {
      const a = Number(A.values[c]||0);
      const b = Number(B.values[c]||0);
      const clsB = (b < a) ? 'bad' : (b > a) ? 'good' : '';
      return `<tr>
        <td>${c}</td>
        <td class="mono">${a.toFixed(2)}</td>
        <td class="mono ${clsB}">${b.toFixed(2)}</td>
      </tr>`;
    }).join('')
    + `<tr>
      <td><strong>Total Value</strong></td>
      <td class="mono"><strong>${Number(A.value_total||0).toFixed(2)}</strong></td>
      <td class="mono ${ (Number(B.value_total||0) > Number(A.value_total||0)) ? 'good' : (Number(B.value_total||0) < Number(A.value_total||0)) ? 'bad' : '' }"><strong>${Number(B.value_total||0).toFixed(2)}</strong></td>
    </tr>`;
  }

  function teamName(id){ return state.teams.find(t => t.id===id)?.name || id; }
  function escape(s){ return String(s||'').replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;"}[m])); }

  state.on('teams', populate);
  state.on('drafted', render);
  state.on('players', render);
  mineSel.addEventListener('change', render);
  oppSel.addEventListener('change', render);

  populate();
}
