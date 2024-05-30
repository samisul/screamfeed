import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListRes } from 'src/core/core.model';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { AddMarkDto, MarkDto } from './mark.model';
import { MarkService } from './mark.service';
import { Mark } from 'src/mark/mark.entity';
import { JwtPayload } from 'src/user/user.model';

@UseGuards(LoggedInGuard)
@Controller('marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Get()
  async get(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<MarkDto>> {
    const _marks = await this.markService.get(req.user.sub);
    return { items: _marks };
  }

  @Post()
  async add(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: AddMarkDto,
  ): Promise<Mark | undefined> {
    return await this.markService.add(req.user.sub, body);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
  ): Promise<void> {
    await this.markService.remove(req.user.sub, id);
  }
}
