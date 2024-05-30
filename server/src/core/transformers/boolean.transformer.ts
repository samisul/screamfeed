import { PipeTransform } from '@nestjs/common';

export class BooleanTransformer implements PipeTransform {
  transform(value: any): boolean {
    return value === 'true';
  }
}
