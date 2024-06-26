import { env } from '$lib/env';
import type { ListRes } from '$lib/global';
import { del, get, post } from '$lib/http';
import type { AddMarkDto, MarkDto } from './model';

const MARK_URL = `${env.baseUrl}/marks`;

export async function getMarks(): Promise<ListRes<MarkDto> | undefined> {
  return await get<ListRes<MarkDto>>(`${MARK_URL}`);
}

export async function addMark(dto: AddMarkDto): Promise<AddMarkDto | undefined> {
  return await post<AddMarkDto>(MARK_URL, dto);
}

export async function removeMark(id: string): Promise<boolean> {
  return await del(`${MARK_URL}/${id}`);
}
