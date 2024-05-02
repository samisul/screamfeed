<script lang="ts">
  import { ProgressBar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
  import { FileImportSolid } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { isLoading } from '../../stores/global.store';
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
  <TabAnchor href="/misc/inout" selected={$page.url.pathname === '/misc/inout'}>
    <svelte:fragment slot="lead">
      <FileImportSolid></FileImportSolid>
    </svelte:fragment>
  </TabAnchor>
</TabGroup>
{#if $isLoading}
  <ProgressBar rounded="rounded-none" height="h-[4px]" />
{/if}
<slot />
