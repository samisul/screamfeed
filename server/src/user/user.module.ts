import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from 'process';
import { GithubStrategy } from './github.strategy';
import { LoggedInGuard } from '../core/guards/logged-in.guard';
import { GoogleStrategy } from './google.strategy';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DataModule } from 'src/data/data.module';
import { User } from 'src/core/entities/user.entity';

@Module({
  imports: [
    DataModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: `${env['CORE_JWT_SECRET']}`,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, GithubStrategy, LoggedInGuard, GoogleStrategy],
})
export class UserModule {}
