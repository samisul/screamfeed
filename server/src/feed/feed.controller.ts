import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
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
@Controller('feeds')
export class FeedController implements OnModuleInit {
  constructor(private readonly feedService: FeedService) {}
  async onModuleInit() {
    await this.feedService.getParsedFeedsFromURLs([
      'https://thelinuxcast.org/feed/feed.xml',
    ]);
  }

  @Get()
  async getUserFeeds(@Req() req: Request & { user: JwtPayload }) {
    return await this.feedService.getUserFeeds(req.user.sub);
  }

  @Get('parsed')
  async getParsedUserFeeds(@Body() body: { urls: string[] }) {
    return await this.feedService.getParsedFeedsFromURLs(body.urls);
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
