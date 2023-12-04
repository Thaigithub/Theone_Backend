import { Injectable } from '@nestjs/common';
import { Member as MemberPrisma } from '@prisma/client';
import { Member } from 'domain/member/member.entity';
import { MemberRepository } from 'domain/member/member.repository';
import {
    ChangeMemberRequest,
    GetMemberListRequest,
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from 'domain/member/request/member.request';
import { MemberDetailsResponse, MemberResponse } from 'domain/member/response/member.response';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';
import { PrismaModel } from '../../helpers/entity/prisma.model';
import { PrismaService } from '../../helpers/entity/prisma.service';

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

    private parseConditionsFromQuery(query: GetMemberListRequest) {
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

    async findMemberId(accountId: number): Promise<number> {
        const member = await this.prismaService.member.findUnique({
            select: {
                id: true,
            },
            where: {
                accountId,
            },
        });
        return member.id;
    }

    async findByQuery(query: GetMemberListRequest): Promise<MemberResponse[]> {
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

    async countByQuery(query: GetMemberListRequest): Promise<number> {
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

    async updateMember(id: number, payload: ChangeMemberRequest): Promise<void> {
        await this.prismaService.member.update({
            where: {
                isActive: true,
                id,
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
    async upsertHSTCertificate(id: number, request: UpsertHSTCertificateRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                basicHealthSafetyCertificate: {
                    upsert: {
                        update: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async upsertForeignWorker(id: number, request: UpsertForeignWorkerRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                foreignWorker: {
                    upsert: {
                        update: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async upsertDisability(id: number, request: UpsertDisabilityRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                disability: {
                    upsert: {
                        update: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
