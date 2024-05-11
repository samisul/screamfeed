<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { addTag } from '$lib/tag';
  import type { UpsertTagReq } from '$lib/tag/model';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { CheckOutline, CloseOutline, PlusOutline } from 'flowbite-svelte-icons';
  import type { SvelteComponent } from 'svelte';

  export let parent: SvelteComponent;
  const modalStore = getModalStore();

  const form = {
    selectedTags: $modalStore[0].meta.selectedTags
  };

  const cBase =
    'w-screen flex gap-6 items-center bg-surface-100-800-token h-screen fixed top-0 left-0 z-50';

  let newTag = '';
  let tagList = $modalStore[0].meta.tagList;

  async function createTag() {
    if (!newTag) return;

    const _res = await addTag({ name: newTag, feedIds: [] } as UpsertTagReq);

    if (!_res) return;

    invalidateAll();
    tagList = [...tagList, _res];
  }

  function submit() {
    if (form.selectedTags.includes('__NONE__')) form.selectedTags = [];
    const _res = $modalStore[0].response;
    if (_res) _res(form.selectedTags);
    parent.onClose();
  }
</script>

{#if $modalStore[0]}
  <div class={cBase}>
    <div class="lg:w-full flex items-center lg:gap-4 max-w-4xl m-auto">
      <form class="lg:w-1/2">
        <button on:click={parent.onClose} type="button" class="btn bg-transparent">
          <CloseOutline />
        </button>
        <div class="flex flex-col gap-14">
          <div>
            <input
              class="input bg-transparent"
              type="text"
              placeholder="Create New Tag"
              bind:value={newTag}
            />
            <button
              disabled={!newTag}
              class="btn variant-filled-primary w-full"
              on:click={createTag}
            >
              <PlusOutline />
            </button>
          </div>
          <div>
            <select class="select max-h-[95vh]" multiple bind:value={form.selectedTags}>
              <option value="__NONE__" class="text-gray-500">None</option>
              {#each tagList as tag}
                <option value={tag.id}>{tag.name}</option>
              {/each}
            </select>
            <button class="btn variant-filled-primary w-full" on:click={submit}>
              <CheckOutline />
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
