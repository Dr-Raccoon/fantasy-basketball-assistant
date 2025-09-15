export const storage = {
  save(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
  load(key){ return JSON.parse(localStorage.getItem(key)||'null'); },
  reset(){ localStorage.clear(); }
};