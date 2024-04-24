<script>
	import '../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';

	import { isLoggedIn } from '../stores/auth.store';
	import { goto } from '$app/navigation';
</script>

<AppBar background="bg-transparent">
	<svelte:fragment slot="lead"><span>screamfeed</span></svelte:fragment>
	<svelte:fragment slot="trail">
		<button
			type="button"
			class="btn btn-sm bg-transparent"
			on:click={() => {
				goto('/');
			}}
		>
			<span>{$isLoggedIn ? 'Profile' : 'Sign-in'}</span>
		</button>
	</svelte:fragment>
</AppBar>
<slot />
