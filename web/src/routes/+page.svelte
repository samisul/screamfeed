<script>
  import { isLoggedIn } from '../stores/auth.store';
  import Auth from './components/Auth.svelte';
  import Profile from './components/Profile.svelte';
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
