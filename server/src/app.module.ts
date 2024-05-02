import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataModule } from './data/data.module';
import { SeedService } from './data/seed/seed.service';
import { env } from 'process';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';
import { MarkModule } from './mark/mark.module';
import { MiscModule } from './misc/misc.module';

@Module({
  imports: [
    UserModule,
    FeedModule,
    MiscModule,
    MarkModule,
    DataModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: env['NODE_ENV'] === 'dev' ? '.env.local' : '.env',
      isGlobal: true,
    }),
    MarkModule,
    MiscModule,
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
