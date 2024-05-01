import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResDto } from '../core/auth.model';
import { UserModel } from '../core/dtos/user.dto';
import { User } from 'src/core/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOverview } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    public readonly usersRepo: Repository<User>,
  ) {}

  async getOrCreate(user: UserModel): Promise<User> {
    const _existing = await this.usersRepo.findOneBy({ email: user.email });
    return _existing
      ? _existing
      : await this.usersRepo.save(this.usersRepo.create(user));
  }

  async login(userDto: UserModel): Promise<LoginResDto> {
    return await this.signTokens(await this.getOrCreate(userDto));
  }

  async refresh(refreshToken: string) {
    let _tokenPayload: JwtPayload;

    try {
      _tokenPayload = await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);
    }

    if (_tokenPayload.type !== 'refresh')
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);

    if (!_tokenPayload.sub)
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);

    return await this.signTokens(
      await this.usersRepo.findOneByOrFail({
        id: _tokenPayload.sub,
      }),
    );
  }

  async verify(accessToken: string) {
    let _tokenPayload;

    try {
      _tokenPayload = await this.jwtService.verifyAsync(accessToken);
    } catch (error) {
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);
    }

    if (_tokenPayload.type !== 'access')
      throw new HttpException('INVALID_PAYLOAD', HttpStatus.BAD_REQUEST);

    return await this.usersRepo.findOneByOrFail({
      email: _tokenPayload.email,
    });
  }

  async signTokens(user: any) {
    return {
      accessToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          type: 'access',
        },
        { expiresIn: '10 minutes' },
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          sub: user.id,
          type: 'refresh',
        },
        { expiresIn: '90 days' },
      ),
    };
  }

  async getLoginData(profile: any) {
    const _email = profile.emails?.[0].value;
    const _name = profile.displayName ?? profile.username;
    const _avatar = profile.photos?.[0].value ?? '';

    if (!_email) throw new Error('No email found');

    const _loginRes = await this.login({
      email: _email,
      name: _name,
      avatar: _avatar,
      createdAt: new Date(),
    });

    return JSON.stringify(_loginRes);
  }

  async getOverview(id: string): Promise<UserOverview> {
    const _user = (await this.usersRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.feeds', 'feeds')
      .leftJoin('user.marks', 'marks')
      .loadRelationCountAndMap('user.feedCount', 'user.feeds')
      .loadRelationCountAndMap('user.markCount', 'user.marks')
      .getOneOrFail()) as User & { feedCount: number; markCount: number };

    return {
      name: _user.name,
      email: _user.email,
      avatar: _user.avatar,
      feedCount: _user.feedCount,
      marksCount: _user.markCount,
    };
  }
}
