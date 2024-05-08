import { Controller, UseGuards } from '@nestjs/common';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@Controller('tag')
export class TagController {}
