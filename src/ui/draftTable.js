import { state } from '../state.js';

export function initDraft(root){
  root.innerHTML = '' +
  `<div class="panel">
     <h2>Draft Center</h2>
     <div class="row" style="align-items:center">
       <input id="search" type="search" placeholder="Search player (name/position/team)"/>
       <label>Team:</label>
       <select id="teamSel"></select>
       <button id="undraftBtn" class="ghost">Undo last pick</button>
     </div>
   </div>
   <div class="panel table-wrap"><table id="tbl"><thead></thead><tbody></tbody></table></div>`;

  const search = root.querySelector('#search');
  const teamSel = root.querySelector('#teamSel');
  const tblHead = root.querySelector('#tbl thead');
  const tblBody = root.querySelector('#tbl tbody');
  const undraftBtn = root.querySelector('#undraftBtn');

  function populateTeams(){
    teamSel.innerHTML = state.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  }
  populateTeams();

  state.on('teams', populateTeams);
  state.on('players', render);
  state.on('drafted', render);

  search.addEventListener('input', render);
  undraftBtn.addEventListener('click', () => {
    const picks = Object.entries(state.drafted);
    if (!picks.length) return alert('No picks to undo.');
    const lastPid = picks[picks.length-1][0];
    state.undraftPlayer(lastPid);
  });

  function render(){
    const players = state.getAvailablePlayers();
    const q = (search.value||'').toLowerCase();
    const filtered = players.filter(p => {
      const hay = [p.name, p.nbaTeam, ...(p.positions||[])].join(' ').toLowerCase();
      return hay.includes(q);
    });

    tblHead.innerHTML = `<tr>
      <th>Name</th><th>Team</th><th>Pos</th><th>Value</th>
      <th colspan="3">Quick Draft</th>
    </tr>`;

    tblBody.innerHTML = filtered.map(p => {
      const pos = (p.positions||[]).join(',');
      return `<tr>
        <td>${escape(p.name)}</td>
        <td><span class="tag">${escape(p.nbaTeam||'')}</span></td>
        <td>${escape(pos)}</td>
        <td class="mono">${(p.value_total||0).toFixed(2)}</td>
        <td><button class="primary" data-pick="${p.id}">Draft → ${escape(teamSel.selectedOptions[0]?.text||'Team')}</button></td>
        <td><button class="ghost" data-pick-to="rename:${p.id}">Rename Team…</button></td>
        <td><button class="ghost" data-view="${p.id}">View</button></td>
      </tr>`;
    }).join('');

    tblBody.querySelectorAll('button[data-pick]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.currentTarget.getAttribute('data-pick');
        const tid = teamSel.value;
        state.draftPlayer(pid, tid);
      });
    });

    tblBody.querySelectorAll('button[data-pick-to]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const raw = e.currentTarget.getAttribute('data-pick-to');
        const [kind, pid] = raw.split(':');
        if (kind === 'rename'){
          const tid = teamSel.value;
          const t = state.teams.find(x => x.id === tid);
          const name = prompt('Rename team:', t.name);
          if (name && name.trim()){
            t.name = name.trim();
            state.setTeams([...state.teams]);
            render();
          }
        }
      });
    });
  }

  function escape(s){ return String(s||'').replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;"}[m])); }

  // initial
  render();
}
