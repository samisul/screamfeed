import type { FeedDto, GenericFeed } from '$lib/feed/model';
import type { ListRes } from '$lib/global';
import type { TagDto } from '$lib/tag/model';

export interface PageModel {
  parsedFeeds: ListRes<GenericFeed> | undefined;
  feeds: ListRes<FeedDto> | undefined;
  tags: ListRes<TagDto> | undefined;
}
