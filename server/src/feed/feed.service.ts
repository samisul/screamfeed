import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import {
  GenericFeed,
  FeedRes,
  RSSFeed,
  AtomFeed,
  AddFeedReq,
  FeedDto,
} from './feed.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FeedMappers } from './feed.mappers';
import { FeedCacheService } from './cache/feed-cache.service';
import { FeedCacheMappers } from './cache/feed-cache.mappers';
import { Feed } from './feed.entity';
import { FeedCache } from './feed-cache.entity';

@Injectable()
export class FeedService {
  private readonly parser = new XMLParser({ ignoreAttributes: false });

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly httpService: HttpService,
    private readonly feedCacheService: FeedCacheService,
  ) {}

  async list(userId: string): Promise<FeedDto[]> {
    const _userFeeds = await this.get(userId);

    const _feedsTheUserDoesntHave = await this.feedRepo
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.users', 'user')
      .getMany();

    return _feedsTheUserDoesntHave
      .filter((f) => !_userFeeds.map((uf) => uf.url).includes(f.url))
      .map((f) => FeedMappers.toFeedDto(f));
  }

  async add(feedDto: AddFeedReq, userId: string): Promise<Feed | undefined> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const feed = await this.feedRepo.findOne({
      where: { url: feedDto.url, title: feedDto.title },
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

    if (!feed.users.length) {
      await this.feedRepo.remove(feed);
      return;
    }

    await this.feedRepo.save(feed);
  }

  async get(userId: string): Promise<FeedDto[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return [];

    const _feeds = await this.feedRepo
      .createQueryBuilder('feed')
      .leftJoin('feed.users', 'user')
      .where('user.id = :id', { id: userId })
      .orderBy('feed.createdAt', 'DESC')
      .getMany();

    return _feeds.map((f) => FeedMappers.toFeedDto(f));
  }

  async getParsedFeedsFromURLs(
    userId: string,
    refresh: boolean,
    feedURLs?: string[],
  ): Promise<GenericFeed[]> {
    const _cachedFeeds: FeedCache[] = [];
    let _feeds = feedURLs ?? (await this.get(userId)).map((f) => f.url);

    if (!_feeds.length) return [];

    if (refresh === false)
      _cachedFeeds.push(
        ...((await this.feedCacheService.getCachesByFeedUrls(_feeds)) ?? []),
      );

    if (_cachedFeeds.length)
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

    if (_parsedFeedsToCache.length)
      await this.feedCacheService.createCache(_parsedFeedsToCache);

    return [
      ..._parsedFeeds,
      ...(_cachedFeeds ?? []).map(FeedCacheMappers.toGenericFeed),
    ];
  }

  private async getFeedsFromURLs(feedURLs: string[]): Promise<
    {
      urls: string;
      feed: string | undefined;
    }[]
  > {
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
