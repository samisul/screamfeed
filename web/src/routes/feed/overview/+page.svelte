<script lang="ts">
  import { getParsedFeeds } from '$lib/feed';
  import type { GenericFeed, GenericFeedItem } from '$lib/feed/model';
  import type { ListRes } from '$lib/global';
  import { isLoading } from '../../../stores/global.store';
  import { Accordion } from '@skeletonlabs/skeleton';
  import FeedOverview from '../components/FeedOverview.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '../../../stores/user.store';
  import { addMark } from '$lib/mark';

  let load = true;
  let genericFeeds: ListRes<GenericFeed> | undefined = undefined;

  $: {
    if (load) {
      get();
      load = false;
    }
  }

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  async function get(): Promise<void> {
    $isLoading = true;
    genericFeeds = await getParsedFeeds();
    $isLoading = false;
  }

  async function mark(item: GenericFeedItem) {
    $isLoading = true;
    await addMark(item);
    $isLoading = false;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4">
  <Accordion>
    {#each genericFeeds?.items ?? [] as feed}
      <FeedOverview on:mark={(e) => mark(e.detail)} {feed} />
    {/each}
  </Accordion>
</div>
