<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { onMount } from 'svelte';

  export let feed: GenericFeed;

  onMount(() => {
    console.log(feed);
  });
</script>

<li class="flex">
  <a href={feed.link}>
    <i class="text-sm text-gray-500"> {feed.description} </i>
  </a>
</li>
