import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { DataModule } from 'src/data/data.module';
import { Tag } from 'src/tag/tag.entity';

@Module({
  imports: [DataModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
