import { Feed } from './feed.entity';
import type {
  RSSFeed,
  RSSFeedItem,
  AtomFeedEntry,
  AtomFeed,
  GenericFeedItem,
  FeedRes,
  GenericFeed,
  FeedDto,
} from './feed.model';
import { Helpers } from 'src/core/helpers';

export class FeedMappers {
  static toFeedDto(feed: Feed): FeedDto {
    return { id: feed.id, url: feed.url, title: feed.title };
  }

  static toGenericFeed(feed: FeedRes, feedUrl: string): GenericFeed {
    if (feed.type === 'rss')
      return {
        title: feed.feed.rss.channel.title,
        link: feed.feed.rss.channel.link,
        description: feed.feed.rss.channel.description,
        language: feed.feed.rss.channel.language,
        items: feed.feed.rss.channel.item.map(
          FeedMappers.rssFeedItemToGenericFeedItem,
        ),
        feedUrl,
      };
    if (feed.type === 'atom')
      return {
        title: feed.feed.feed.title,
        link: feed.feed.feed.link[0].href,
        updated: feed.feed.feed.updated,
        items: feed.feed.feed.entry.map(
          FeedMappers.atomFeedEntryToGenericFeedItem,
        ),
        feedUrl,
      };
    throw new Error('Unsupported feed type');
  }

  static toRSSFeed(feed: any): RSSFeed {
    return {
      rss: {
        channel: {
          title: feed.rss.channel.title,
          link: feed.rss.channel.link,
          description: feed.rss.channel.description,
          language: feed.rss.channel.language,
          item: [feed.rss.channel.item].flat().map(FeedMappers.toRSSFeedItem),
        },
      },
    };
  }

  static toAtomFeed(feed: any): AtomFeed {
    return {
      feed: {
        title: feed.feed.title,
        link: feed.feed.link,
        updated: feed.feed.updated,
        entry: feed.feed.entry.map(FeedMappers.toAtomFeedEntry),
      },
    };
  }

  private static toRSSFeedItem(item: any): RSSFeedItem {
    return {
      title: item.title,
      link: item.link,
      content: item['content:encoded'] ?? item.description,
      pubDate: item.pubDate,
      guid: item.guid,
    };
  }

  private static toAtomFeedEntry(entry: any): AtomFeedEntry {
    return {
      title: entry.title,
      link: typeof entry.link === 'string' ? entry.link : entry.link['@_href'],
      id: entry.id,
      updated: entry.updated,
      summary: entry.content ?? entry.summary,
    };
  }

  private static rssFeedItemToGenericFeedItem(
    item: RSSFeedItem,
  ): GenericFeedItem {
    return {
      id: item.guid,
      title: item.title,
      link: item.link,
      content: item.content,
      date: item.pubDate,
    };
  }

  private static atomFeedEntryToGenericFeedItem(
    entry: AtomFeedEntry,
  ): GenericFeedItem {
    // todo: is this retarded?
    let content = '';
    if (typeof entry.summary === 'object')
      content = Helpers.findHTMLProp(entry.summary);
    else if (typeof entry.summary === 'string') content = entry.summary;

    return {
      id: entry.id,
      title: entry.title,
      link: entry.link,
      content: content,
      date: entry.updated,
    };
  }
}
