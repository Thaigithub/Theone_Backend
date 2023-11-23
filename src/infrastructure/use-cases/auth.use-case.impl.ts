import { Injectable, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { fakeUidUser } from '../../application/dtos/user.dto';
import { JwtFakePayloadData, JwtPayloadData } from '../passport/strategies/jwt.strategy';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { compare } from 'bcrypt';
import { UserRepository } from 'domain/repositories/user.repository';
import { LoginRequest } from '../../presentation/requests/login.request';
import { LoginResponse } from '../../presentation/responses/login.response';

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
  private readonly logger = new Logger(AuthUseCaseImpl.name);

  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    this.logger.log('Login user');

    const user = await this.userRepository.findByUsername(loginData.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await compare(loginData.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const uid = fakeUidUser(user.id);
    const type = user.type;
    const payload: JwtFakePayloadData = {
      userId: uid,
      type,
    };

    const token = this.signToken(payload);

    return { token, uid, type };
  }

  async verifyPayload(userId: number): Promise<JwtPayloadData> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payloadData: JwtPayloadData = {
      userId: user.id,
      type: user.type,
    };

    return payloadData;
  }

  signToken(payloadData: JwtFakePayloadData): string {
    const payload = {
      sub: payloadData,
    };

    return this.jwtService.sign(payload);
  }

  async googleLogin(request: any): Promise<string> {
    console.log(Object.keys(request))
    // const user = await this.userRepository.findByEmail(request.user.email);
    return "Hello"
  }
  async kakaoLogin(request: any): Promise<string> {
    return "Hello"
  }
}
