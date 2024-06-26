import { env } from '$lib/env';
import type { ListRes } from '$lib/global';
import { del, get, post, put } from '$lib/http';
import type { TagDto, TagPreviewDto, UpsertTagReq } from './model';

const TAG_URL = `${env.baseUrl}/tags`;

export async function getTags(): Promise<ListRes<TagPreviewDto> | undefined> {
  return await get<ListRes<TagPreviewDto>>(`${TAG_URL}`);
}

export async function getTagsWithFeeds(): Promise<ListRes<TagDto> | undefined> {
  return await get<ListRes<TagDto>>(`${TAG_URL}/feeds`);
}

export async function findTag(id: string): Promise<TagDto | undefined> {
  return await get<TagDto>(`${TAG_URL}/${id}`);
}

export async function addTag(req: UpsertTagReq): Promise<TagPreviewDto | undefined> {
  return await post<TagPreviewDto>(`${TAG_URL}`, req);
}

export async function removeTag(id: string): Promise<boolean> {
  return await del(`${TAG_URL}/${id}`);
}

export async function updateTag(req: UpsertTagReq, id: string): Promise<boolean> {
  return await put<UpsertTagReq>(`${TAG_URL}/${id}`, req);
}
