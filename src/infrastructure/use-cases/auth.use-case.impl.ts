import { Injectable, Logger, UnauthorizedException, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { fakeUidAccount } from 'application/dtos/account.dto';
import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { compare } from 'bcrypt';
import { AccountRepository } from 'domain/repositories/account.repository';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { LoginRequest, SocialLoginRequest } from 'presentation/requests/login.request';
import { LoginResponse } from 'presentation/responses/login.response';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APPLE_OAUTH_RESTAPI, KAKAO_VERIFY_URL, NAVER_VERIFY_URL } from 'app.config';
import { JwksClient } from 'jwks-rsa';
import Axios from 'axios';
import { CompanyDTO } from 'application/dtos/company.dto';
import { OtpProviderRepository } from 'domain/repositories/otp-provider.repository';
import { OtpVerificationRequest, PasswordSmsRequest, UserIdSmsRequest } from 'presentation/requests/user-info.request';
import { OTPGenerator } from 'common/utils/otp-generator';
import { PasswordSmsResponse, UserIdSmsResponse } from 'presentation/responses/user-info.request';
import { OtpService } from 'infrastructure/services/sms.service';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
const appleClient = new JwksClient({
  jwksUri: APPLE_OAUTH_RESTAPI,
});

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
  private readonly logger = new Logger(AuthUseCaseImpl.name);

  constructor(
    @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
    @Inject(CompanyRepository) private readonly companyRepository: CompanyRepository,
    @Inject(OtpProviderRepository) private readonly otpProviderRepository: OtpProviderRepository,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}
  async verifyOtp(otpCode: OtpVerificationRequest, isPasswordRequest: boolean): Promise<UserIdSmsResponse | PasswordSmsResponse> {
    this.logger.log('Verifying Otp request');
    const result = await this.otpProviderRepository.checkOtpValid(otpCode.phoneNumber, otpCode.code);
    if (!result) {
      throw new BadRequestException('Verify Otp failed');
    }
    const account = await this.otpProviderRepository.getAccountInfo(otpCode.phoneNumber);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const uid = fakeUidAccount(account.id);
    const userName = account.username;
    if (isPasswordRequest) {
      const passwordResponse: PasswordSmsResponse = {
        success: true,
        uid: uid,
      };
      return passwordResponse;
    } else {
      const userIdResponse: UserIdSmsResponse = {
        userName: userName,
        uid: uid,
      };
      return userIdResponse;
    }
  }

  async sendOtp(otpRequest: UserIdSmsRequest | PasswordSmsRequest, isPasswordRequest: boolean): Promise<boolean> {
    this.logger.log('Sending Otp Request');
    const userName = isPasswordRequest ? (otpRequest as PasswordSmsRequest).username : null;
    const otpProvider = await this.otpProviderRepository.findOne(otpRequest.name, otpRequest.phoneNumber, userName);
    if (!otpProvider) {
      throw new NotFoundException('OtpProvider not found');
    }
    const otp = OTPGenerator.generateOTPString();
    const result = await this.otpService.sendOTPSMS(otpRequest.phoneNumber, otp);
    if (!result) {
      throw new BadRequestException('Sending Otp failed');
    }
    this.otpProviderRepository.update(otpProvider.id, { otpCode: otp });
    return true;
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    this.logger.log('Login account');
    const account = await this.accountRepository.findByUsername(loginData.username);

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    const passwordMatch = await compare(loginData.password, account.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const uid = fakeUidAccount(account.id);
    const type = account.type;
    const payload: JwtFakePayloadData = {
      accountId: uid,
      type,
    };

    const token = this.signToken(payload);

    return { token, uid, type };
  }

  async verifyPayload(accountId: number): Promise<JwtPayloadData> {
    const account = await this.accountRepository.findOne(accountId);

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    const payloadData: JwtPayloadData = {
      accountId: account.id,
      type: account.type,
    };

    return payloadData;
  }

  signToken(payloadData: JwtFakePayloadData): string {
    const payload = {
      sub: payloadData,
    };
    return this.jwtService.sign(payload);
  }

  async googleLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    try {
      const payload = (
        await googleClient.verifyIdToken({
          idToken: request.idToken,
          audience: GOOGLE_CLIENT_ID,
        })
      ).getPayload();
      let profile = null;
      if (request.isMember) {
      } else {
        profile = await this.companyRepository.findByEmail(payload.email);
      }
      return this.loginSignupSocialFlow(profile);
    } catch (error) {
      console.log(error);
    }
  }

  async appleLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    const json = this.jwtService.decode(request.idToken, { complete: true });
    const kid = json.header.kid;
    const applekey = (await appleClient.getSigningKey(kid)).getPublicKey();
    const payload = await this.jwtService.verify(applekey, json);
    let profile = null;
    if (request.isMember) {
      // const account = await this.memberRepository.findByUsername(loginData.username);
    } else {
      profile = await this.companyRepository.findByEmail(payload.email);
    }
    return this.loginSignupSocialFlow(profile);
  }

  async kakaoLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    const payload = await Axios.post(KAKAO_VERIFY_URL, {
      headers: {
        Authorization: `Bearer ${request.idToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then(response => response.data)['kakao_account'];
    let profile = null;
    if (request.isMember) {
      // const account = await this.memberRepository.findByUsername(loginData.username);
    } else {
      profile = await this.companyRepository.findByEmail(payload.email);
    }
    return this.loginSignupSocialFlow(profile);
  }

  async naverLogin(request: SocialLoginRequest): Promise<LoginResponse> {
    const payload = await Axios.post(NAVER_VERIFY_URL, {
      headers: {
        Authorization: `Bearer ${request.idToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then(response => response.data)['reponse'];
    let profile = null;
    if (request.isMember) {
      // const account = await this.memberRepository.findByUsername(loginData.username);
    } else {
      profile = await this.companyRepository.findByEmail(payload.email);
    }
    return this.loginSignupSocialFlow(profile);
  }

  async loginSignupSocialFlow(profile: CompanyDTO): Promise<LoginResponse> {
    const uid = fakeUidAccount(profile.id);
    const type = (await this.accountRepository.findOne(profile.id)).type;
    const payload: JwtFakePayloadData = {
      accountId: uid,
      type: type,
    };

    const token = this.signToken(payload);

    return { token, uid, type };
  }
}
