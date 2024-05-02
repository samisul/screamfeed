import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import parse from 'node-html-parser';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FindFeedService {
  private readonly types = [
    'application/rss+xml',
    'application/atom+xml',
    'application/rdf+xml',
    'application/rss',
    'application/atom',
    'application/rdf',
    'text/rss+xml',
    'text/atom+xml',
    'text/rdf+xml',
    'text/rss',
    'text/atom',
    'text/rdf',
  ];

  constructor(private readonly httpService: HttpService) {}

  async findRSSFeed(url: string): Promise<string[]> {
    const _rssLink: string[] = [];

    _rssLink.push(...this.tryConstructFeed(url));

    if (_rssLink.length) return _rssLink;

    const response = await firstValueFrom(this.httpService.get(url));
    if (response.status !== 200) return [];

    const doc = parse(response.data);

    this.types.forEach((type) => {
      const rssLinks = doc.querySelectorAll(`link[type="${type}"]`);
      rssLinks.forEach((rssLink) => {
        const _l = rssLink.getAttribute('href');
        if (_l) _rssLink.push(_l);
      });
    });

    if (!_rssLink.length) _rssLink.push(...this.tryConstructFeed(url));

    return _rssLink;
  }

  private tryConstructFeed(url: string): string[] {
    const _reddit = this.tryGetRedditFeed(url);
    const _medium = this.tryGetMediumFeed(url);

    if (_reddit) return _reddit;
    if (_medium) return _medium;

    return [];
  }

  private tryGetRedditFeed(url: string): string[] {
    const _isReddit = url.match(/reddit\.com\/r\/\w+/);
    if (!_isReddit) return [];

    const _sub = _isReddit ? _isReddit[0].split('/')[2] : null;
    if (_sub) return [`https://www.reddit.com/r/${_sub}/.rss`];

    return [];
  }

  private tryGetMediumFeed(url: string): string[] {
    const _isMedium = url.match(/medium\.com\/\w+/);
    if (!_isMedium) return [];

    const _user = _isMedium ? _isMedium[0].split('/')[2] : null;
    if (_user) return [`https://medium.com/feed/${_user}`];

    return [];
  }
}
