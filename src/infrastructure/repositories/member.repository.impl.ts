import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { MemberRepository } from 'domain/repositories/member.repository';
import { Member } from 'domain/entities/member.entity';
import { Member as MemberPrisma } from '@prisma/client';
import { ChangeMemberRequest, GetListRequest, UpsertBankAccountRequest } from 'presentation/requests/member.request';
import { MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export class MemberRepositoryImpl extends BaseRepositoryImpl<Member> implements MemberRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.MEMBER);
  }
  async findIdByAccountId(id: number): Promise<number> {
    const result = await this.prismaService.member.findUnique({
      where: {
        accountId: id,
      },
      select: {
        id: true,
      },
    });
    return result.id;
  }

  private parseConditionsFromQuery(query: GetListRequest) {
    return {
      isActive: true,
      name: query.keywordByName && { contains: query.keywordByName },
      level: query.level,
      account: {
        username: query.keywordByUsername && { contains: query.keywordByUsername },
        status: query.status,
      },
    };
  }

  async findByQuery(query: GetListRequest): Promise<MemberResponse[]> {
    return await this.prismaService.member.findMany({
      // Retrieve specific fields
      select: {
        id: true,
        name: true,
        contact: true,
        level: true,
        account: {
          select: {
            username: true,
            status: true,
          },
        },
      },

      // Conditions based on request query
      where: this.parseConditionsFromQuery(query),

      // Pagination
      // If both pageNumber and pageSize is provided then handle the pagination
      skip: query.pageNumber && query.pageSize ? (query.pageNumber - 1) * query.pageSize : undefined,
      take: query.pageNumber && query.pageSize ? query.pageSize : undefined,
    });
  }

  async countByQuery(query: GetListRequest): Promise<number> {
    return await this.prismaService.member.count({
      // Conditions based on request query
      where: this.parseConditionsFromQuery(query),
    });
  }

  async findByIds(memberIds: number[]): Promise<MemberPrisma[]> {
    return await this.prismaService.member.findMany({
      where: {
        isActive: true,
        id: {
          in: memberIds,
        },
      },
    });
  }

  async findById(id: number): Promise<MemberDetailsResponse> {
    return await this.prismaService.member.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        name: true,
        contact: true,
        email: true,
        desiredOccupation: true,
        level: true,
        signupMethod: true,
        bankAccount: {
          select: {
            accountHolder: true,
            accountNumber: true,
            bankName: true,
          },
        },
        foreignWorker: {
          select: {
            englishName: true,
            registrationNumber: true,
            serialNumber: true,
            dateOfIssue: true,
            file: {
              select: {
                key: true,
                fileName: true,
                size: true,
              },
            },
          },
        },
        disability: {
          select: {
            disableType: true,
            file: {
              select: {
                key: true,
                fileName: true,
                size: true,
              },
            },
          },
        },
        basicHealthSafetyCertificate: {
          select: {
            registrationNumber: true,
            dateOfCompletion: true,
            file: {
              select: {
                key: true,
                fileName: true,
                size: true,
              },
            },
          },
        },
      },
    });
  }

  async updateMember(payload: ChangeMemberRequest): Promise<void> {
    await this.prismaService.member.update({
      where: {
        isActive: true,
        id: payload.id,
      },
      data: {
        level: payload.level,
        account: {
          update: {
            status: payload.status,
          },
        },
      },
    });
  }
  async upsertBankAccount(id: number, request: UpsertBankAccountRequest): Promise<void> {
    await this.prismaService.member.update({
      where: { accountId: id },
      data: {
        bankAccount: {
          upsert: {
            update: {
              accountHolder: request.accountHolder,
              accountNumber: request.accountNumber,
              bankName: request.bankName,
            },
            create: {
              accountHolder: request.accountHolder,
              accountNumber: request.accountNumber,
              bankName: request.bankName,
            },
          },
        },
      },
    });
  }
}
