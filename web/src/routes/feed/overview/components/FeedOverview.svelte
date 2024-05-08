<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { AccordionItem } from '@skeletonlabs/skeleton';
  import FeedOverviewContent from './FeedOverviewContent.svelte';
  import { RefreshOutline } from 'flowbite-svelte-icons';
  import { getParsedFeeds } from '$lib/feed';

  export let feed: GenericFeed;

  async function refreshFeed() {
    const _feeds = await getParsedFeeds([feed.feedUrl], true);
    if (!_feeds) return;
    feed = { ..._feeds.items[0] };
  }
</script>

<div class="flex">
  <AccordionItem class="w-full">
    <svelte:fragment slot="summary">{feed.title}</svelte:fragment>
    <svelte:fragment slot="content">
      <ul class="w-full">
        <FeedOverviewContent {feed} on:mark></FeedOverviewContent>
      </ul>
    </svelte:fragment>
  </AccordionItem>
  <button type="button" class="btn btn-sm bg-initial" on:click={refreshFeed}>
    <RefreshOutline />
  </button>
</div>
