import { Injectable, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { fakeUidAccount } from 'application/dtos/account.dto';
import { JwtFakePayloadData, JwtPayloadData } from 'infrastructure/passport/strategies/jwt.strategy';
import { AuthUseCase } from 'application/use-cases/auth.use-case';
import { compare } from 'bcrypt';
import { AccountRepository } from 'domain/repositories/account.repository';
import { LoginRequest } from 'presentation/requests/login.request';
import { LoginResponse } from 'presentation/responses/login.response';

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
  private readonly logger = new Logger(AuthUseCaseImpl.name);

  constructor(
    @Inject(AccountRepository) private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

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
}
