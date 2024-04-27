import { env } from '$lib/env';
import type { ListRes } from '$lib/global';
import { del, get, post } from '$lib/http';
import type { AddFeedReq, FeedDto, GenericFeed } from './model';

const FEED_URL = `${env.baseUrl}/feeds`;

export async function getFeedUrls(): Promise<ListRes<FeedDto> | undefined> {
  return await get<ListRes<FeedDto>>(`${FEED_URL}`);
}

export async function getParsedFeeds(urls: string[]): Promise<ListRes<GenericFeed> | undefined> {
  return await post<ListRes<GenericFeed>>(`${FEED_URL}/parsed`, { body: urls });
}

export async function addFeed(url: string): Promise<FeedDto | undefined> {
  return await post<FeedDto>(`${FEED_URL}`, { url } as AddFeedReq);
}

export async function removeFeed(id: string): Promise<boolean> {
  return await del(`${FEED_URL}/${id}`);
}
