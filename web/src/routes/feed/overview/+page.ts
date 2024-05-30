import { getFeedUrls, getParsedFeeds } from '$lib/feed';
import { getTagsWithFeeds } from '$lib/tag';
import { isLoading } from '../../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _parsed = await getParsedFeeds();
  const _feeds = await getFeedUrls();
  const _tags = await getTagsWithFeeds();
  isLoading.set(false);

  return {
    parsedFeeds: _parsed,
    feeds: _feeds,
    tags: _tags
  };
}
