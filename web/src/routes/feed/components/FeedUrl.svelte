<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import { BookOpenSolid, TrashBinSolid } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let item: FeedDto;
</script>

<li class="flex">
  <a href={'/feed/' + item.id} class="flex flex-grow">
    <div class="flex items-center flex-1">
      <span class="badge bg-transparent">
        <BookOpenSolid />
      </span>
      <span class="flex-auto">{item.title}</span>
    </div>
    <i class="lg:inline hidden text-gray-500">{item.url}</i>
  </a>
  <button on:click={() => dispatch('remove', item.id)} type="button" class="btn bg-initial">
    <TrashBinSolid />
  </button>
</li>
