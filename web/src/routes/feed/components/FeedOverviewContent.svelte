<script lang="ts">
  import type { GenericFeed, GenericFeedItem } from '$lib/feed/model';
  import { GlobeSolid } from 'flowbite-svelte-icons';
  import { truncateString } from '$lib/helpers';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

  export let feed: GenericFeed;

  const modalStore = getModalStore();

  function getModalData(item: GenericFeedItem): ModalSettings {
    return {
      type: 'component',
      meta: { item },
      component: 'feedItemContent'
    };
  }
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
          <button
            type="button"
            class="btn bg-initial"
            on:click={() => {
              modalStore.trigger(getModalData(item));
            }}
          >
            {truncateString(item.title, 50)}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</li>
