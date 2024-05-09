<script lang="ts">
  import { CheckCircleSolid } from 'flowbite-svelte-icons';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { removeTag } from '$lib/tag';
  import type { PageModel } from './page.model';
  import { isLoggedIn } from '../../stores/user.store';
  import { isLoading } from '../../stores/global.store';

  export let data: PageModel | undefined = undefined;

  const toastStore = getToastStore();

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

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

<div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
  {#if data?.tags}
    <ul class="w-full">
      {#each data?.tags.items as item}
        <li class="flex justify-between">
          <span>
            {item.name}
          </span>
          <button type="button" class="btn bg-initial" on:click={() => remove(item.id)}>
            <CheckCircleSolid class="text-gray-500"></CheckCircleSolid>
          </button>
        </li>
      {:else}
        <div class="text-center">No Tags Found.</div>
      {/each}
    </ul>
  {/if}
</div>
