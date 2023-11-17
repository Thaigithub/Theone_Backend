import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class UserRepository extends BaseRepository<User> {
  abstract findByUsername(username: string): Promise<User>;
}
