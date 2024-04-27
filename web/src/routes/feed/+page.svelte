<script lang="ts">
  import type { FeedDto } from '$lib/feed/model';
  import type { ListRes } from '$lib/global';
  import { getFeedUrls } from '$lib/feed/index';
  import { isLoading } from '../../stores/global.store';

  async function get(): Promise<ListRes<FeedDto> | undefined> {
    $isLoading = true;
    const _urls = await getFeedUrls();
    $isLoading = false;
    return _urls;
  }
</script>

<div class="lg:p-4 p-2 flex flex-col justify-center align-middle items-center">
  {#await get() then data}
    <nav class="list-nav">
      <ul>
        {#each data?.items ?? [] as item}
          <li>
            <a href={'/feed/' + item.url}>
              <!-- <span class="badge bg-primary-500">(icon)</span> -->
              <span class="flex-auto">{item.title}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
