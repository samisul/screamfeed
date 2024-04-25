import { XMLParser, XMLValidator } from 'fast-xml-parser';
import axios from 'axios';
import type { AtomFeed, FeedRes, GenericFeed, RSSFeed } from './model';
import { toRSSFeed, toAtomFeed, toGenericFeed } from './mappers';

const parser = new XMLParser();

export async function getParsedFeedsFromURLs(feedURLs: string[]): Promise<GenericFeed[]> {
  const _feeds = await getFeedsFromURLs(feedURLs);
  return (await Promise.all(_feeds.map(async (_feed) => await parser.parse(_feed))))
    .map((feed) => {
      if (isRSSFeed(feed)) return { type: 'rss', feed: toRSSFeed(feed) };
      if (isAtomFeed(feed)) return { type: 'atom', feed: toAtomFeed(feed) };
      return undefined;
    })
    .filter((f): f is FeedRes => !!f)
    .map((f) => toGenericFeed(f));
}

export async function getParsedFeedFromURL(feedURL: string): Promise<FeedRes | undefined> {
  const _feed = await getFeedFromURL(feedURL);
  if (!_feed) return undefined;
  const _parsedFeed = parser.parse(_feed);
  if (isRSSFeed(_parsedFeed)) return { type: 'rss', feed: toRSSFeed(_parsedFeed) };
  if (isAtomFeed(_parsedFeed)) return { type: 'atom', feed: toAtomFeed(_parsedFeed) };
  return undefined;
}

async function getFeedsFromURLs(feedURLs: string[]): Promise<string[]> {
  return (await Promise.all(feedURLs.map(async (feedURL) => await getFeedFromURL(feedURL)))).filter(
    (f): f is string => !!f
  );
}

async function getFeedFromURL(feedURL: string): Promise<string | undefined> {
  const _res = await axios.get<string>(feedURL);
  if (_res.status !== 200) return undefined;
  if (!validateFeed(_res.data)) return undefined;
  return _res.data;
}

function validateFeed(feed: string): boolean {
  return XMLValidator.validate(feed) === true ? true : false;
}

function isRSSFeed(feed: any): feed is RSSFeed {
  return 'rss' in feed;
}

function isAtomFeed(feed: any): feed is AtomFeed {
  return 'feed' in feed;
}
