import type {
  RSSFeed,
  RSSFeedItem,
  AtomFeedEntry,
  AtomFeed,
  GenericFeedItem,
  FeedRes,
  GenericFeed
} from './model';

export function toGenericFeed(feed: FeedRes): GenericFeed {
  if (feed.type === 'rss')
    return {
      title: feed.feed.rss.channel.title,
      link: feed.feed.rss.channel.link,
      description: feed.feed.rss.channel.description,
      language: feed.feed.rss.channel.language,
      items: feed.feed.rss.channel.item.map(rssFeedItemToGenericFeedItem)
    };
  if (feed.type === 'atom')
    return {
      title: feed.feed.feed.title,
      link: feed.feed.feed.link[0].href,
      updated: feed.feed.feed.updated,
      items: feed.feed.feed.entry.map(atomFeedEntryToGenericFeedItem)
    };
  throw new Error('Unsupported feed type');
}

export function toRSSFeed(feed: any): RSSFeed {
  return {
    rss: {
      channel: {
        title: feed.rss.channel.title,
        link: feed.rss.channel.link,
        description: feed.rss.channel.description,
        language: feed.rss.channel.language,
        item: feed.rss.channel.item.map(toRSSFeedItem)
      }
    }
  };
}

export function toAtomFeed(feed: any): AtomFeed {
  return {
    feed: {
      title: feed.feed.title,
      link: feed.feed.link,
      updated: feed.feed.updated,
      entry: feed.feed.entry.map(toAtomFeedEntry)
    }
  };
}

function toRSSFeedItem(item: any): RSSFeedItem {
  return {
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: item.pubDate,
    guid: item.guid
  };
}

function toAtomFeedEntry(entry: any): AtomFeedEntry {
  return {
    title: entry.title,
    link: entry.link,
    id: entry.id,
    updated: entry.updated,
    summary: entry.summary
  };
}

function rssFeedItemToGenericFeedItem(item: RSSFeedItem): GenericFeedItem {
  return {
    id: item.guid,
    title: item.title,
    link: [item.link],
    content: item.description,
    data: item.pubDate
  };
}

function atomFeedEntryToGenericFeedItem(entry: AtomFeedEntry): GenericFeedItem {
  return {
    id: entry.id,
    title: entry.title,
    link: typeof entry.link === 'string' ? entry.link : entry.link?.map((l) => l.href),
    content: entry.summary,
    data: entry.updated
  };
}
