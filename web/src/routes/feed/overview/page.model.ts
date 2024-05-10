import type { GenericFeed } from '$lib/feed/model';
import type { ListRes } from '$lib/global';
import type { TagPreviewDto } from '$lib/tag/model';

export interface PageModel {
  feeds: ListRes<GenericFeed> | undefined;
  tags: ListRes<TagPreviewDto> | undefined;
}
