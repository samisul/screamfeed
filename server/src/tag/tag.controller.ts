import { Controller, UseGuards } from '@nestjs/common';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { TagService } from './tag.service';

@UseGuards(LoggedInGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}
}
