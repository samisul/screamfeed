<script lang="ts">
  import '../app.postcss';
  import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
  import { NewspaperSolid, ProfileCardSolid } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
</script>

<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none"
  rounded=""
  border=""
  class="bg-transparent w-full"
>
  <TabAnchor href="/" selected={$page.url.pathname === '/'}>
    <svelte:fragment slot="lead"><ProfileCardSolid></ProfileCardSolid></svelte:fragment>
  </TabAnchor>
  <TabAnchor href="/feed" selected={$page.url.pathname === '/feed'}>
    <svelte:fragment slot="lead"><NewspaperSolid></NewspaperSolid></svelte:fragment>
  </TabAnchor>
</TabGroup>
<div class="m-auto flex max-w-4xl flex-1 flex-col">
  <slot />
</div>
