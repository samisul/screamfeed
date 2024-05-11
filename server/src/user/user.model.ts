export interface UserOverview {
  name: string;
  email: string;
  avatar: string;
  feedCount: number;
  marksCount: number;
}

export interface UserModel {
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
}

export const roles = ['admin', 'user'] as const;
export type Role = (typeof roles)[number];

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  type: JwtType;
}

export type JwtType = 'refresh' | 'access';

export class LoginResDto {
  accessToken: string;
  refreshToken: string;
}
