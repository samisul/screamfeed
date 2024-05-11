import type { FeedDto } from '$lib/feed/model';
import type { ListRes } from '$lib/global';
import type { TagPreviewDto } from '$lib/tag/model';

export interface PageModel {
  feeds: ListRes<FeedDto> | undefined;
  tags: ListRes<TagPreviewDto> | undefined;
}
