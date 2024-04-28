<script lang="ts">
  import '../app.postcss';
  import { ProgressBar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
  import { ProfileCardSolid, PenNibSolid, NewspaperSolid } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { isLoading } from '../stores/global.store';
</script>

<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none"
  rounded=""
  border=""
  class="bg-surface-100-800-token w-full"
>
  <TabAnchor href="/" selected={$page.url.pathname === '/'}>
    <svelte:fragment slot="lead"><ProfileCardSolid></ProfileCardSolid></svelte:fragment>
  </TabAnchor>
  <TabAnchor href="/feed/list" selected={$page.url.pathname.includes('/feed/list')}>
    <svelte:fragment slot="lead"><PenNibSolid></PenNibSolid></svelte:fragment>
  </TabAnchor>
  <TabAnchor href="/feed/overview" selected={$page.url.pathname.includes('/feed/overview')}>
    <svelte:fragment slot="lead">
      <NewspaperSolid></NewspaperSolid>
    </svelte:fragment>
  </TabAnchor>
</TabGroup>
{#if $isLoading}
  <ProgressBar rounded="rounded-none" height="h-[4px]" />
{/if}
<div class="m-auto flex max-w-4xl flex-1 flex-col overflow-auto max-h-[95vh]">
  <slot />
</div>
