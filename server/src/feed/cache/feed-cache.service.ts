import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCache } from 'src/core/entities/feed/feed-cache.entity';
import { Repository } from 'typeorm';
import { GenericFeed } from '../feed.model';
import { FeedCacheMappers } from './feed-cache.mappers';
import { FeedItemCache } from 'src/core/entities/feed/feed-item-cache.entity';

@Injectable()
export class FeedCacheService {
  constructor(
    @InjectRepository(FeedCache)
    private readonly feedCacheRepo: Repository<FeedCache>,
    @InjectRepository(FeedItemCache)
    private readonly feedItemCacheRepo: Repository<FeedItemCache>,
  ) {}

  async getCachesByFeedUrls(url: string[]): Promise<FeedCache[] | undefined> {
    const _feeds = await this.feedCacheRepo
      .createQueryBuilder('feedCache')
      .where('feedCache.feedUrl IN (:...urls)', { urls: url })
      .leftJoinAndSelect('feedCache.items', 'items')
      .getMany();

    const _invalidFeeds = _feeds.filter((f) => f.isInvalid || !f.items.length);
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
  ): Promise<FeedCache[]> {}
}
