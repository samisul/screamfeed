<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import type { ListRes } from '$lib/global';
  import { addFeed, getFeedUrls, removeFeed } from '$lib/feed/index';
  import { isLoading } from '../../stores/global.store';
  import { BookOpenSolid, CheckCircleSolid, TrashBinSolid } from 'flowbite-svelte-icons';
  import Feed from './components/Feed.svelte';

  let load = true;

  const form = {
    url: '',
    title: ''
  };

  let feedListRes: ListRes<FeedDto> | undefined = undefined;

  $: {
    if (load) {
      get();
      load = false;
    }
  }

  async function get(): Promise<void> {
    $isLoading = true;
    feedListRes = await getFeedUrls();
    $isLoading = false;
  }

  async function add() {
    if (!form.url || !form.title) return;
    $isLoading = true;
    await addFeed(form);
    form.url = '';
    form.title = '';
    $isLoading = false;
    load = true;
  }

  async function remove(id: string) {
    $isLoading = true;
    await removeFeed(id);
    $isLoading = false;
    load = true;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
  <div class="flex w-full">
    <input
      class="input bg-transparent"
      type="text"
      placeholder="Enter Feed Url"
      bind:value={form.url}
    />
    <input
      class="input bg-transparent"
      type="text"
      placeholder="Enter Feed Title"
      bind:value={form.title}
    />
    <button on:click={add} type="button" class="btn variant-filled-surface">
      <CheckCircleSolid />
    </button>
  </div>

  {#if feedListRes}
    <nav class="list-nav w-full">
      <ul>
        {#each feedListRes?.items ?? [] as item}
          <Feed {item} on:remove={(id) => remove(id.detail)} />
        {/each}
      </ul>
    </nav>
    {#if feedListRes?.items.length === 0}
      <div class="text-center">No feeds found.</div>
    {/if}
  {/if}
</div>
