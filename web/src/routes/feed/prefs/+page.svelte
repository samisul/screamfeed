<script lang="ts">
  import type { Prefs } from '$lib/prefs/model';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { load, save } from '$lib/prefs';

  const toastStore = getToastStore();

  let prefs: Prefs | undefined = undefined;
  let form: Prefs | undefined = undefined;

  onMount(() => {
    prefs = load();
    form = { ...prefs };
  });

  function onSave(): void {
    if (!form) return;
    save(form);

    toastStore.trigger({
      message: 'Saved successfully',
      background: 'variant-filled-primary',
      hoverable: true
    });
  }

  function onReset(): void {
    if (!prefs) return;
    form = { ...prefs };
  }
</script>

<div class="lg:p-4 p-2 flex flex-col gap-4">
  {#if form}
    <h1 class="text-xl mb-4 border-b border-neutral-500">Preferences</h1>
    <label class="flex items-center space-x-2">
      <input class="checkbox" type="checkbox" bind:checked={form.marks} />
      <p>Marks</p>
    </label>
    <label class="flex items-center space-x-2">
      <input class="checkbox" type="checkbox" bind:checked={form.search} />
      <p>Search Bar</p>
    </label>
    <label class="flex items-center space-x-2">
      <input class="checkbox" type="checkbox" bind:checked={form.recommendations} />
      <p>Recommendations</p>
    </label>
    <div>
      <button class="variant-outline btn" on:click={onReset}>Reset</button>
      <button class="variant-filled-primary btn" on:click={onSave}>Save</button>
    </div>
  {/if}
</div>
