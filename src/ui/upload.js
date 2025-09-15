import { state } from '../state.js';
import { parseCsvFile } from '../lib/csv.js';
export function initUpload(root){
  root.innerHTML='<div class="panel"><h2>Upload</h2><input type="file" id="csvFile"/></div>';
  const fileInput=root.querySelector('#csvFile');
  fileInput.addEventListener('change',async(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const rows=await parseCsvFile(file);
    const players=rows.map((r,i)=>({id:String(i+1),name:r.name||'Unknown',nbaTeam:r.team||'',positions:r.positions? r.positions.split(','):[],stats:r}));
    state.setPlayers(players);
    alert('Loaded '+players.length+' players');
  });
}