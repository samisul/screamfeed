import { FeedUser } from 'src/feed/feed-user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Mark } from '../mark/mark.entity';
import { Tag } from '../tag/tag.entity';

@Unique(['email'])
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({ type: 'varchar', length: 60 })
  email: string;

  @Column({ type: 'varchar' })
  avatar: string;

  @OneToMany(() => FeedUser, (fu) => fu.feed)
  feeds: FeedUser[];

  @OneToMany(() => Mark, (mark) => mark.user)
  marks: Mark[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
