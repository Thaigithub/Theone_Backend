import { Inject, Injectable, Logger } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { Auth } from '../../domain/entities/auth.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
    async googleLogin(request: any): Promise<string> {
        return 'Hello'
    }
}
