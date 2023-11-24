import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseEntity } from 'domain/entities/base.entity';
import { PrismaModel } from 'domain/entities/prisma.model';
import { BaseRepository } from 'domain/repositories/base.repository';

@Injectable()
export class BaseRepositoryImpl<E extends BaseEntity> implements BaseRepository<E> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly model: PrismaModel,
  ) {}

  async findAll(): Promise<E[]> {
    return await this.prisma[this.model.toString()].findMany();
  }

  async find(id: number): Promise<E> {
    return (await this.prisma[this.model.toString()].findUnique({
      where: { id },
    })) as any;
  }

  async create(data: any): Promise<E> {
    return (await this.prisma[this.model.toString()].create({ data })) as any;
  }

  async update(id: number, data: any): Promise<E> {
    return (await this.prisma[this.model.toString()].update({
      where: {
        id,
      },
      data,
    })) as any;
  }

  async delete(id: number): Promise<E> {
    return (await this.prisma[this.model.toString()].delete({
      where: {
        id,
      },
    })) as any;
  }

  async softDelete(id: number): Promise<E> {
    return (await this.prisma[this.model.toString()].update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    })) as any;
  }
}
