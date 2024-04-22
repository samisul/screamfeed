<script lang="ts">
	import { logout } from '$lib/auth';
	import { onMount } from 'svelte';

	onMount(async () => {});
</script>

<div class="w-full bg-neutral-800 lg:p-4">
	<!-- {#if user} -->
	<!-- 	<Card -->
	<!-- 		size="none" -->
	<!-- 		class="flex items-center gap-4 border-transparent bg-transparent shadow-transparent" -->
	<!-- 	> -->
	<!-- 		<div class="flex flex-col gap-3"> -->
	<!-- 			<Button class="w-full font-bold" outline size="xs" on:click={logout} color="red" -->
	<!-- 				>logout</Button -->
	<!-- 			> -->
	<!-- 			<Avatar src={user.avatar} size="xl" rounded /> -->
	<!-- 		</div> -->
	<!-- 		<div> -->
	<!-- 			<h5 class="bg-neutral-800 text-white">welcome, {user.name}</h5> -->
	<!-- 			<div class="pt-4"> -->
	<!-- 				<p>word count: {user.wordCount}</p> -->
	<!-- 				<p>tag count: {user.tagCount}</p> -->
	<!-- 				<p>link count: {user.linkCount}</p> -->
	<!-- 				<p>source count: {user.sourceCount}</p> -->
	<!-- 			</div> -->
	<!-- 		</div> -->
	<!-- 	</Card> -->
	<!-- {/if} -->
</div>
