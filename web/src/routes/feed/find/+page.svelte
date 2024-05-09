<script lang="ts">
  import { findFeed } from '$lib/feed';
  import { invalidUrl } from '$lib/helpers';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { FileCopySolid, LinkOutline } from 'flowbite-svelte-icons';
  import { isLoading } from '../../../stores/global.store';

  const toastStore = getToastStore();

  let val = '';
  let foundFeeds: string[] = [];

  async function onSubmit() {
    if (invalidUrl(val)) {
      toastStore.trigger({
        message: 'Invalid URL',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }
    $isLoading = true;
    foundFeeds = (await findFeed(val))?.items ?? [];
    $isLoading = false;
  }

  function onCopy(feed: string) {
    navigator.clipboard.writeText(feed);
    toastStore.trigger({
      message: 'Copied to clipboard',
      background: 'variant-filled-primary',
      hoverable: true
    });
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim">
      <LinkOutline></LinkOutline>
    </div>
    <input type="search" placeholder="Find Rss Feed..." bind:value={val} />
    <button class="variant-filled-primary" on:click={onSubmit}>Submit</button>
  </div>
  <ul class="grid grid-cols-1 gap-2 w-full">
    {#each foundFeeds as feed}
      <li class="flex justify-between">
        <span>
          {feed}
        </span>
        <button type="button" class="btn bg-initial" on:click={() => onCopy(feed)}>
          <FileCopySolid />
        </button>
      </li>
    {:else}
      <div class="text-center">No Feeds Found.</div>
    {/each}
  </ul>
</div>
