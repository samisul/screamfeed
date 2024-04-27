<script lang="ts">
  import { getUserOverview } from '$lib/user';
</script>

<div class="lg:p-4">TO BE IMPLEMENTED</div>

{#await getUserOverview() then data}
  {data?.name}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
