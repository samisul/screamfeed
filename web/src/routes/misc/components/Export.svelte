<script lang="ts">
  import { UploadSolid } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="w-full lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
  <button
    on:click={() => dispatch('onExport')}
    type="button"
    class="btn variant-filled-surface w-full"
  >
    <UploadSolid />
  </button>
</div>
