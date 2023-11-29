import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { MemberRepository } from 'domain/repositories/member.repository';
import { Member } from 'domain/entities/member.entity';
import { GetListRequest } from 'presentation/requests/member.request';
import { MemberDetailsResponse, MemberResponse } from 'presentation/responses/member.response';

@Injectable()
export class MemberRepositoryImpl extends BaseRepositoryImpl<Member> implements MemberRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.MEMBER);
  }

  async findByQuery(query: GetListRequest, getTotal: boolean): Promise<MemberResponse[] | number> {
    const members = await this.prismaService.member.findMany({
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
      where: {
        name: query.searchCategory === 'name' ? { contains: query.searchKeyword } : undefined,
        level: query.level,
        account: {
          username: query.searchCategory === 'username' ? { contains: query.searchKeyword } : undefined,
          status: query.status,
        },
      },

      // Pagination
      // If both pageNumber and pageSize is provided then handle the pagination
      skip: !getTotal && query.pageNumber && query.pageSize ? (query.pageNumber - 1) * query.pageSize : undefined,
      take: !getTotal && query.pageNumber && query.pageSize ? query.pageSize : undefined,
    });
    return getTotal ? members.length : members;
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
}
