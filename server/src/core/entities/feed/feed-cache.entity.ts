import { GenericFeedItem } from 'src/feed/feed.model';
import {
  AfterInsert,
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['feedUrl'])
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

  @Column({ type: 'longtext', nullable: true })
  items: string;

  @Column({ type: 'boolean', default: false })
  isInvalid: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  parsedItems: GenericFeedItem[];

  @AfterLoad()
  setIsInvalid() {
    if (this.items) this.parsedItems = JSON.parse(this.items);
    else this.parsedItems = [];
    if (this.isInvalid) return;
    this.isInvalid = new Date().getTime() - this.createdAt.getTime() > 86400000;
  }

  @BeforeInsert()
  stringiftItems() {
    this.items = JSON.stringify(this.parsedItems);
  }
}
