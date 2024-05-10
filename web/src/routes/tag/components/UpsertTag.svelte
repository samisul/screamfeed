<script lang="ts">
  import { onMount, type SvelteComponent } from 'svelte';
  import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
  import { CheckOutline, CloseOutline } from 'flowbite-svelte-icons';
  import { type UpsertTagReq } from '$lib/tag/model';
  import { addTag, findTag, updateTag } from '$lib/tag';

  export let parent: SvelteComponent;

  const form: UpsertTagReq = {
    name: '',
    feedIds: []
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  const cBase =
    'w-screen flex gap-6 items-center bg-surface-100-800-token h-screen fixed top-0 left-0 z-50';

  onMount(async () => {
    const _tagId = $modalStore[0]?.meta.id;
    const _tag = _tagId ? await findTag(_tagId) : undefined;
    if (_tag) {
      form.name = _tag.name;
      form.feedIds = _tag.feeds.map((f) => f.id);
    }
  });

  async function submit(): Promise<void> {
    const _modal = $modalStore[0];
    const _feedIds = form.feedIds.includes('__NONE__')
      ? []
      : form.feedIds.filter((f) => f !== '__NONE__');

    let _res;

    if (_modal.meta.id) {
      _res = await updateTag(
        {
          ...form,
          feedIds: _feedIds
        },
        _modal.meta.id
      );
    } else {
      _res = await addTag({
        ...form,
        feedIds: _feedIds
      });
    }

    if (!_res) {
      toastStore.trigger({
        message: 'Error: Could not Add Tag',
        background: 'variant-filled-primary',
        hoverable: true
      });
      return;
    }

    if (_modal.response)
      _modal.response({
        tag: _modal.meta.id ? { ...form, id: _modal.meta.id } : _res,
        type: _modal.meta.id ? 'update' : 'add'
      });
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class={cBase}>
    <div class="lg:w-full max-w-4xl m-auto">
      <div class="flex items-center lg:gap-4">
        <form>
          <button on:click={parent.onClose} type="button" class="btn bg-transparent">
            <CloseOutline />
          </button>
          <input
            class="input bg-transparent"
            type="text"
            placeholder="Enter Tag Name"
            bind:value={form.name}
          />
          <select class="select max-h-[95vh]" multiple bind:value={form.feedIds}>
            <option value="__NONE__" class="text-gray-500">None</option>
            {#each $modalStore[0].meta.feedList as feed}
              <option value={feed.id}>{feed.title}</option>
            {/each}
          </select>
          <button
            class="btn variant-filled-primary w-full mt-4"
            on:click={submit}
            disabled={!form.name}
          >
            <CheckOutline />
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
