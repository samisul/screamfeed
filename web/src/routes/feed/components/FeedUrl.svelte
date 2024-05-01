<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import { TrashBinSolid, PlusOutline } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let item: FeedDto;
  export let isDeletable = false;
  export let isAddable = false;
</script>

<li class="flex justify-between">
  <span>
    <span>{item.title}</span>
    <i class="lg:inline hidden text-gray-500 text-xs">- {item.url}</i>
  </span>
  {#if isDeletable}
    <button on:click={() => dispatch('remove', item.id)} type="button" class="btn bg-initial">
      <TrashBinSolid />
    </button>
  {/if}
  {#if isAddable}
    <button on:click={() => dispatch('add', item)} type="button" class="btn bg-initial">
      <PlusOutline />
    </button>
  {/if}
</li>
