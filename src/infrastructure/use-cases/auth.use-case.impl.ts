import { Inject, Injectable, Logger } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { Auth } from '../../domain/entities/auth.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpsertUserRequest } from '../../presentation/requests/upsert-user.request';

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {

}
