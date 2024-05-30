import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { DataModule } from 'src/data/data.module';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { Feed } from 'src/feed/feed.entity';
import { FeedUser } from 'src/feed/feed-user.entity';

@Module({
  imports: [DataModule.forFeature([Tag, User, Feed, FeedUser])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
