import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from 'process';
import { DataModule } from './data/data.module';
import { SeedService } from './data/seed/seed.service';
import { FeedModule } from './feed/feed.module';
import { MarkModule } from './mark/mark.module';
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
  ],
  controllers: [],
  providers: [SeedService, Logger],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedService.seed();
  }
}
