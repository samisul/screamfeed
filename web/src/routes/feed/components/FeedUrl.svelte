<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import { TrashBinSolid } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let item: FeedDto;
</script>

<li class="flex justify-between">
  <span>
    <span>{item.title}</span>
    <i class="lg:inline hidden text-gray-500 text-sm">- {item.url}</i>
  </span>
  <button on:click={() => dispatch('remove', item.id)} type="button" class="btn bg-initial">
    <TrashBinSolid />
  </button>
</li>
