import { Mark } from 'src/mark/mark.entity';
import { MarkDto } from './mark.model';

export class MarkMappers {
  static toDto(mark: Mark): MarkDto {
    return {
      id: mark.id,
      item: mark.item,
    };
  }
}
