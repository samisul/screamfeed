import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Feed } from 'src/core/entities/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import { GenericFeed, FeedRes, RSSFeed, AtomFeed } from './feed.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FeedMappers } from './feed.mappers';

@Injectable()
export class FeedService {
  private readonly parser = new XMLParser();

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly httpService: HttpService,
  ) {}

  async add(feedURL: string, userId: string): Promise<Feed | undefined> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const feed = await this.feedRepo.findOne({ where: { url: feedURL } });

    if (!feed) {
      const newFeed = this.feedRepo.create();
      newFeed.url = feedURL;
      newFeed.users = [user];
      return this.feedRepo.save(newFeed);
    }

    feed.users.push(user);
    return this.feedRepo.save(feed);
  }

  async remove(feedURL: string, userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const feed = await this.feedRepo.findOne({ where: { url: feedURL } });
    if (!feed) return;

    feed.users = feed.users.filter((u) => u.id !== user.id);
    await this.feedRepo.save(feed);
  }

  async getUserFeeds(userId: string): Promise<Feed[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return [];

    return await this.feedRepo.find({ where: { users: { id: user.id } } });
  }

  async getParsedFeedsFromURLs(feedURLs: string[]): Promise<GenericFeed[]> {
    return (await this.getFeedsFromURLs(feedURLs))
      .map((feed) => {
        const _parsedFeed = this.parser.parse(feed);
        if (this.isRSSFeed(_parsedFeed))
          return { type: 'rss', feed: FeedMappers.toRSSFeed(_parsedFeed) };
        if (this.isAtomFeed(_parsedFeed))
          return { type: 'atom', feed: FeedMappers.toAtomFeed(_parsedFeed) };
        return undefined;
      })
      .filter((f): f is FeedRes => !!f)
      .map((f) => FeedMappers.toGenericFeed(f));
  }

  private async getParsedFeedFromURL(
    feedURL: string,
  ): Promise<FeedRes | undefined> {
    const _feed = await this.getFeedFromURL(feedURL);
    if (!_feed) return undefined;
    const _parsedFeed = this.parser.parse(_feed);
    if (this.isRSSFeed(_parsedFeed))
      return { type: 'rss', feed: FeedMappers.toRSSFeed(_parsedFeed) };
    if (this.isAtomFeed(_parsedFeed))
      return { type: 'atom', feed: FeedMappers.toAtomFeed(_parsedFeed) };
    return undefined;
  }

  private async getFeedsFromURLs(feedURLs: string[]): Promise<string[]> {
    return (
      await Promise.all(
        feedURLs.map(async (feedURL) => await this.getFeedFromURL(feedURL)),
      )
    ).filter((f): f is string => !!f);
  }

  private async getFeedFromURL(feedURL: string): Promise<string | undefined> {
    const _res = await firstValueFrom(this.httpService.get<string>(feedURL));
    if (_res.status !== 200) return undefined;
    if (!this.validateFeed(_res.data)) return undefined;
    return _res.data;
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
