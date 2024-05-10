import type { FeedDto } from '$lib/feed/model';
import type { ListRes } from '$lib/global';
import type { TagPreviewDto } from '$lib/tag/model';

export interface PageModel {
  tags: ListRes<TagPreviewDto> | undefined;
  feeds: ListRes<FeedDto> | undefined;
}
