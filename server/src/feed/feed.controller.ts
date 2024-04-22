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
import { FeedService } from './feed.service';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { JwtPayload } from 'src/core/auth.model';
import { AddFeedReq } from './feed.model';

@UseGuards(LoggedInGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getUserFeeds(@Req() req: Request & { user: JwtPayload }) {
    return await this.feedService.getUserFeeds(req.user.sub);
  }

  @Post()
  async addFeed(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: AddFeedReq,
  ) {
    return await this.feedService.add(body.url, req.user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.feedService.remove(id, req.user.sub);
  }
}
