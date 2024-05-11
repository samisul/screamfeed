<script lang="ts">
  import { addFeed, getFeedUrls } from '$lib/feed';
  import { invalidUrl } from '$lib/helpers';
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Export from './components/Export.svelte';
  import Import from './components/Import.svelte';
  import { isLoggedIn } from '../../../stores/user.store';
  import { isLoading } from '../../../stores/global.store';

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
      <Import
        bind:imports
        bind:files
        on:saveImports={saveImports}
        on:uploadImportFiles={uploadImportFiles}
      ></Import>
    {:else if tabSet === 1}
      <div class="lg:p-4 p-2 flex flex-col gap-4 justify-center align-middle items-center">
        <Export on:onExport={onExport}></Export>
      </div>
    {/if}
  </svelte:fragment>
</TabGroup>
