import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
  ) {}

  async seed(): Promise<void> {}
}
