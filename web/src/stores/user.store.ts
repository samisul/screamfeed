import type { UserOverview } from '$lib/user/models';
import { writable, type Writable } from 'svelte/store';

export const isLoggedIn = writable(false);
export const userOverview: Writable<UserOverview | undefined> = writable(undefined);
