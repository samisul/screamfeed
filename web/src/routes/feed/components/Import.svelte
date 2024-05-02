<script lang="ts">
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import { CheckCircleSolid, UploadSolid } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  export let imports: {
    checked: boolean;
    title: string;
    url: string;
  }[] = [];

  export let files: FileList;

  const dispatch = createEventDispatcher();
</script>

<div class="w-full lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
  <FileDropzone rounded="rounded-none" name="files" bind:files />
  <div class="space-y-2 w-full">
    {#each imports as imp}
      <label class="flex items-center space-x-2">
        <input class="checkbox" type="checkbox" bind:checked={imp.checked} />
        <input
          class="input"
          title="Input (text)"
          type="text"
          placeholder="URL"
          bind:value={imp.url}
        />
        <input
          class="input"
          title="Input (text)"
          type="text"
          placeholder="Title"
          bind:value={imp.title}
        />
      </label>
    {/each}
  </div>
  <button
    on:click={() => dispatch('uploadImportFiles')}
    type="button"
    class="btn variant-filled-surface w-full"
    disabled={!files}
  >
    <UploadSolid />
  </button>
  <button
    on:click={() => dispatch('saveImports')}
    type="button"
    class="btn variant-filled-surface w-full"
  >
    <CheckCircleSolid />
  </button>
</div>
