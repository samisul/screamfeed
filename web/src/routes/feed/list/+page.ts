import { getFeedUrls } from '$lib/feed';
import { getTags } from '$lib/tag';
import { isLoading } from '../../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _feedListRes = await getFeedUrls();
  const _tags = await getTags();
  isLoading.set(false);

  return {
    feeds: _feedListRes,
    tags: _tags
  };
}
