import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { config } from 'dotenv';
import { Injectable, Inject } from '@nestjs/common';
import { KAKAO_REST_API, KAKAO_CLIENT_SECRET, KAKAO_CALLBACK_URL } from 'app.config';
import { UserRepository } from '../../../domain/repositories/user.repository';

config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {
        super({
            clientID: KAKAO_REST_API,
            clientSecret: KAKAO_CLIENT_SECRET,
            callbackURL: KAKAO_CALLBACK_URL
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        console.log(accessToken)
    }
}