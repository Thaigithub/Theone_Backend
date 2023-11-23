import { Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../entities/authentication-provider.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class AuthenticationProviderRepository extends BaseRepository<AuthenticationProvider> {
  abstract findByAccountId(accountId: number): Promise<AuthenticationProvider>;
}
