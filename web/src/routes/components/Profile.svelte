<script lang="ts">
  import { getUserOverview } from '$lib/user';
  import { isLoading } from '../../stores/global.store';

  async function getOverview() {
    $isLoading = true;
    const _user = await getUserOverview();
    $isLoading = false;
    return _user;
  }
</script>

<div class="lg:p-4">
  {#await getOverview() then data}
    {data?.name}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
