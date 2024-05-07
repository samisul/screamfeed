<script lang="ts">
  import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
  import { CogOutline, FileImportSolid, LinkOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
</script>

{#if $page.url.pathname === '/feed/find' || $page.url.pathname === '/feed/inout' || $page.url.pathname === '/feed/prefs'}
  <TabGroup
    justify="justify-center"
    active="variant-filled-primary"
    hover="hover:variant-soft-primary"
    flex="flex-1 lg:flex-none"
    rounded=""
    border=""
    class=" w-full"
  >
    <TabAnchor href="/feed/find" selected={$page.url.pathname === '/feed/find'}>
      <svelte:fragment slot="lead">
        <LinkOutline></LinkOutline>
      </svelte:fragment>
    </TabAnchor>
    <TabAnchor href="/feed/inout" selected={$page.url.pathname === '/feed/inout'}>
      <svelte:fragment slot="lead">
        <FileImportSolid></FileImportSolid>
      </svelte:fragment>
    </TabAnchor>
    <TabAnchor href="/feed/prefs" selected={$page.url.pathname === '/feed/prefs'}>
      <svelte:fragment slot="lead">
        <CogOutline></CogOutline>
      </svelte:fragment>
    </TabAnchor>
  </TabGroup>
{/if}
<slot />
