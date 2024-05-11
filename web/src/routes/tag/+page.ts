import { getFeedUrls } from '$lib/feed';
import { getTags } from '$lib/tag';
import { isLoading } from '../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _tagsList = await getTags();
  const _feedsList = await getFeedUrls();
  isLoading.set(false);

  return {
    tags: _tagsList,
    feeds: _feedsList
  };
}
