<script lang="ts">
  import { ProgressBar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
  import { FileImportSolid, NewspaperOutline, LinkOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { isLoading } from '../../stores/global.store';
  import { isLoggedIn } from '../../stores/user.store';
</script>

<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none"
  rounded=""
  border=""
  class=" w-full"
>
  <TabAnchor href="/misc/quick-feed" selected={$page.url.pathname === '/misc/quick-feed'}>
    <svelte:fragment slot="lead">
      <NewspaperOutline></NewspaperOutline>
    </svelte:fragment>
  </TabAnchor>
  <TabAnchor href="/misc/find-feed" selected={$page.url.pathname === '/misc/find-feed'}>
    <svelte:fragment slot="lead">
      <LinkOutline></LinkOutline>
    </svelte:fragment>
  </TabAnchor>
  {#if $isLoggedIn}
    <TabAnchor href="/misc/inout" selected={$page.url.pathname === '/misc/inout'}>
      <svelte:fragment slot="lead">
        <FileImportSolid></FileImportSolid>
      </svelte:fragment>
    </TabAnchor>
  {/if}
</TabGroup>
{#if $isLoading}
  <ProgressBar rounded="rounded-none" height="h-[4px]" />
{/if}
<slot />
