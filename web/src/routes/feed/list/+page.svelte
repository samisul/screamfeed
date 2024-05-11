<script lang="ts">
  import { addFeed, getFeedUrls, getFeedsList, removeFeed } from '$lib/feed/index';
  import { CheckCircleSolid, TagSolid } from 'flowbite-svelte-icons';
  import { isLoading } from '../../../stores/global.store';
  import FeedUrl from './components/FeedUrl.svelte';
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { goto } from '$app/navigation';
  import {
    Accordion,
    AccordionItem,
    getModalStore,
    getToastStore,
    type ModalSettings
  } from '@skeletonlabs/skeleton';
  import { invalidUrl } from '$lib/helpers';
  import type { PageModel } from './page.model';
  import { prefs } from '../../../stores/prefs.store';
  import type { AddFeedReq } from '$lib/feed/model';

  export let data: PageModel | undefined = undefined;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const form = {
    url: '',
    title: '',
    tagIds: []
  } as AddFeedReq;

  let load = false;

  $: {
    if (load) {
      refresh();
      load = false;
    }
  }

  function getModalData(): ModalSettings {
    return {
      type: 'component',
      meta: { tagList: data?.tags?.items ?? [], selectedTags: form.tagIds },
      component: 'selectTag'
    };
  }

  async function handleUpsertTag() {
    const _res = await new Promise<string[]>((resolve) => {
      const _modalSettings = getModalData();
      const _modal: ModalSettings = {
        ..._modalSettings,
        response: (r: string[]) => resolve(r)
      };
      modalStore.trigger(_modal);
    });

    if (!_res) return;

    form.tagIds = _res;
  }

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  async function refresh(): Promise<void> {
    $isLoading = true;
    data = { ...data, feeds: await getFeedUrls() } as PageModel;
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
    toastStore.trigger({
      message: 'URL Added',
      background: 'variant-filled-primary',
      hoverable: true
    });
  }

  async function remove(id: string) {
    $isLoading = true;
    const _res = await removeFeed(id);
    $isLoading = false;
    if (!_res) {
      toastStore.trigger({
        message: 'Error: Could not Remove URL',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }
    load = true;
    toastStore.trigger({
      message: 'URL Removed',
      background: 'variant-filled-primary',
      hoverable: true
    });
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
    <button
      type="button"
      class="btn variant-filled-surface"
      on:click={async () => await handleUpsertTag()}
    >
      <TagSolid />
    </button>
    <button
      on:click={add}
      type="button"
      class="btn variant-filled-surface"
      disabled={!form.title || !form.url}
    >
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
  {#if $prefs?.recommendations}
    <Accordion>
      {#await getFeedsList() then list}
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
  {/if}
</div>
