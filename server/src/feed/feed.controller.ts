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
import { AddFeedReq, GenericFeed } from './feed.model';
import { Feed } from 'src/core/entities/feed.entity';
import { FeedMappers } from './feed.mappers';
import { FeedDto } from 'src/core/dtos/feed.dto';
import { ListRes } from 'src/core/dtos/global.dto';

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
  async getFeeds(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<FeedDto>> {
    const _feeds = (await this.feedService.getUserFeeds(req.user.sub)).map(
      (feed) => FeedMappers.toFeedDto(feed),
    );
    return { items: _feeds };
  }

  @Post('parsed')
  async getParsedFeeds(
    @Body() body: { urls: string[] },
  ): Promise<ListRes<GenericFeed>> {
    const _parsedFeeds = await this.feedService.getParsedFeedsFromURLs(
      body.urls,
    );
    return { items: _parsedFeeds };
  }

  @Post()
  async addFeed(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: AddFeedReq,
  ): Promise<Feed | undefined> {
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
