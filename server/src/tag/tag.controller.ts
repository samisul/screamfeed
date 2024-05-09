import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { TagService } from './tag.service';
import { Get } from '@nestjs/common';
import { JwtPayload } from 'src/user/user.model';
import { ListRes } from 'src/core/core.model';
import { TagPreviewDto, UpsertTagReq } from './tag.model';

@UseGuards(LoggedInGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async get(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<TagPreviewDto>> {
    const _tags = await this.tagService.get(req.user.sub);
    return { items: _tags };
  }

  @Get(':id')
  async getOne(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
  ): Promise<TagPreviewDto | null> {
    return await this.tagService.getOne(req.user.sub, id);
  }

  @Post()
  async add(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: UpsertTagReq,
  ): Promise<TagPreviewDto | undefined> {
    return await this.tagService.add(req.user.sub, body);
  }

  @Put(':id')
  async update(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: UpsertTagReq,
    @Param('id') id: string,
  ): Promise<TagPreviewDto | undefined> {
    return await this.tagService.update(req.user.sub, body, id);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
  ): Promise<void> {
    await this.tagService.remove(req.user.sub, id);
  }
}
