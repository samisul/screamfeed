<script lang="ts">
  import { getParsedFeeds } from '$lib/feed';
  import type { GenericFeed } from '$lib/feed/model';
  import type { ListRes } from '$lib/global';
  import { isLoading } from '../../../stores/global.store';
  import { Accordion } from '@skeletonlabs/skeleton';
  import FeedOverview from '../components/FeedOverview.svelte';

  let load = true;
  let genericFeeds: ListRes<GenericFeed> | undefined = undefined;

  $: {
    if (load) {
      get();
      load = false;
    }
  }

  async function get(): Promise<void> {
    $isLoading = true;
    genericFeeds = await getParsedFeeds();
    $isLoading = false;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4">
  <Accordion autocollapse>
    {#each genericFeeds?.items ?? [] as feed}
      <FeedOverview {feed} />
    {/each}
  </Accordion>
</div>
