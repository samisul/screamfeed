import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/core/auth.model';
import { ListRes } from 'src/core/dtos/global.dto';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { AddMarkDto, MarkDto } from './mark.model';
import { MarkService } from './mark.service';

@UseGuards(LoggedInGuard)
@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Get()
  async get(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<MarkDto>> {
    const _feeds = await this.markService.get(req.user.sub);
    return { items: _feeds };
  }

  @Post()
  async add(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: AddMarkDto,
  ): Promise<void> {
    await this.markService.add(req.user.sub, body);
  }
}
