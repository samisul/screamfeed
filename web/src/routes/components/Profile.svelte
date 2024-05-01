<script lang="ts">
  import { getUserOverview, logout } from '$lib/user';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { isLoading } from '../../stores/global.store';
  import {} from 'flowbite-svelte-icons';

  async function getOverview() {
    $isLoading = true;
    const _user = await getUserOverview();
    $isLoading = false;
    return _user;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col justify-center align-middle items-center gap-1">
  {#await getOverview() then data}
    <Avatar src={data?.avatar ?? ''} width="w-32" rounded="rounded-none" />
    <h1>{data?.name}</h1>
    <p>{data?.email}</p>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  <button type="button" class="btn variant-filled-primary" on:click={logout}> Logout </button>
</div>
