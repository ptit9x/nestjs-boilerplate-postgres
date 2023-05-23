import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: JWT_CONFIG.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: JWT_CONFIG.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: JWT_CONFIG.GOOGLE_AUTH_CALL_BACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.authService.findOrCreateUserFromGoogleProfile(
      profile,
    );
    done(null, user);
  }
}
