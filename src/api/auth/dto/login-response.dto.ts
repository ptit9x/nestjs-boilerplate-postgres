export interface LoginResponseDto {
  accessToken: string;
  accessTokenExpire: number | string;
  isFirstTimeLogin?: boolean;
  refreshToken?: string;
  refreshTokenExpire?: number | string;
  platform?: string[];
}
