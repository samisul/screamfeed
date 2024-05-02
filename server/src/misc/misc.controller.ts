import { Controller, Get, Query } from '@nestjs/common';
import { ListRes } from 'src/core/dtos/global.dto';
import { Helpers } from 'src/core/helpers';

@Controller('misc')
export class MiscController {
  constructor() {}

  @Get('find-feed')
  async findFeed(@Query('url') url: string): Promise<ListRes<string>> {
    const _feedUrls = await Helpers.findRSSFeed(url);
    return { items: _feedUrls };
  }
}
