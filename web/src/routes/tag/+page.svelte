<script lang="ts">
  import { TrashBinSolid, PlusOutline, PenSolid } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { removeTag } from '$lib/tag';
  import type { PageModel } from './page.model';
  import { isLoggedIn } from '../../stores/user.store';
  import { isLoading } from '../../stores/global.store';
  import type { TagPreviewDto } from '$lib/tag/model';

  export let data: PageModel | undefined = undefined;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  function getModalData(id?: string): ModalSettings {
    return {
      type: 'component',
      meta: { id, feedList: data?.feeds?.items ?? [] },
      component: 'upsertTag'
    };
  }

  async function handleUpsertTag(id?: string) {
    const _res = await new Promise<{ tag: TagPreviewDto; type: 'update' | 'add' }>((resolve) => {
      const _modalSettings = getModalData(id);
      const _modal: ModalSettings = {
        ..._modalSettings,
        response: (r: { tag: TagPreviewDto; type: 'update' | 'add' }) => resolve(r)
      };
      modalStore.trigger(_modal);
    });

    if (!_res) return;

    toastStore.trigger({
      message: 'Tag Added/Updated',
      background: 'variant-filled-primary',
      hoverable: true
    });

    if (_res.type === 'update') {
      const _tag = data?.tags?.items.find((tag) => tag.id === _res.tag.id);
      if (!_tag) return;
      _tag.name = _res.tag.name;
      data = { ...data } as PageModel;
      return;
    } else {
      data = {
        ...data,
        tags: { items: [...(data?.tags?.items ?? []), _res.tag] }
      } as PageModel;
    }
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
    } as PageModel;
  }
</script>

<li class="lg:p-4 p-2 flex flex-col gap-4">
  <button
    type="button"
    class="btn variant-filled-primary"
    on:click={async () => await handleUpsertTag()}
  >
    <PlusOutline />
  </button>
  <nav class="list-nav w-full overflow-y-scroll max-h-[75vh]">
    <ul class="w-full">
      {#each data?.tags?.items ?? [] as tag}
        <li class="flex justify-between">
          <span>{tag.name}</span>
          <div class="flex">
            <button on:click={() => remove(tag.id)} type="button" class="btn bg-initial">
              <TrashBinSolid />
            </button>
            <button
              type="button"
              class="btn bg-initial"
              on:click={async () => await handleUpsertTag(tag.id)}
            >
              <PenSolid />
            </button>
          </div>
        </li>
      {:else}
        <div class="text-center p-4">No Tags Found.</div>
      {/each}
    </ul>
  </nav>
</li>
