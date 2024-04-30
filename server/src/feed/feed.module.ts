import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { DataModule } from 'src/data/data.module';
import { Feed } from 'src/core/entities/feed/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { FeedCache } from 'src/core/entities/feed/feed-cache.entity';
import { FeedItemCache } from 'src/core/entities/feed/feed-item-cache.entity';

@Module({
  imports: [
    HttpModule,
    DataModule.forFeature([Feed, User, FeedCache, FeedItemCache]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [],
})
export class FeedModule {}
