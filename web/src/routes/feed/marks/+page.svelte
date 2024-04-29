<script lang="ts">
  import type { GenericFeedItem } from '$lib/feed/model';
  import { GlobeSolid, TrashBinSolid } from 'flowbite-svelte-icons';
  import { truncateString } from '$lib/helpers';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import type { PageModel } from './page.model';
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { goto } from '$app/navigation';
  import { removeMark } from '$lib/mark';
  import { isLoading } from '../../../stores/global.store';

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

  async function remove(id: string) {
    $isLoading = true;
    const _res = await removeMark(id);
    $isLoading = false;
    if (_res) {
      data = {
        ...data,
        marks: { items: data?.marks?.items.filter((mark) => mark.id !== id) ?? [] }
      };
    }
  }
</script>

<li class="lg:p-4 p-2 flex flex-col gap-4">
  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul>
      {#each data?.marks?.items ?? [] as mark}
        <li class="flex">
          <button type="button" class="btn bg-initial" on:click={() => remove(mark.id)}>
            <TrashBinSolid class="text-gray-500"></TrashBinSolid>
          </button>
          <a
            href={mark.item.link}
            target="_blank"
            class={mark.item.link ? '' : 'pointer-events-none'}
          >
            <GlobeSolid class="text-gray-500"></GlobeSolid>
          </a>
          <button
            type="button"
            class="btn bg-initial"
            on:click={() => {
              modalStore.trigger(getModalData(mark?.item));
            }}
          >
            {truncateString(mark?.item.title, 50)}
          </button>
        </li>
      {:else}
        <div class="text-center p-4">No Marks Found.</div>
      {/each}
    </ul>
  </nav>
</li>
