import { Tag } from 'src/tag/tag.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedUser } from './feed-user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 60 })
  title: string;

  @OneToMany(() => FeedUser, (fu) => fu.users)
  users: FeedUser[];

  @ManyToMany(() => Tag, (tag) => tag.feeds)
  tags: Tag[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
