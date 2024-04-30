import {
  AfterLoad,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedItemCache } from './feed-item-cache.entity';

@Entity({ name: '__cache__feed' })
export class FeedCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  feedUrl: string;

  @Column({ type: 'varchar', default: '' })
  title: string;

  @Column({ type: 'varchar', default: '' })
  link: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  description?: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  language?: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  updated?: string;

  @OneToMany(() => FeedItemCache, (item) => item.feedCacheId)
  items: FeedItemCache[];

  @Column({ type: 'boolean', default: false })
  isInvalid: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @AfterLoad()
  setIsInvalid() {
    if (this.isInvalid) return;
    this.isInvalid = new Date().getTime() - this.createdAt.getTime() > 86400000;
  }
}
