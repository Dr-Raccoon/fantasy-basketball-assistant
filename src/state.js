import { storage } from './storage.js';
import { NINE_CATS, DEFAULT_TEAMS } from './schema.js';
import { calcTeamTotals } from './lib/math.js';

// Simple pub/sub event bus + in-memory state
class Store {
  constructor(){
    this.listeners = {};
    this.players = storage.loadPlayers(); // array of player objects (normalized)
    this.mapping = storage.loadMapping(); // {statCols:{}, valueCols:{}}
    this.teams = storage.loadTeams() || DEFAULT_TEAMS.map(t => ({...t}));
    this.drafted = storage.loadDrafted(); // { playerId: teamId }
  }
  on(evt, fn){ (this.listeners[evt] ||= new Set()).add(fn); return () => this.listeners[evt].delete(fn); }
  emit(evt, payload){ (this.listeners[evt]||[]).forEach(fn => fn(payload)); }

  setPlayers(players){ this.players = players; storage.savePlayers(players); this.emit('players', players); }
  setMapping(mapping){ this.mapping = mapping; storage.saveMapping(mapping); this.emit('mapping', mapping); }
  setTeams(teams){ this.teams = teams; storage.saveTeams(teams); this.emit('teams', teams); }
  draftPlayer(playerId, teamId){ this.drafted[playerId] = teamId; storage.saveDrafted(this.drafted); this.emit('drafted', {playerId, teamId}); }
  undraftPlayer(playerId){ delete this.drafted[playerId]; storage.saveDrafted(this.drafted); this.emit('drafted', {playerId, teamId:null}); }

  // Derived
  getAvailablePlayers(){ return this.players.filter(p => !this.drafted[p.id]); }
  getTeamRosters(){
    const rosters = Object.fromEntries(this.teams.map(t => [t.id, []]));
    for (const [pid, tid] of Object.entries(this.drafted)){
      const p = this.players.find(x => x.id === pid);
      if (p && rosters[tid]) rosters[tid].push(p);
    }
    return rosters;
  }
  getTeamTotals(){
    const rosters = this.getTeamRosters();
    const out = {};
    for (const t of this.teams){
      const teamPlayers = rosters[t.id] || [];
      out[t.id] = calcTeamTotals(teamPlayers, NINE_CATS);
    }
    return out;
  }
}

export const state = new Store();
