<script lang="ts">
  import type { GenericFeed } from '$lib/feed/model';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

  export let feeds: GenericFeed[] = [];
</script>

<Accordion>
  {#each feeds as feed}
    <AccordionItem open>
      <svelte:fragment slot="lead">(icon)</svelte:fragment>
      <svelte:fragment slot="summary">{feed.title} - {feed.description}</svelte:fragment>
      <svelte:fragment slot="content">(content)</svelte:fragment>
    </AccordionItem>
  {/each}
</Accordion>
