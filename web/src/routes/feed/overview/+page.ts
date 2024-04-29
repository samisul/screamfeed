import { getParsedFeeds } from '$lib/feed';
import { isLoading } from '../../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _feeds = await getParsedFeeds();
  isLoading.set(false);

  return {
    feeds: _feeds
  };
}
