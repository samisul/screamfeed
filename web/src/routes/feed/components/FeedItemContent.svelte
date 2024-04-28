<script lang="ts">
  import { type SvelteComponent } from 'svelte';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { CloseOutline } from 'flowbite-svelte-icons';

  export let parent: SvelteComponent;

  const modalStore = getModalStore();
  const cBase =
    'w-screen flex gap-6 items-center bg-surface-100-800-token h-screen fixed top-0 left-0 z-50';
</script>

{#if $modalStore[0]}
  <div class={cBase}>
    <div class="lg:w-full max-w-4xl m-auto">
      <div class="flex items-center lg:gap-4">
        <button on:click={parent.onClose} type="button" class="btn bg-transparent">
          <CloseOutline />
        </button>
        <a
          href={$modalStore[0].meta.item.link}
          target="_blank"
          class="text-3xl font-bold hover:border-b"
        >
          {$modalStore[0].meta.item.title}
          <i class="block text-gray-500 text-xs">{$modalStore[0].meta.item.date}</i>
        </a>
      </div>
      <p
        class="text-sm max-h-[80vh] overflow-y-scroll p-4"
        bind:innerHTML={$modalStore[0].meta.item.content}
        contenteditable
      ></p>
    </div>
  </div>
{/if}
