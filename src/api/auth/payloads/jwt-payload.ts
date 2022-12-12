export interface JwtPayload {
  sub?: number;
  email: string;
  scopes?: string[];
  isAdministrator?: boolean;
  name?: string;
  iat?: string;
}
