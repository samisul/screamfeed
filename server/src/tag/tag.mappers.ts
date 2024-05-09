import { FeedMappers } from 'src/feed/feed.mappers';
import { Tag } from './tag.entity';
import { TagDto, TagPreviewDto } from './tag.model';

export class TagMapper {
  static toTagPreviewDto(tag: Tag): TagPreviewDto {
    return {
      id: tag.id,
      name: tag.name,
    };
  }

  static toTagDto(tag: Tag): TagDto {
    return {
      id: tag.id,
      name: tag.name,
      feeds: tag.feeds.map((f) => FeedMappers.toFeedDto(f.feed)),
    };
  }
}
