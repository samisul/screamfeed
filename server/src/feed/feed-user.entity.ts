import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { Feed } from './feed.entity';
import { Tag } from 'src/tag/tag.entity';

@Entity()
export class FeedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  feedId: string;

  @ManyToMany(() => Tag, (tag) => tag.feeds)
  tags: Tag[];

  @ManyToMany(() => User, (user) => user.feeds, { onDelete: 'CASCADE' })
  users: User[];

  @ManyToOne(() => User, (user) => user.feeds)
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.users)
  feed: Feed;
}
