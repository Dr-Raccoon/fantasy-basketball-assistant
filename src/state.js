import { storage } from './storage.js';
import { DEFAULT_TEAMS } from './schema.js';
class Store {
  constructor(){
    this.players = [];
    this.teams = storage.load('teams')||DEFAULT_TEAMS;
    this.drafted = {};
    this.listeners={};
  }
  on(evt,fn){(this.listeners[evt] ||= new Set()).add(fn);}
  emit(evt,payload){(this.listeners[evt]||[]).forEach(fn=>fn(payload));}
  setPlayers(ps){this.players=ps; this.emit('players',ps);}
  draftPlayer(pid,tid){this.drafted[pid]=tid; this.emit('drafted',{pid,tid});}
  undraftPlayer(pid){delete this.drafted[pid]; this.emit('drafted',{pid,null});}
  getAvailablePlayers(){return this.players.filter(p=>!this.drafted[p.id]);}
  getTeamRosters(){const r={}; for(const t of this.teams) r[t.id]=[]; for(const [pid,tid] of Object.entries(this.drafted)){const p=this.players.find(x=>x.id===pid); if(p) r[tid].push(p);} return r;}
}
export const state = new Store();