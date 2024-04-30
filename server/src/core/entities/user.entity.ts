import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from './feed/feed.entity';
import { Mark } from './mark.entity';

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

  @JoinTable()
  @ManyToMany(() => Feed, (feed) => feed.users)
  feeds: Feed[];

  @OneToMany(() => Mark, (mark) => mark.user)
  marks: Mark[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
