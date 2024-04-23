<script>
	import { navigateToGoogleOAuth, login, navigateToGithubOAuth } from '$lib/auth';
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

<div class="w-full lg:p-4">
	<button type="button" class="btn filled-primary text-red-900 bg-white">
		<span>(icon)</span>
		<span>continue with GitHub</span>
	</button>
</div>
