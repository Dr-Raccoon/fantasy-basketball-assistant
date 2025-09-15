import { initUpload } from './ui/upload.js';
import { initDraft } from './ui/draftTable.js';
import { initTeams } from './ui/teamsTable.js';
import { initCompare } from './ui/compareView.js';

const tabs = document.querySelectorAll('.tabs button');
const sections = {
  upload: document.getElementById('tab-upload'),
  draft: document.getElementById('tab-draft'),
  teams: document.getElementById('tab-teams'),
  compare: document.getElementById('tab-compare'),
};

function switchTab(name){
  tabs.forEach(b => b.classList.toggle('active', b.dataset.tab===name));
  Object.entries(sections).forEach(([k,el]) => el.classList.toggle('active', k===name));
}

for (const b of tabs){ b.addEventListener('click', () => switchTab(b.dataset.tab)); }

initUpload(sections.upload);
initDraft(sections.draft);
initTeams(sections.teams);
initCompare(sections.compare);

const statusEl = document.getElementById('app-status');
let dot = 0; setInterval(()=>{ statusEl.textContent = ['•','••','•••','••••'][dot++%4] + ' ready'; }, 800);