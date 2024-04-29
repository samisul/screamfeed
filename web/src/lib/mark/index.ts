import { env } from '$lib/env';
import type { ListRes } from '$lib/global';
import { get, post } from '$lib/http';
import type { MarkDto } from './model';

const MARK_URL = `${env.baseUrl}/feeds`;

export async function getMarks(): Promise<ListRes<MarkDto> | undefined> {
  return await get<ListRes<MarkDto>>(`${MARK_URL}`);
}

export async function addMark(item: { id: string }): Promise<void> {
  await post(`${MARK_URL}`, { item });
}
