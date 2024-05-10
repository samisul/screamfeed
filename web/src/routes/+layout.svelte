<script lang="ts">
  import '../app.postcss';
  import { ProgressBar, TabAnchor, TabGroup, type ModalComponent } from '@skeletonlabs/skeleton';
  import {
    ProfileCardSolid,
    PenNibSolid,
    NewspaperSolid,
    MapPinSolid,
    CogSolid,
    TagSolid
  } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { isLoading } from '../stores/global.store';
  import { initializeStores as initModalStore, Modal } from '@skeletonlabs/skeleton';
  import FeedItemContent from './feed/overview/components/FeedItemContent.svelte';
  import { initializeStores as initToastStore, Toast } from '@skeletonlabs/skeleton';
  import { isLoggedIn } from '../stores/user.store';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { prefs } from '../stores/prefs.store';
  import UpsertTag from './tag/components/UpsertTag.svelte';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  initModalStore();
  initToastStore();

  const modalRegistry: Record<string, ModalComponent> = {
    feedItemContent: { ref: FeedItemContent },
    upsertTag: { ref: UpsertTag }
  };

  onMount(() => {
    const _listener = (document.onkeyup = (e) => {
      switch (e.key) {
        case '1':
          goto('/');
          break;
        case '2':
          goto('/feed/list');
          break;
        case '3':
          goto('/feed/overview');
          break;
        case '4':
          {
            if ($prefs?.marks) goto('/feed/marks');
          }
          break;
        case '5':
          goto('/tag');
          break;
        case '6':
          goto('/feed/find');
          break;
      }
    });

    return () => {
      document.removeEventListener('keydown', _listener);
    };
  });
</script>

<Toast position="bl" max={4} padding="p-3" buttonDismiss="bg-transparent" />
<Modal components={modalRegistry} />
<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none"
  border=""
  class="bg-surface-100-800-token w-full"
>
  <TabAnchor href="/" selected={$page.url.pathname === '/'}>
    <svelte:fragment slot="lead"><ProfileCardSolid></ProfileCardSolid></svelte:fragment>
  </TabAnchor>
  {#if $isLoggedIn}
    <TabAnchor href="/feed/list" selected={$page.url.pathname.includes('/feed/list')}>
      <svelte:fragment slot="lead"><PenNibSolid></PenNibSolid></svelte:fragment>
    </TabAnchor>
    <TabAnchor href="/feed/overview" selected={$page.url.pathname.includes('/feed/overview')}>
      <svelte:fragment slot="lead">
        <NewspaperSolid></NewspaperSolid>
      </svelte:fragment>
    </TabAnchor>
    {#if $prefs?.marks}
      <TabAnchor href="/feed/marks" selected={$page.url.pathname.includes('/feed/marks')}>
        <svelte:fragment slot="lead">
          <MapPinSolid></MapPinSolid>
        </svelte:fragment>
      </TabAnchor>
    {/if}
    <TabAnchor href="/tag" selected={$page.url.pathname.includes('/tag')}>
      <svelte:fragment slot="lead">
        <TagSolid></TagSolid>
      </svelte:fragment>
    </TabAnchor>
    <TabAnchor
      href="/feed/find"
      selected={$page.url.pathname.includes('/feed/find') ||
        $page.url.pathname.includes('/feed/inout') ||
        $page.url.pathname.includes('/feed/prefs')}
    >
      <svelte:fragment slot="lead">
        <CogSolid></CogSolid>
      </svelte:fragment>
    </TabAnchor>
  {/if}
</TabGroup>
{#if $isLoading}
  <ProgressBar height="h-[4px]" />
{/if}
<div class="m-auto flex max-w-4xl flex-1 flex-col overflow-auto max-h-[95vh]">
  <slot />
</div>
