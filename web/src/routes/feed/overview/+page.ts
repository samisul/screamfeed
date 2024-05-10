import { getParsedFeeds } from '$lib/feed';
import { getTags } from '$lib/tag';
import { isLoading } from '../../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _feeds = await getParsedFeeds();
  const _tags = await getTags();
  isLoading.set(false);

  return {
    feeds: _feeds,
    tags: _tags
  };
}
