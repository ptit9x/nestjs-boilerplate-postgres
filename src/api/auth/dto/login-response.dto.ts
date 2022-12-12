export interface LoginResponseDto {
  accessToken: string;
  accessTokenExpire: number | string;
  isFirstTimeLogin?: boolean;
}
