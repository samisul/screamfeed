import { getTags } from '$lib/tag';
import { isLoading } from '../../stores/global.store';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _tagsList = await getTags();
  isLoading.set(false);

  return {
    tags: _tagsList
  };
}
