import type { TagPreviewDto } from '$lib/tag/model';

export interface FeedDto {
  id: string;
  url: string;
  title: string;
  tags: TagPreviewDto[];
}

export interface AddFeedReq {
  url: string;
  title: string;
}

export interface GenericFeed {
  title: string;
  link: string;
  description?: string;
  language?: string;
  updated?: string;
  items: GenericFeedItem[];
  feedUrl: string;
}

export interface GenericFeedItem {
  id: string;
  title: string;
  link: string;
  content: string;
  date: string;
}
