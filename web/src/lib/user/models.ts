export interface AuthCookie {
  accessToken: string;
  refreshToken: string;
}

export interface UserOverview {
  name: string;
  email: string;
  avatar: string;
  feedCount: number;
  marksCount: number;
}
