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
    private readonly feedCacheRepo: Repository<FeedCache>,
  ) {}

  async getCachesByFeedUrls(url: string[]): Promise<FeedCache[] | undefined> {
    const _feeds = await this.feedCacheRepo
      .createQueryBuilder('feedCache')
      .where('feedCache.feedUrl IN (:...urls)', { urls: url })
      .getMany();

    const _invalidFeeds = _feeds.filter(
      (f) => f.isInvalid || !f.parsedItems.length,
    );
    if (_invalidFeeds.length)
      await this.feedCacheRepo.delete(_invalidFeeds.map((f) => f.id));

    return _feeds.filter((f) => !f.isInvalid);
  }

  async invalidateCacheById(id: string): Promise<void> {
    await this.feedCacheRepo.update(id, { isInvalid: true });
  }

  async createCache(
    caches: {
      url: string;
      parsedFeed: GenericFeed;
    }[],
  ): Promise<FeedCache[]> {
    const _feedCaches = caches.map((cache) => {
      const cacheFeed = FeedCacheMappers.toFeedCache(
        cache.parsedFeed,
        cache.url,
      );
      const created = this.feedCacheRepo.create(cacheFeed);
      created.parsedItems = cache.parsedFeed.items;
      return created;
    });

    return this.feedCacheRepo.save(_feedCaches);
  }
}
