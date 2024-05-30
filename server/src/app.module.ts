import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';
import { DataModule } from './data/data.module';
import { SeedService } from './data/seed/seed.service';
import { FeedModule } from './feed/feed.module';
import { MarkModule } from './mark/mark.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    FeedModule,
    MarkModule,
    DataModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: env['NODE_ENV'] === 'dev' ? '.env.local' : '.env',
      isGlobal: true,
    }),
    MarkModule,
    TagModule,
  ],
  controllers: [],
  providers: [SeedService, Logger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedService.seed();
  }
}
