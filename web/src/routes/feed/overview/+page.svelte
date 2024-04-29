<script lang="ts">
  import { getParsedFeeds } from '$lib/feed';
  import type { GenericFeedItem } from '$lib/feed/model';
  import { isLoading } from '../../../stores/global.store';
  import { Accordion } from '@skeletonlabs/skeleton';
  import FeedOverview from '../components/FeedOverview.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '../../../stores/user.store';
  import { addMark } from '$lib/mark';
  import type { PageModel } from './page.model';

  let load = false;
  export let data: PageModel | undefined = undefined;

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
    if (!data) return;
    $isLoading = true;
    data = { ...data, feeds: await getParsedFeeds() };
    $isLoading = false;
  }

  async function mark(item: GenericFeedItem) {
    $isLoading = true;
    await addMark({
      item
    });
    $isLoading = false;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4">
  <Accordion>
    {#each data?.feeds?.items ?? [] as feed}
      <FeedOverview on:mark={(e) => mark(e.detail)} {feed} />
    {:else}
      <div class="text-center">No Feeds Found.</div>
    {/each}
  </Accordion>
</div>
