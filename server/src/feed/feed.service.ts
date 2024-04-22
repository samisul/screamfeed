import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/core/entities/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
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
}
