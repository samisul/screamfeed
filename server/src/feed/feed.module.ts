import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { DataModule } from 'src/data/data.module';
import { Feed } from 'src/core/entities/feed.entity';
import { User } from 'src/core/entities/user.entity';

@Module({
  imports: [DataModule.forFeature([Feed, User])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [],
})
export class FeedModule {}
