import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { config } from 'dotenv';
import { Injectable, Inject } from '@nestjs/common';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_CALLBACK_URL } from 'app.config';
import { UserRepository } from '../../../domain/repositories/user.repository';

config();

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {
        super({
            clientID: NAVER_CLIENT_ID,
            clientSecret: NAVER_CLIENT_SECRET,
            callbackURL: NAVER_CALLBACK_URL
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        console.log(accessToken)
    }
}