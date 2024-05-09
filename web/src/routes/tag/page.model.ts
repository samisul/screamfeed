import type { ListRes } from '$lib/global';
import type { TagPreviewDto } from '$lib/tag/model';

export interface PageModel {
  tags: ListRes<TagPreviewDto> | undefined;
}
