<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import { TrashBinSolid } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let item: FeedDto;
</script>

<li class="flex justify-between">
  <button type="button" class="btn bg-initial">
    <span>{item.title}</span>
    <i class="lg:inline hidden text-gray-500">{item.url}</i>
  </button>
  <button on:click={() => dispatch('remove', item.id)} type="button" class="btn bg-initial">
    <TrashBinSolid />
  </button>
</li>
