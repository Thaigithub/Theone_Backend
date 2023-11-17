import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "../../domain/base.repository";
import { BaseEntity } from "../../domain/entities/base.entity";


@Injectable()
export class BaseRepositoryImpl<E extends BaseEntity> implements BaseRepository<E> {
  constructor(
    private readonly prisma : PrismaClient,
    private readonly model : PrismaModel
  ) {}

  async findAll(): Promise<E[]> {
    return await this.prisma[this.model].findMany() as any
  }
  
  async find(id: number): Promise<E> {
    return await this.prisma[this.model].findUnique({
      where: {id}
    }) as any
  }

  async create(data: any): Promise<E> {
    return await this.prisma[this.model].create({ data }) as any
  }

  async update(id: number, data: any): Promise<E> {
    return await this.prisma[this.model].update({
      where: {
        id
      },
      data
    }) as any
  }
  
  async delete(id: number): Promise<E> {
    return await this.prisma[this.model].delete({
      where: {
        id,
      },
    }) as any
  }

  async softDelete(id: number): Promise<E> {
    return await this.prisma[this.model].update({
      where: {
        id
      },
      data: {
        isActive : false
      }
    }) as any
  }



}