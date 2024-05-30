import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { LoggedInGuard } from 'src/core/guards/logged-in.guard';
import { AddFeedReq, FeedDto, GenericFeed } from './feed.model';
import { ListRes } from 'src/core/core.model';
import { BooleanTransformer } from 'src/core/transformers/boolean.transformer';
import { FindFeedService } from './find-feed.service';
import { Feed } from './feed.entity';
import { JwtPayload } from 'src/user/user.model';

@Controller('feeds')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly findFeedService: FindFeedService,
  ) {}

  @UseGuards(LoggedInGuard)
  @Get()
  async getFeeds(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<FeedDto>> {
    const _feeds = await this.feedService.get(req.user.sub);
    return { items: _feeds };
  }

  @UseGuards(LoggedInGuard)
  @Post('parsed')
  async getParsedFeeds(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: { urls?: string[] },
    @Query('refresh', BooleanTransformer) refresh?: boolean,
  ): Promise<ListRes<GenericFeed>> {
    const _parsedFeeds = await this.feedService.getParsedFeedsFromURLs(
      req.user.sub,
      refresh ?? false,
      body.urls,
    );
    return { items: _parsedFeeds };
  }

  @UseGuards(LoggedInGuard)
  @Post()
  async addFeed(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: AddFeedReq,
  ): Promise<Feed | undefined> {
    return await this.feedService.add(body, req.user.sub);
  }

  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<void> {
    await this.feedService.remove(id, req.user.sub);
  }

  @UseGuards(LoggedInGuard)
  @Get('list')
  async list(
    @Req() req: Request & { user: JwtPayload },
  ): Promise<ListRes<FeedDto>> {
    const _feeds = await this.feedService.list(req.user.sub);
    return { items: _feeds };
  }

  @Get('find')
  async findFeed(@Query('url') url: string): Promise<ListRes<string>> {
    const _feedUrls = await this.findFeedService.findRSSFeed(url);
    return { items: _feedUrls };
  }
}
