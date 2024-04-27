<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { AccordionItem } from '@skeletonlabs/skeleton';
  import FeedOverviewContent from '../components/FeedOverviewContent.svelte';

  export let feed: GenericFeed;
</script>

<AccordionItem>
  <svelte:fragment slot="summary">{feed.title}</svelte:fragment>
  <svelte:fragment slot="content">
    <ul>
      <div class="list-nav w-full">
        <FeedOverviewContent {feed}></FeedOverviewContent>
      </div>
    </ul>
  </svelte:fragment>
</AccordionItem>
