import { state } from '../state.js';
export function initDraft(root){
  root.innerHTML='<div class="panel"><h2>Draft</h2><table id="tbl"><thead></thead><tbody></tbody></table></div>';
  const thead=root.querySelector('thead'); const tbody=root.querySelector('tbody');
  function render(){
    thead.innerHTML='<tr><th>Name</th><th>Team</th><th>Action</th></tr>';
    tbody.innerHTML=state.getAvailablePlayers().map(p=>'<tr><td>'+p.name+'</td><td>'+p.nbaTeam+'</td><td><button data-id="'+p.id+'">Draft</button></td></tr>').join('');
    tbody.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{state.draftPlayer(btn.dataset.id,'t1'); render();});
  }
  state.on('players',render); render();
}