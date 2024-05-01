<script lang="ts">
  import { addFeed, getFeedUrls, list, removeFeed } from '$lib/feed/index';
  import { CheckCircleSolid } from 'flowbite-svelte-icons';
  import { isLoading } from '../../../stores/global.store';
  import FeedUrl from '../components/FeedUrl.svelte';
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { goto } from '$app/navigation';
  import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
  import { invalidUrl } from '$lib/helpers';
  import type { PageModel } from './page.model';

  export let data: PageModel | undefined = undefined;

  const toastStore = getToastStore();

  const form = {
    url: '',
    title: ''
  };

  let load = false;

  $: {
    if (load) {
      refresh();
      load = false;
    }
  }

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  async function refresh(): Promise<void> {
    $isLoading = true;
    data = { ...data, feeds: await getFeedUrls() };
    $isLoading = false;
  }

  async function add() {
    if (!form.url || !form.title) return;
    if (invalidUrl(form.url)) {
      toastStore.trigger({
        message: 'Error: Invalid URL',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }

    $isLoading = true;
    const _res = await addFeed(form);
    form.url = '';
    form.title = '';
    $isLoading = false;
    if (!_res) {
      toastStore.trigger({
        message: 'Error: Could not Add URL',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }
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

  {#if data?.feeds}
    <ul class="w-full">
      {#each data?.feeds.items ?? [] as item}
        <FeedUrl isDeletable {item} on:remove={(id) => remove(id.detail)} />
      {:else}
        <div class="text-center">No Feeds Found.</div>
      {/each}
    </ul>
  {/if}
  <Accordion>
    {#await list() then list}
      <AccordionItem class="w-full">
        <svelte:fragment slot="summary">Recommendations</svelte:fragment>
        <svelte:fragment slot="content">
          <ul class="w-full text-sm">
            {#each list?.items ?? [] as item}
              <FeedUrl
                isAddable
                on:add={(url) => {
                  form.url = url.detail.url;
                  form.title = url.detail.title;
                }}
                {item}
                on:remove={(id) => remove(id.detail)}
              />
            {/each}
          </ul>
        </svelte:fragment>
      </AccordionItem>
    {/await}
  </Accordion>
</div>
