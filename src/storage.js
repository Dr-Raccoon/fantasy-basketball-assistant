const KEY = {
  players: 'fba_players',
  mapping: 'fba_mapping',
  drafted: 'fba_drafted',
  teams: 'fba_teams',
};

export const storage = {
  savePlayers(players){ localStorage.setItem(KEY.players, JSON.stringify(players)); },
  loadPlayers(){ return JSON.parse(localStorage.getItem(KEY.players) || '[]'); },

  saveMapping(mapping){ localStorage.setItem(KEY.mapping, JSON.stringify(mapping)); },
  loadMapping(){ return JSON.parse(localStorage.getItem(KEY.mapping) || 'null'); },

  saveDrafted(drafted){ localStorage.setItem(KEY.drafted, JSON.stringify(drafted)); },
  loadDrafted(){ return JSON.parse(localStorage.getItem(KEY.drafted) || '{}'); },

  saveTeams(teams){ localStorage.setItem(KEY.teams, JSON.stringify(teams)); },
  loadTeams(){ return JSON.parse(localStorage.getItem(KEY.teams) || 'null'); },

  reset(){
    localStorage.removeItem(KEY.players);
    localStorage.removeItem(KEY.mapping);
    localStorage.removeItem(KEY.drafted);
    localStorage.removeItem(KEY.teams);
  }
};
