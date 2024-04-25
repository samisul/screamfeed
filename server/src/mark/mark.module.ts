import { Module } from '@nestjs/common';
import { MarkController } from './mark.controller';
import { MarkService } from './mark.service';
import { DataModule } from 'src/data/data.module';
import { Mark } from 'src/core/entities/mark.entity';

@Module({
  imports: [DataModule.forFeature([Mark])],
  controllers: [MarkController],
  providers: [MarkService],
})
export class MarkModule {}
