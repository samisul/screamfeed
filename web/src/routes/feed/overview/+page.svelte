<script lang="ts">
  import { getParsedFeeds } from '$lib/feed';
  import type { GenericFeed, GenericFeedItem } from '$lib/feed/model';
  import { isLoading } from '../../../stores/global.store';
  import { Accordion, getToastStore } from '@skeletonlabs/skeleton';
  import FeedOverview from '../components/FeedOverview.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '../../../stores/user.store';
  import { addMark } from '$lib/mark';
  import type { PageModel } from './page.model';
  import { SearchSolid } from 'flowbite-svelte-icons';

  let load = false;
  let search = '';
  export let data: PageModel | undefined = undefined;

  let items: GenericFeed[] = [];

  const toastStore = getToastStore();

  $: {
    if (load) {
      refresh();
      load = false;
    }
  }

  onMount(() => {
    if (!$isLoggedIn) goto('/');
    items = data?.feeds?.items ?? [];

    const _listener = (document.onkeydown = (e) => {
      if (e.key === 'Enter') onSearchSubmit();
    });

    return () => document.removeEventListener('keydown', _listener);
  });

  function onSearchSubmit() {
    if (!search || search.trim() === '') {
      items = data?.feeds?.items ?? [];
      return;
    }

    //todo: optimize nested loops//
    const _filtered: GenericFeed[] = [];

    data?.feeds?.items.forEach((item) => {
      if (item.title.toLowerCase().includes(search.toLowerCase())) {
        _filtered.push(item);
        return;
      }
      const _items = item.items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));
      if (_items.length) _filtered.push({ ...item, items: _items });
    });
    ////

    items = _filtered;
  }

  async function refresh(): Promise<void> {
    if (!data) return;
    $isLoading = true;
    data = { ...data, feeds: await getParsedFeeds() };
    $isLoading = false;
  }

  async function mark(item: GenericFeedItem) {
    $isLoading = true;
    const _res = await addMark({
      item
    });
    $isLoading = false;
    if (_res) {
      toastStore.trigger({
        message: 'Marked successfully.',
        background: 'variant-filled-primary',
        hoverable: true
      });
      load = true;
    } else {
      toastStore.trigger({
        message: 'Failed to mark.',
        background: 'variant-filled-primary',
        hoverable: true
      });
    }
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4">
  <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim">
      <SearchSolid></SearchSolid>
    </div>
    <input type="search" placeholder="Search..." bind:value={search} />
    <button class="variant-filled-primary" on:click={onSearchSubmit}>Submit</button>
  </div>
  <Accordion>
    {#each items as feed}
      <FeedOverview on:mark={(e) => mark(e.detail)} {feed} />
    {:else}
      <div class="text-center">No Feeds Found.</div>
    {/each}
  </Accordion>
</div>
