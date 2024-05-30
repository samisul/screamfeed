import type { FeedDto } from '$lib/feed/model';

export interface UpsertTagReq {
  name: string;
  feedIds: string[];
}

export interface TagPreviewDto {
  id: string;
  name: string;
}

export interface TagDto extends TagPreviewDto {
  feeds: FeedDto[];
}
