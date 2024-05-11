<script lang="ts">
  import { getParsedFeeds } from '$lib/feed';
  import type { GenericFeed, GenericFeedItem } from '$lib/feed/model';
  import { isLoading } from '../../../stores/global.store';
  import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
  import FeedOverview from './components/FeedOverview.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '../../../stores/user.store';
  import { addMark } from '$lib/mark';
  import type { PageModel } from './page.model';
  import {
    CheckCircleSolid,
    FilterSolid,
    MinusOutline,
    PlusOutline,
    SearchSolid
  } from 'flowbite-svelte-icons';
  import { prefs } from '../../../stores/prefs.store';

  export let data: PageModel | undefined = undefined;

  let load = false;
  let search = '';
  let searchEl: HTMLInputElement | undefined = undefined;
  let items: GenericFeed[] = [];
  let filters: Record<string, boolean> =
    data?.tags?.items.reduce((acc, tag) => ({ ...acc, [tag.name]: false }), {}) ?? {};

  const toastStore = getToastStore();

  $: {
    if (load) {
      refresh();
      load = false;
    }
  }

  onMount(() => {
    if (!$isLoggedIn) goto('/');
    items = data?.parsedFeeds?.items ?? [];

    const _listener = (document.onkeydown = (e) => {
      if (e.key === 'Enter') onSearchSubmit();
      else if (e.key === 'k' && e.ctrlKey) searchEl?.focus();
      else if (e.key === 'Escape') searchEl?.blur();
    });

    return () => document.removeEventListener('keydown', _listener);
  });

  async function toggle(f: string): Promise<void> {
    filters[f] = !filters[f];

    const _urlsToFetch =
      data?.feeds?.items.filter((f) => f.tags.some((t) => filters[t.name])) ?? undefined;

    items =
      (await getParsedFeeds(!_urlsToFetch?.length ? undefined : _urlsToFetch?.map((f) => f.url)))
        ?.items ?? [];
  }

  function onSearchSubmit() {
    if (!search || search.trim() === '') {
      items = data?.parsedFeeds?.items ?? [];
      return;
    }

    //todo: optimize nested loops//
    const _filtered: GenericFeed[] = [];

    data?.parsedFeeds?.items.forEach((item) => {
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
    data = { ...data, parsedFeeds: await getParsedFeeds() };
    $isLoading = false;
  }

  async function mark(item: GenericFeedItem): Promise<void> {
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
  <div class="flex">
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
      {#if $prefs?.search}
        <div class="input-group-shim">
          <SearchSolid></SearchSolid>
        </div>
        <input type="search" placeholder="Search..." bind:value={search} bind:this={searchEl} />
        <button class="variant-filled-primary" on:click={onSearchSubmit}>Submit</button>
      {/if}
    </div>
  </div>
  <div class="border-b border-gray-500">
    <Accordion>
      <AccordionItem class="w-full">
        <svelte:fragment slot="lead">
          <FilterSolid />
        </svelte:fragment>
        <svelte:fragment slot="summary">Filter</svelte:fragment>
        <svelte:fragment slot="content">
          <div class="flex gap-2">
            {#each Object.keys(filters) as f}
              <button
                class="chip {filters[f] ? 'variant-filled-primary' : 'variant-soft'}"
                on:click={() => {
                  toggle(f);
                }}
                on:keypress
              >
                {#if filters[f]}
                  <CheckCircleSolid />
                {/if}
                <span class="capitalize">{f}</span>
              </button>
            {:else}
              <div class="text-center text-gray-500">No Tags.</div>
            {/each}
          </div>
        </svelte:fragment>
        <svelte:fragment slot="iconClosed">
          <MinusOutline />
        </svelte:fragment>
        <svelte:fragment slot="iconOpen">
          <PlusOutline />
        </svelte:fragment>
      </AccordionItem>
    </Accordion>
  </div>
  <Accordion>
    {#each items as feed}
      <FeedOverview on:mark={(e) => mark(e.detail)} {feed} />
    {:else}
      <div class="text-center">No Feeds Found.</div>
    {/each}
  </Accordion>
</div>
