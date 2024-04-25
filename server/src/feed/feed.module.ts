import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { DataModule } from 'src/data/data.module';
import { Feed } from 'src/core/entities/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { Mark } from 'src/core/entities/mark.entity';

@Module({
  imports: [HttpModule, DataModule.forFeature([Feed, Mark, User])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [],
})
export class FeedModule {}
