export interface AddFeedReq {
  url: string;
  title: string;
}

interface RSSFeedRes {
  type: 'rss';
  feed: RSSFeed;
}

interface AtomFeedRes {
  type: 'atom';
  feed: AtomFeed;
}

export type FeedRes = RSSFeedRes | AtomFeedRes;

export interface RSSFeed {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      language: string;
      item: RSSFeedItem[];
    };
  };
}

export interface RSSFeedItem {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  guid: string;
}

export interface AtomFeed {
  feed: {
    title: string;
    link: { href: string }[];
    updated: string;
    entry: AtomFeedEntry[];
  };
}

export interface AtomFeedEntry {
  title: string;
  link: string;
  id: string;
  updated: string;
  summary: string;
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
