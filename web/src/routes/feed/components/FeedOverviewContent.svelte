<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { onMount } from 'svelte';
  import { GlobeSolid } from 'flowbite-svelte-icons';

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
          <a href={'/feed/' + item.id} class="flex flex-grow">
            <div class="flex items-center flex-1">
              <span class="flex-auto">{item.title}</span>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</li>
