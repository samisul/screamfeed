import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataModule } from './data/data.module';
import { SeedService } from './data/seed/seed.service';
import { env } from 'process';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    UserModule,
    FeedModule,
    DataModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: env['NODE_ENV'] === 'dev' ? '.env.local' : '.env',
      isGlobal: true,
    }),
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
    const _IS_DEV_MODE = this.configService.get('NODE_ENV') === 'dev';
    if (_IS_DEV_MODE) await this.seedService.seed();
  }
}
