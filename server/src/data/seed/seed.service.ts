import { Injectable } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { EntityManager } from 'typeorm';
import { feedSeed } from './data/feed.seed';
import { userSeed } from './data/user.seed';
import { Feed } from 'src/core/entities/feed/feed.entity';

@Injectable()
export class SeedService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    const _users = this.entityManager.create(User, userSeed);
    const _feeds = this.entityManager.create(Feed, feedSeed);

    await this.entityManager.save(Feed, _feeds);
    _users[0].feeds = _feeds;
    await this.entityManager.save(User, _users);
  }
}
