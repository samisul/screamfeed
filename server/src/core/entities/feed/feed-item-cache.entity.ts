import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeedCache } from './feed-cache.entity';

@Entity({ name: '__cache__feed_item' })
export class FeedItemCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  itemId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar' })
  date: string;

  @ManyToOne(() => FeedCache, (feed) => feed.items, { onDelete: 'CASCADE' })
  feedCacheId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
