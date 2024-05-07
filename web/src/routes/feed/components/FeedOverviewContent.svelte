<script lang="ts">
  import type { GenericFeed, GenericFeedItem } from '$lib/feed/model';
  import { GlobeSolid, MapPinSolid } from 'flowbite-svelte-icons';
  import { truncateString } from '$lib/helpers';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { createEventDispatcher } from 'svelte';
  import { prefs } from '../../../stores/prefs.store';

  export let feed: GenericFeed;

  const dispatch = createEventDispatcher();

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
    <i class="text-sm text-gray-500"> {feed.description ?? 'No Description'} </i>
  </a>

  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul>
      {#each feed?.items ?? [] as item}
        <li class="flex">
          {#if $prefs?.marks}
            <button type="button" class="btn bg-initial" on:click={() => dispatch('mark', item)}>
              <MapPinSolid class="text-gray-500"></MapPinSolid>
            </button>
          {/if}
          <a href={item.link} target="_blank" class={item.link ? '' : 'pointer-events-none'}>
            <GlobeSolid class="text-gray-500"></GlobeSolid>
          </a>
          <button
            type="button"
            class="btn bg-initial"
            on:click={() => {
              modalStore.trigger(getModalData(item));
            }}
          >
            {truncateString(item.title ?? '', 50)}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</li>
