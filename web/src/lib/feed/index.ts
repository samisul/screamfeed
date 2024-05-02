import { env } from '$lib/env';
import type { ListRes } from '$lib/global';
import { del, get, post } from '$lib/http';
import type { AddFeedReq, FeedDto, GenericFeed } from './model';

const FEED_URL = `${env.baseUrl}/feeds`;

export async function getFeedUrls(): Promise<ListRes<FeedDto> | undefined> {
  return await get<ListRes<FeedDto>>(`${FEED_URL}`);
}

export async function getParsedFeeds(
  urls?: string[],
  refresh = false
): Promise<ListRes<GenericFeed> | undefined> {
  return await post<ListRes<GenericFeed>>(`${FEED_URL}/parsed?refresh=${refresh}`, { urls });
}

export async function addFeed(req: AddFeedReq): Promise<FeedDto | undefined> {
  return await post<FeedDto>(`${FEED_URL}`, req);
}

export async function removeFeed(id: string): Promise<boolean> {
  return await del(`${FEED_URL}/${id}`);
}

export async function list(): Promise<ListRes<FeedDto> | undefined> {
  return await get<ListRes<FeedDto>>(`${FEED_URL}/list`);
}

export async function find(url: string): Promise<ListRes<string> | undefined> {
  return await get<ListRes<string>>(`${FEED_URL}/find?url=${url}`);
}
