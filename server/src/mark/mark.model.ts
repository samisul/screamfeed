import { GenericFeedItem } from 'src/feed/feed.model';

export interface AddMarkDto {
  item: GenericFeedItem;
}

export interface MarkDto {
  id: string;
  item: GenericFeedItem;
}
