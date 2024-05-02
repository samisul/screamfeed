import { NodeType, parse } from 'node-html-parser';
import axios from 'axios';

export class Helpers {
  private static readonly types = [
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

  static findHTMLProp(obj: any): string {
    let propHTMLContent = '';
    for (const key in obj) {
      const doc = parse(obj[key]);
      if (doc.nodeType === NodeType.ELEMENT_NODE) {
        propHTMLContent = doc.outerHTML;
        break;
      }
    }
    return propHTMLContent;
  }

  static async findRSSFeed(url: string): Promise<string[]> {
    const _rssLink: string[] = [];

    _rssLink.push(...Helpers.tryConstructFeed(url));

    if (_rssLink.length) return _rssLink;

    const response = await axios.get(url);
    const doc = parse(response.data);

    Helpers.types.forEach((type) => {
      const rssLinks = doc.querySelectorAll(`link[type="${type}"]`);
      rssLinks.forEach((rssLink) => {
        const _l = rssLink.getAttribute('href');
        if (_l) _rssLink.push(_l);
      });
    });

    if (!_rssLink.length) _rssLink.push(...Helpers.tryConstructFeed(url));

    return _rssLink;
  }

  private static tryConstructFeed(url: string): string[] {
    const _reddit = Helpers.tryGetRedditFeed(url);
    const _medium = Helpers.tryGetMediumFeed(url);

    if (_reddit) return _reddit;
    if (_medium) return _medium;

    return [];
  }

  private static tryGetRedditFeed(url: string): string[] {
    const _isReddit = url.match(/reddit\.com\/r\/\w+/);
    if (!_isReddit) return [];

    const _sub = _isReddit ? _isReddit[0].split('/')[2] : null;
    if (_sub) return [`https://www.reddit.com/r/${_sub}/.rss`];

    return [];
  }

  private static tryGetMediumFeed(url: string): string[] {
    const _isMedium = url.match(/medium\.com\/\w+/);
    if (!_isMedium) return [];

    const _user = _isMedium ? _isMedium[0].split('/')[2] : null;
    if (_user) return [`https://medium.com/feed/${_user}`];

    return [];
  }
}
