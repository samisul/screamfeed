import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { TagDto, TagPreviewDto, UpsertTagReq } from './tag.model';
import { Feed } from 'src/feed/feed.entity';
import { TagMapper } from './tag.mappers';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
  ) {}

  async add(userId: string, req: UpsertTagReq) {
    const newTag = this.tagRepo.create({
      name: req.name,
      user: { id: userId },
    });

    return await this.tagRepo.save(newTag);
  }

  async update(
    userId: string,
    req: UpsertTagReq,
    id: string,
  ): Promise<Tag | undefined> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const tag = await this.tagRepo.findOne({
      where: { id, user: { id } },
      relations: ['feeds'],
    });

    if (!tag) return;

    tag.name = req.name;

    if (!req.feedIds.length) {
      tag.feeds = [];
      return await this.tagRepo.save(tag);
    }

    const _feeds = await this.feedRepo
      .createQueryBuilder('feed')
      .where('feed.id IN (:...ids)', { ids: req.feedIds })
      .getMany();

    if (!_feeds.length) return this.tagRepo.save(tag);

    tag.feeds = _feeds;

    return await this.tagRepo.save(tag);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.tagRepo.delete({ id, user: { id: userId } });
  }

  async get(userId: string): Promise<TagPreviewDto[]> {
    return (
      await this.tagRepo.find({
        where: { user: { id: userId } },
      })
    ).map((t) => TagMapper.toTagPreviewDto(t));
  }

  async getOne(userId: string, id: string): Promise<TagDto | null> {
    const _tag = await this.tagRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['feeds'],
    });
    if (!_tag) return null;
    return TagMapper.toTagDto(_tag);
  }
}
