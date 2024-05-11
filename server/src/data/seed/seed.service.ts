import { Injectable } from '@nestjs/common';
import { Feed } from 'src/feed/feed.entity';
import { User } from 'src/user/user.entity';
import { EntityManager } from 'typeorm';
import { feedSeed } from './data/feed.seed';
import { userSeed } from './data/user.seed';
import { FeedUser } from 'src/feed/feed-user.entity';

@Injectable()
export class SeedService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    const _feeds = this.entityManager.create(Feed, feedSeed);
    const _users = this.entityManager.create(User, userSeed);

    const _user = _users[0];

    const _userFeeds: FeedUser[] = _feeds.map((f) => {
      const fu = new FeedUser();
      fu.feed = f;
      fu.user = _user;
      return fu;
    });

    await this.entityManager.save(_user);
    await this.entityManager.save(_feeds);
    await this.entityManager.save(_userFeeds);
  }
}
