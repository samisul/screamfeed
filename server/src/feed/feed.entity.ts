import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
