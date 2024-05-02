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
    const response = await axios.get(url);
    const doc = parse(response.data);
    const _rssLink: string[] = [];

    Helpers.types.forEach((type) => {
      const rssLinks = doc.querySelectorAll(`link[type="${type}"]`);
      rssLinks.forEach((rssLink) => {
        const _l = rssLink.getAttribute('href');
        if (_l) _rssLink.push(_l);
      });
    });

    return _rssLink;
  }
}
