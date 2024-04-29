import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mark } from 'src/core/entities/mark.entity';
import { Repository } from 'typeorm';
import { AddMarkDto, MarkDto } from './mark.model';
import { MarkMappers } from './mark.mappers';

@Injectable()
export class MarkService {
  constructor(
    @InjectRepository(Mark) private readonly markRepo: Repository<Mark>,
  ) {}

  async add(userId: string, mark: AddMarkDto): Promise<Mark> {
    const newMark = this.markRepo.create({
      item: mark.item,
      user: { id: userId },
    });

    return this.markRepo.save(newMark);
  }

  async remove(userId: string, markId: string): Promise<void> {
    await this.markRepo.delete({ id: markId, user: { id: userId } });
  }

  async get(userId: string): Promise<MarkDto[]> {
    const _marks = await this.markRepo.find({
      where: { user: { id: userId } },
    });
    return _marks.map((mark) => MarkMappers.toDto(mark));
  }
}
