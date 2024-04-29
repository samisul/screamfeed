<script lang="ts">
  import type { GenericFeedItem } from '$lib/feed/model';
  import { GlobeSolid, TrashBinSolid } from 'flowbite-svelte-icons';
  import { truncateString } from '$lib/helpers';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import type { PageModel } from './page.model';
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { goto } from '$app/navigation';

  export let data: PageModel | undefined = undefined;

  const modalStore = getModalStore();

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  function getModalData(item: GenericFeedItem): ModalSettings {
    return {
      type: 'component',
      meta: { item },
      component: 'feedItemContent'
    };
  }
</script>

<li class="lg:p-4 p-2 flex flex-col gap-4">
  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul>
      {#each data?.marks ?? [] as item}
        <li class="flex">
          <button type="button" class="btn bg-initial">
            <TrashBinSolid class="text-gray-500"></TrashBinSolid>
          </button>
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
            {truncateString(item.title, 50)}
          </button>
        </li>
      {:else}
        <div class="text-center p-4">No Marks Found.</div>
      {/each}
    </ul>
  </nav>
</li>
