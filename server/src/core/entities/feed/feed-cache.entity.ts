import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from './feed.entity';
import { FeedItemCache } from './feed-item-cache.entity';

@Entity({ name: '__cache__feed' })
export class FeedCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  feedUrl: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  language?: string;

  @Column({ type: 'varchar', nullable: true })
  updated?: string;

  @OneToMany(() => FeedItemCache, (item) => item.feedCacheId)
  items: FeedItemCache[];

  @Column({ type: 'boolean', default: false })
  isInvalid: boolean;

  @OneToOne(() => Feed, (feed) => feed.cache)
  feed: Feed;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
