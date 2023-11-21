import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable, Inject } from '@nestjs/common';
import { KAKAP_REST_API, KAKAP_CLIENT_SECRET, KAKAP_CALLBACK_URL } from 'app.config';
import { UserRepository } from '../../domain/repositories/user.repository';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {
        super({
            clientID: KAKAP_REST_API,
            clientSecret: KAKAP_CLIENT_SECRET,
            callbackURL: KAKAP_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        console.log(accessToken)
        done(null, profile)
    }
}