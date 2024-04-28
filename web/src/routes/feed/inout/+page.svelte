<script lang="ts">
  import { addFeed, getFeedUrls } from '$lib/feed';
  import { invalidUrl } from '$lib/helpers';
  import { FileDropzone, TabGroup, Tab } from '@skeletonlabs/skeleton';
  import { CheckCircleSolid, UploadSolid } from 'flowbite-svelte-icons';
  import { isLoading } from '../../../stores/global.store';
  import { onMount } from 'svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { goto } from '$app/navigation';

  let tabSet: number = 0;
  let files: FileList;

  let imports: {
    checked: boolean;
    title: string;
    url: string;
  }[] = [];

  onMount(() => {
    if (!$isLoggedIn) goto('/');
  });

  function uploadImportFiles() {
    for (let i = 0; i < files.length; i++) {
      const _file = files[i];
      const _reader = new FileReader();
      _reader.onload = (e) => {
        if (!e.target) return;
        const text = e.target.result as string;
        const lines = text.split('\n');
        for (let j = 0; j < lines.length; j++) {
          const line = lines[j];
          const [url, title] = line.split(' ');
          if (invalidUrl(url)) continue;
          imports = [...imports, { checked: true, title, url }];
        }
      };
      _reader.readAsText(_file);
    }
  }

  async function onExport() {
    const _urls = (await getFeedUrls())?.items;
    if (!_urls) return;
    const _text = _urls.map((url) => `${url.url} ${url.title}`).join('\n');
    const _blob = new Blob([_text], { type: 'text/plain' });
    const _url = URL.createObjectURL(_blob);
    const _a = document.createElement('a');
    _a.href = _url;
    _a.download = 'feeds.txt';
    _a.click();
    _a.remove();
  }

  async function saveImports() {
    const _checked = imports.filter((imp) => imp.checked);
    imports = [];
    $isLoading = true;
    Promise.all(_checked.map((imp) => addFeed({ url: imp.url, title: imp.title })));
    $isLoading = false;
  }
</script>

<TabGroup>
  <Tab bind:group={tabSet} name="import" value={0}>
    <svelte:fragment slot="lead">Import</svelte:fragment>
  </Tab>
  <Tab bind:group={tabSet} name="export" value={1}>Export</Tab>
  <svelte:fragment slot="panel">
    {#if tabSet === 0}
      <div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
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
          on:click={uploadImportFiles}
          type="button"
          class="btn variant-filled-surface w-full"
          disabled={!files}
        >
          <UploadSolid />
        </button>
        <button on:click={saveImports} type="button" class="btn variant-filled-surface w-full">
          <CheckCircleSolid />
        </button>
      </div>
    {:else if tabSet === 1}
      <div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
        <button on:click={onExport} type="button" class="btn variant-filled-surface w-full">
          <UploadSolid />
        </button>
      </div>
    {/if}
  </svelte:fragment>
</TabGroup>
