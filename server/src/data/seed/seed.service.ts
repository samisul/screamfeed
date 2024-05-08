import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { feedSeed } from './data/feed.seed';
import { userSeed } from './data/user.seed';
import { User } from 'src/user/user.entity';
import { Feed } from 'src/feed/feed.entity';

@Injectable()
export class SeedService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    const _feeds = this.entityManager.create(Feed, feedSeed);
    const _users = this.entityManager.create(User, userSeed);

    _users[0].feeds = _feeds;

    await this.entityManager.save(_feeds);
    await this.entityManager.save(_users);
  }
}
