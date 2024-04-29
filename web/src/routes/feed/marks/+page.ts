import { isLoading } from '../../../stores/global.store';
import { getMarks } from '$lib/mark';
import type { PageModel } from './page.model';

export async function load(): Promise<PageModel> {
  isLoading.set(true);
  const _feedItems = (await getMarks())?.items.map((markDto) => markDto.item) ?? [];
  isLoading.set(false);

  return {
    marks: _feedItems
  };
}
