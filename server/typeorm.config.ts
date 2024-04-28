import * as dotenv from 'dotenv';
import { Feed } from 'src/core/entities/feed.entity';
import { User } from 'src/core/entities/user.entity';
import { DataSource } from 'typeorm';

dotenv.config({ path: './.env' });
export default new DataSource({
  type: 'mariadb',
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] as string, 10),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],

  entities: [User, Feed],
});
