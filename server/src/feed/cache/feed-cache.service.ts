import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCache } from 'src/core/entities/feed/feed-cache.entity';
import { Repository } from 'typeorm';
import { GenericFeed } from '../feed.model';
import { FeedCacheMappers } from './feed-cache.mappers';

@Injectable()
export class FeedCacheService {
  constructor(
    @InjectRepository(FeedCache)
    private readonly feedCache: Repository<FeedCache>,
  ) {}

  async getCachesByFeedUrls(url: string[]): Promise<FeedCache[] | undefined> {
    const _feeds = await this.feedCache
      .createQueryBuilder('feedCache')
      .where('feedCache.feedUrl IN (:...urls)', { urls: url })
      .getMany();

    const _invalidFeeds = _feeds.filter((f) => f.isInvalid);
    if (_invalidFeeds.length)
      await this.feedCache.delete(_invalidFeeds.map((f) => f.id));

    return _feeds.filter((f) => !f.isInvalid);
  }

  async invalidateCacheById(id: string): Promise<void> {
    await this.feedCache.update(id, { isInvalid: true });
  }

  async createCache(
    caches: {
      url: string;
      parsedFeed: GenericFeed;
    }[],
  ): Promise<FeedCache[]> {
    const _caches = caches.map((c) => {
      const _cache = this.feedCache.create(
        FeedCacheMappers.toFeedCache(c.parsedFeed, c.url),
      );
      _cache.feedUrl = c.url;
      return _cache;
    });

    return this.feedCache.save(_caches);
  }
}
