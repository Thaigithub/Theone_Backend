import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'application/dtos/auth.dto';
import { fakeUidUser } from 'application/dtos/user.dto';
// import { IUsersRepository } from 'application/repositories/Iusers.repository';
import { JwtFakePayloadData, JwtPayloadData } from 'application/passport/strategies/jwt.strategy';
import { compare } from 'bcrypt';
import { UserRepository } from 'domain/repositories/user.repository';

@Injectable()
export class AuthUseCase {
  private readonly logger = new Logger(AuthUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: AuthUserDto): Promise<{ token: string; uid: string }> {
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
    const payload: JwtFakePayloadData = {
      userId: uid,
      type: user.type,
    };

    const token = this.signToken(payload);

    // side effect send email so we no need to wait for it
    // this.mailHandler.sendVerificationCode(user.email);

    return { token, uid };
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
}
