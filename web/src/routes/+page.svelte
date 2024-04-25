<script lang="ts">
  import { isLoggedIn } from '../stores/auth.store';
  import Auth from './components/Auth.svelte';
  import Profile from './components/Profile.svelte';

  export let data: { feeds: [] } = { feeds: [] };

  console.log(data.feeds);
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
