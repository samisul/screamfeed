<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { onMount } from 'svelte';
  import { GlobeSolid } from 'flowbite-svelte-icons';
  import { truncateString } from '$lib/helpers';

  export let feed: GenericFeed;

  onMount(() => {
    console.log(feed);
  });
</script>

<li class="flex flex-col">
  <a href={feed.link}>
    <i class="text-sm text-gray-500"> {feed.description} </i>
  </a>

  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul>
      {#each feed?.items ?? [] as item}
        <li class="flex">
          <a href={item.link}>
            <GlobeSolid class="text-gray-500"></GlobeSolid>
          </a>
          <button type="button" class="btn bg-initial">
            {truncateString(item.title, 50)}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</li>
