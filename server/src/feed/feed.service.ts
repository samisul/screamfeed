import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Feed } from 'src/core/entities/feed.entity';
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

@Injectable()
export class FeedService {
  private readonly parser = new XMLParser({ ignoreAttributes: false });

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly httpService: HttpService,
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

  async getUserFeeds(userId: string): Promise<FeedDto[]> {
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
    const _feeds =
      feedURLs ?? (await this.getUserFeeds(userId)).map((f) => f.url);

    return (await this.getFeedsFromURLs(_feeds))
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
      .map((f) => FeedMappers.toGenericFeed(f!.feed as FeedRes, f?.url ?? ''));
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
