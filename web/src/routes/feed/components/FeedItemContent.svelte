<script lang="ts">
  import { type SvelteComponent } from 'svelte';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { CloseOutline } from 'flowbite-svelte-icons';

  export let parent: SvelteComponent;

  const modalStore = getModalStore();
  const cBase = 'w-screen max-h-screen flex flex-col gap-4 items-center bg-surface-100-800-token';
</script>

{#if $modalStore[0]}
  <div class={cBase}>
    <button on:click={parent.onClose} type="button" class="btn variant-outline-surface w-full">
      <CloseOutline />
    </button>
    <div class="lg:w-full max-w-4xl m-auto">
      <h1 class="text-2xl font-bold">
        {$modalStore[0].meta.item.title}
      </h1>
      <p
        class="text-sm max-h-[90vh] overflow-y-scroll p-4"
        bind:innerHTML={$modalStore[0].meta.item.content}
        contenteditable
      ></p>
    </div>
  </div>
{/if}
