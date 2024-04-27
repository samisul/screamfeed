export interface FeedDto {
  id: string;
  url: string;
}

export interface AddFeedReq {
  url: string;
}

export interface GenericFeed {
  title: string;
  link: string;
  description?: string;
  language?: string;
  updated?: string;
  items: GenericFeedItem[];
}

export interface GenericFeedItem {
  id: string;
  title: string;
  link: string;
  content: string;
  data: string;
}
