import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';

@Injectable()
export class UserRepositoryImpl extends BaseRepositoryImpl<User> implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.USER);
    this.prismaService.oTPProvider
  }

  async findByUsername(username: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findOne(userId: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
