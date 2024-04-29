<script lang="ts">
  import '../app.postcss';
  import { ProgressBar, TabAnchor, TabGroup, type ModalComponent } from '@skeletonlabs/skeleton';
  import {
    ProfileCardSolid,
    PenNibSolid,
    NewspaperSolid,
    FileImportSolid,
    MapPinSolid
  } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { isLoading } from '../stores/global.store';
  import { initializeStores as initModalStore, Modal } from '@skeletonlabs/skeleton';
  import FeedItemContent from './feed/components/FeedItemContent.svelte';
  import { initializeStores as initToastStore, Toast } from '@skeletonlabs/skeleton';

  initModalStore();
  initToastStore();

  const modalRegistry: Record<string, ModalComponent> = {
    feedItemContent: { ref: FeedItemContent }
  };
</script>

<Toast rounded="rounded-none" position="bl" max={4} padding="p-3" buttonDismiss="bg-transparent" />
<Modal components={modalRegistry} />
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
  <TabAnchor href="/feed/inout" selected={$page.url.pathname.includes('/feed/inout')}>
    <svelte:fragment slot="lead">
      <FileImportSolid></FileImportSolid>
    </svelte:fragment>
  </TabAnchor>
  <TabAnchor href="/feed/marks" selected={$page.url.pathname.includes('/feed/marks')}>
    <svelte:fragment slot="lead">
      <MapPinSolid></MapPinSolid>
    </svelte:fragment>
  </TabAnchor>
</TabGroup>
{#if $isLoading}
  <ProgressBar rounded="rounded-none" height="h-[4px]" />
{/if}
<div class="m-auto flex max-w-4xl flex-1 flex-col overflow-auto max-h-[95vh]">
  <slot />
</div>
