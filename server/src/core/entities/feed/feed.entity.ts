import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedCache } from './feed-cache.entity';
import { User } from '../user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 60 })
  title: string;

  @ManyToMany(() => User, (user) => user.feeds, { onDelete: 'CASCADE' })
  users: User[];

  @OneToOne(() => FeedCache)
  @JoinColumn()
  cache?: FeedCache;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
