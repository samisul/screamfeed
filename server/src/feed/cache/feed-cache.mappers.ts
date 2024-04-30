import { FeedCache } from 'src/core/entities/feed/feed-cache.entity';
import { GenericFeed } from '../feed.model';

export class FeedCacheMappers {
  static toGenericFeed(feedCache: FeedCache): GenericFeed {
    return {
      title: feedCache.title,
      link: feedCache.link,
      description: feedCache.description,
      language: feedCache.language,
      updated: feedCache.updated,
      items: feedCache.parsedItems,
      feedUrl: feedCache.feedUrl,
    };
  }

  static toFeedCache(feed: GenericFeed, url: string): FeedCache {
    return {
      feedUrl: url,
      title: feed.title,
      link: feed.link,
      description: feed.description,
      language: feed.language,
      updated: feed.updated,
      parsedItems: feed.items,
    } as FeedCache;
  }
}
