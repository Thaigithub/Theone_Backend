import { Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../entities/authentication-provider.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class AuthenticationProviderRepository extends BaseRepository<AuthenticationProvider> {
  abstract findByUserId(userId: number): Promise<AuthenticationProvider>;
}
