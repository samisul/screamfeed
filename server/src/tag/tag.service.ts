import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedUser } from 'src/feed/feed-user.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { TagMapper } from './tag.mappers';
import { TagDto, TagPreviewDto, UpsertTagReq } from './tag.model';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(FeedUser)
    private readonly feedUserRepo: Repository<FeedUser>,
  ) {}

  async add(userId: string, req: UpsertTagReq): Promise<Tag> {
    const _feeds = req.feedIds.length
      ? await this.feedUserRepo
          .createQueryBuilder('feedUser')
          .where('feedUser.feedId IN (:...ids)', { ids: req.feedIds })
          .andWhere('feedUser.userId = :userId', { userId })
          .getMany()
      : [];

    const _tag = await this.tagRepo.findOne({
      where: { name: req.name, user: { id: userId } },
    });

    if (_tag) throw new HttpException('Tag already exists', 400);

    const newTag = this.tagRepo.create({
      name: req.name,
      user: { id: userId },
      feeds: _feeds,
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

    const tag = await this.tagRepo
      .createQueryBuilder('tag')
      .where('tag.id = :id', { id })
      .andWhere('tag.user = :userId', { userId })
      .leftJoinAndSelect('tag.feeds', 'feed')
      .getOne();

    if (!tag) return;

    tag.name = req.name;

    if (!req.feedIds.length) {
      tag.feeds = [];
      return await this.tagRepo.save(tag);
    }

    const _feeds = await this.feedUserRepo
      .createQueryBuilder('feedUser')
      .where('feedUser.feedId IN (:...ids)', { ids: req.feedIds })
      .andWhere('feedUser.userId = :userId', { userId })
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

  async getWithFeeds(userId: string): Promise<TagDto[]> {
    return (
      await this.tagRepo
        .createQueryBuilder('tag')
        .where('tag.user = :userId', { userId })
        .leftJoinAndSelect('tag.feeds', 'feed')
        .leftJoinAndSelect('feed.feed', 'f')
        .getMany()
    ).map((t) => TagMapper.toTagDto(t));
  }

  async getOne(userId: string, id: string): Promise<TagDto | null> {
    const _tag = await this.tagRepo
      .createQueryBuilder('tag')
      .where('tag.id = :id', { id })
      .andWhere('tag.user = :userId', { userId })
      .leftJoinAndSelect('tag.feeds', 'feed')
      .leftJoinAndSelect('feed.feed', 'f')
      .getOne();

    if (!_tag) return null;

    return TagMapper.toTagDto(_tag);
  }
}
