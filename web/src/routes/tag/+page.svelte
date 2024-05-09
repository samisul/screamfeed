<script lang="ts">
  import { TrashBinSolid } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { removeTag } from '$lib/tag';
  import type { PageModel } from './page.model';
  import { isLoggedIn } from '../../stores/user.store';
  import { isLoading } from '../../stores/global.store';
  import { truncateString } from '$lib/helpers';

  export let data: PageModel | undefined = undefined;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  function getModalData(id: string): ModalSettings {
    return {
      type: 'component',
      meta: { id },
      component: 'upsertTag'
    };
  }

  async function remove(id: string) {
    $isLoading = true;
    const _res = await removeTag(id);
    $isLoading = false;
    if (!_res) {
      toastStore.trigger({
        message: 'Error: Could not Remove Tag',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }

    toastStore.trigger({
      message: 'Tag Removed',
      background: 'variant-filled-primary',
      hoverable: true
    });

    data = {
      ...data,
      tags: { items: data?.tags?.items.filter((tag) => tag.id !== id) ?? [] }
    };
  }
</script>

<li class="lg:p-4 p-2 flex flex-col gap-4">
  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul>
      {#each data?.tags?.items ?? [] as tag}
        <li class="flex">
          <button type="button" class="btn bg-initial" on:click={() => remove(tag.id)}>
            <TrashBinSolid class="text-gray-500"></TrashBinSolid>
          </button>
          <button
            type="button"
            class="btn bg-initial"
            on:click={() => {
              modalStore.trigger(getModalData(tag?.id));
            }}
          >
            {truncateString(tag?.name, 50)}
          </button>
        </li>
      {:else}
        <div class="text-center p-4">No Tags Found.</div>
      {/each}
    </ul>
  </nav>
</li>
