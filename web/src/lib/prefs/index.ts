import type { Prefs } from './model';

const PREFIX = 'SCREAMFEED';

const defaultPrefs: Prefs = {
  search: true,
  marks: true
};

export function load(): Prefs {
  const _prefsFromLocalStorage = localStorage.getItem(`${PREFIX}_PREFS`);
  if (_prefsFromLocalStorage) return JSON.parse(_prefsFromLocalStorage);
  return defaultPrefs;
}

export function save(prefs: Prefs): void {
  localStorage.setItem(`${PREFIX}_PREFS`, JSON.stringify(prefs));
}
