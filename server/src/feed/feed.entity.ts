import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => Tag, (tag) => tag.feeds)
  tags: Tag[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
