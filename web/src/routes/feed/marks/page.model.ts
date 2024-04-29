import type { ListRes } from '$lib/global';
import type { MarkDto } from '$lib/mark/model';

export interface PageModel {
  marks: ListRes<MarkDto> | undefined;
}
