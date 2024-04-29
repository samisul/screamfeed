import type { GenericFeedItem } from '$lib/feed/model';

export interface AddMarkDto {
  item: GenericFeedItem;
}

export interface MarkDto {
  id: string;
  item: GenericFeedItem;
}
