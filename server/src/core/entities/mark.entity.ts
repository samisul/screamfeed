import { GenericFeedItem } from 'src/feed/feed.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  item: GenericFeedItem;

  @ManyToOne(() => User, (user) => user.marks, { onDelete: 'CASCADE' })
  user: User;
}
