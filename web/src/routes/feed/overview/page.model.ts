import type { GenericFeed } from '$lib/feed/model';
import type { ListRes } from '$lib/global';

export interface PageModel {
  feeds: ListRes<GenericFeed> | undefined;
}
