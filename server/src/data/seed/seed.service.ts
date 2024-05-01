import { Injectable } from '@nestjs/common';
import { Feed } from 'src/core/entities/feed/feed.entity';
import { EntityManager } from 'typeorm';
import { feedSeed } from './data/feed.seed';
import { userSeed } from './data/user.seed';
import { User } from 'src/core/entities/user.entity';

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
