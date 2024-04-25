<script>
  import { navigateToGoogleOAuth, login, navigateToGithubOAuth } from '$lib/auth';
  import { GithubSolid, GoogleSolid } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';

  onMount(() => {
    login();
  });

  function onNavToGithub() {
    navigateToGithubOAuth();
  }

  function onNavToGoogle() {
    navigateToGoogleOAuth();
  }
</script>

<div class="lg:p-4 flex flex-col gap-4 items-center">
  <button type="button" class="btn variant-filled-primary" on:click={onNavToGithub}>
    <GithubSolid></GithubSolid>
    <span>continue with GitHub</span>
  </button>
  <button type="button" class="btn variant-filled-primary" on:click={onNavToGoogle}>
    <GoogleSolid></GoogleSolid>
    <span>continue with Google</span>
  </button>
</div>
