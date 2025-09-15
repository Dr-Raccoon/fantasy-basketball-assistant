import { state } from '../state.js';
export function initTeams(root){
  root.innerHTML='<div class="panel"><h2>Teams</h2><pre id="teamsOut"></pre></div>';
  const out=root.querySelector('#teamsOut');
  function render(){ out.textContent=JSON.stringify(state.getTeamRosters(),null,2); }
  state.on('drafted',render); state.on('players',render);
}