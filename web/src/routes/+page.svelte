<script lang="ts">
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../stores/user.store';
  import Auth from './components/Auth.svelte';
  import Profile from './components/Profile.svelte';
  import { login } from '$lib/user';

  onMount(() => {
    login();
  });
</script>

<svelte:head>
  {#if $isLoggedIn}
    <title>screamfeed | welcome</title>
  {:else}
    <title>screamfeed | authenticate</title>
  {/if}
</svelte:head>

{#if $isLoggedIn}
  <Profile />
{:else}
  <Auth />
{/if}
