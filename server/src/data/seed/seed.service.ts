import { Injectable } from '@nestjs/common';
import { Feed } from 'src/core/entities/feed/feed.entity';
import { EntityManager } from 'typeorm';
import { feedSeed } from './data/feed.seed';

@Injectable()
export class SeedService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    const _feeds = this.entityManager.create(Feed, feedSeed);
    await this.entityManager.save(Feed, _feeds);
  }
}
