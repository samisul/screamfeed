import { XMLParser, XMLValidator } from 'fast-xml-parser';
import axios from 'axios';
import type { AtomFeed, AtomFeedEntry, FeedRes, RSSFeed, RSSFeedItem } from './model';

const parser = new XMLParser();

export async function getParsedFeedsFromURLs(feedURLs: string[]): Promise<FeedRes[]> {
	//todo: return unified feed type, not RSSFeed or AtomFeed
	const _feeds = await getFeedsFromURLs(feedURLs);
	return (await Promise.all(_feeds.map(async (_feed) => await parser.parse(_feed))))
		.map((feed) => {
			if (isRSSFeed(feed)) return { type: 'rss', feed: toRSSFeed(feed) };
			if (isAtomFeed(feed)) return { type: 'atom', feed: toAtomFeed(feed) };
			return undefined;
		})
		.filter((f): f is FeedRes => !!f);
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

function toRSSFeed(feed: any): RSSFeed {
	return {
		rss: {
			channel: {
				title: feed.rss.channel.title,
				link: feed.rss.channel.link,
				description: feed.rss.channel.description,
				language: feed.rss.channel.language,
				item: feed.rss.channel.item.map(toRSSFeedItem)
			}
		}
	};
}

function toRSSFeedItem(item: any): RSSFeedItem {
	return {
		title: item.title,
		link: item.link,
		description: item.description,
		pubDate: item.pubDate,
		guid: item.guid
	};
}

function toAtomFeedEntry(entry: any): AtomFeedEntry {
	return {
		title: entry.title,
		link: entry.link,
		id: entry.id,
		updated: entry.updated,
		summary: entry.summary
	};
}

function toAtomFeed(feed: any): AtomFeed {
	return {
		feed: {
			title: feed.feed.title,
			link: feed.feed.link,
			updated: feed.feed.updated,
			entry: feed.feed.entry.map(toAtomFeedEntry)
		}
	};
}
