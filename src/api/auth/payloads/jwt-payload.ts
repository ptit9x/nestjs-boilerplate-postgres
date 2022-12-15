export interface JwtPayload {
  sub?: number;
  email: string;
  scopes?: string[];
  name?: string;
  iat?: string;
}
