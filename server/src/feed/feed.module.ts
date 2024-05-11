import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { DataModule } from 'src/data/data.module';
import { User } from 'src/user/user.entity';
import { HttpModule } from '@nestjs/axios';
import { FeedCacheService } from './cache/feed-cache.service';
import { FindFeedService } from './find-feed.service';
import { Feed } from './feed.entity';
import { FeedCache } from './feed-cache.entity';
import { FeedUser } from './feed-user.entity';

@Module({
  imports: [
    HttpModule,
    DataModule.forFeature([Feed, User, FeedCache, FeedUser]),
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedCacheService, FindFeedService],
  exports: [],
})
export class FeedModule {}
