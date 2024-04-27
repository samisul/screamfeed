<script lang="ts">
  export let data: { id: string } | undefined = undefined;
</script>

<div>
  {data?.id}
</div>
