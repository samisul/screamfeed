import { browser } from '$app/environment';
import { load } from '$lib/prefs';
import type { Prefs } from '$lib/prefs/model';
import { writable, type Writable } from 'svelte/store';

export let prefs: Writable<Prefs | undefined>;

if (browser) prefs = writable(load());
