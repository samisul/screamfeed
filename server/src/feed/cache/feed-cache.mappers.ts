import { FeedCache } from 'src/core/entities/feed/feed-cache.entity';
import { GenericFeed, GenericFeedItem } from '../feed.model';
import { FeedItemCache } from 'src/core/entities/feed/feed-item-cache.entity';

export class FeedCacheMappers {
  static toGenericFeed(feedCache: FeedCache): GenericFeed {
    return {
      title: feedCache.title,
      link: feedCache.link,
      description: feedCache.description,
      language: feedCache.language,
      updated: feedCache.updated,
      items: feedCache.items.map((item) => this.toGenericFeedItem(item)),
      feedUrl: feedCache.feedUrl,
    };
  }

  static toGenericFeedItem(feedCache: FeedItemCache): GenericFeedItem {
    return {
      id: feedCache.id,
      title: feedCache.title,
      link: feedCache.link,
      content: feedCache.content,
      date: feedCache.date,
    };
  }

  static toFeedCache(feed: GenericFeed, url: string): FeedCache {
    const feedCache = new FeedCache();
    feedCache.title = feed.title;
    feedCache.link = feed.link;
    feedCache.description = feed.description;
    feedCache.language = feed.language;
    feedCache.updated = feed.updated;
    feedCache.items = feed.items.map((item) => this.toFeedItemCache(item));
    feedCache.feedUrl = url;
    return feedCache;
  }

  static toFeedItemCache(item: GenericFeedItem): FeedItemCache {
    const feedItemCache = new FeedItemCache();
    feedItemCache.title = item.title;
    feedItemCache.link = item.link;
    feedItemCache.content = item.content;
    feedItemCache.date = item.date;
    return feedItemCache;
  }
}
