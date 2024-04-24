import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { env } from 'process';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: env['GOOGLE_CLIENT_ID'],
      clientSecret: env['GOOGLE_CLIENT_SECRET'],
      callbackURL: env['CORE_BASE_URL'] + '/api/user/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _: string,
    __: string,
    profile: any,
    done: (err?: Error | null, profile?: any) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    done(null, profile);
  }
}
