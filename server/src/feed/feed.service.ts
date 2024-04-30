import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Feed } from 'src/core/entities/feed/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import {
  GenericFeed,
  FeedRes,
  RSSFeed,
  AtomFeed,
  AddFeedReq,
} from './feed.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FeedMappers } from './feed.mappers';
import { FeedDto } from 'src/core/dtos/feed.dto';
import { FeedCacheService } from './cache/feed-cache.service';
import { FeedCacheMappers } from './cache/feed-cache.mappers';

@Injectable()
export class FeedService {
  private readonly parser = new XMLParser({ ignoreAttributes: false });

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly httpService: HttpService,
    private readonly feedCacheService: FeedCacheService,
  ) {}

  async add(feedDto: AddFeedReq, userId: string): Promise<Feed | undefined> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const feed = await this.feedRepo.findOne({
      where: { url: feedDto.url },
      relations: ['users'],
    });

    if (!feed) {
      const newFeed = this.feedRepo.create();
      newFeed.url = feedDto.url;
      newFeed.title = feedDto.title;
      newFeed.users = [user];
      return this.feedRepo.save(newFeed);
    }

    feed.users.push(user);
    return this.feedRepo.save(feed);
  }

  async remove(feedId: string, userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const feed = await this.feedRepo.findOne({
      where: { id: feedId },
      relations: ['users'],
    });
    if (!feed) return;

    feed.users = feed.users.filter((u) => u.id !== user.id);
    await this.feedRepo.save(feed);
  }

  async get(userId: string): Promise<FeedDto[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return [];

    const _pagedWords = await this.feedRepo
      .createQueryBuilder('feed')
      .leftJoin('feed.users', 'user')
      .where('user.id = :id', { id: userId })
      .orderBy('feed.createdAt', 'DESC')
      .getMany();

    return _pagedWords.map((f) => FeedMappers.toFeedDto(f));
  }

  async getParsedFeedsFromURLs(
    userId: string,
    feedURLs?: string[],
  ): Promise<GenericFeed[]> {
    let _feeds = feedURLs ?? (await this.get(userId)).map((f) => f.url);
    const _cachedFeeds =
      await this.feedCacheService.getCachesByFeedUrls(_feeds);

    console.log('CACHED,', _cachedFeeds);

    if (_cachedFeeds && _cachedFeeds.length)
      _feeds = _feeds.filter(
        (f) => !_cachedFeeds.map((cf) => cf.feedUrl).includes(f),
      );

    const _parsedFeedsToCache: { url: string; parsedFeed: GenericFeed }[] = [];
    const _parsedFeeds = (await this.getFeedsFromURLs(_feeds))
      .map((feed) => {
        const _parsedFeed = this.parser.parse(feed.feed ?? '');
        if (this.isRSSFeed(_parsedFeed))
          return {
            url: feed.urls,
            feed: { type: 'rss', feed: FeedMappers.toRSSFeed(_parsedFeed) },
          };
        if (this.isAtomFeed(_parsedFeed))
          return {
            url: feed.urls,
            feed: { type: 'atom', feed: FeedMappers.toAtomFeed(_parsedFeed) },
          };
        return undefined;
      })
      .filter((f) => !!f)
      .map((f) => {
        const _genericFeed = FeedMappers.toGenericFeed(
          f!.feed as FeedRes,
          f?.url ?? '',
        );
        _parsedFeedsToCache.push({ url: f!.url, parsedFeed: _genericFeed });
        return _genericFeed;
      });

    await this.feedCacheService.createCache(_parsedFeedsToCache);

    return [
      ..._parsedFeeds,
      ...(_cachedFeeds ?? []).map(FeedCacheMappers.toGenericFeed),
    ];
  }

  private async getFeedsFromURLs(feedURLs: string[]) {
    return (
      await Promise.all(
        feedURLs.map(async (feedURL) => ({
          urls: feedURL,
          feed: await this.getFeedFromURL(feedURL),
        })),
      )
    ).filter((f) => !!f);
  }

  private async getFeedFromURL(feedURL: string): Promise<string | undefined> {
    try {
      const _res = await firstValueFrom(this.httpService.get<string>(feedURL));
      if (_res.status !== 200) return undefined;
      if (!this.validateFeed(_res.data)) return undefined;
      return _res.data;
    } catch (e) {
      return undefined;
    }
  }

  private validateFeed(feed: string): boolean {
    return XMLValidator.validate(feed) === true ? true : false;
  }

  private isRSSFeed(feed: any): feed is RSSFeed {
    return 'rss' in feed;
  }

  private isAtomFeed(feed: any): feed is AtomFeed {
    return 'feed' in feed;
  }
}
