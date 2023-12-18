import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import {
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from './request/member-member.request';
import { MemberDetailResponse } from './response/member-member-get-detail.response';

@Injectable()
export class MemberMemberService {
    constructor(private readonly prismaService: PrismaService) {}

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

    async getDetail(id: number): Promise<MemberDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                id,
            },
        });

        if (!memberExist) throw new NotFoundException('Member does not exist');

        return await this.prismaService.member.findUnique({
            where: {
                isActive: true,
                id,
            },
            select: {
                name: true,
                contact: true,
                email: true,
                desiredOccupation: true,
                level: true,
                signupMethod: true,
                createdAt: true,
                withdrawnDate: true,
                account: {
                    select: {
                        username: true,
                        status: true,
                    },
                },
                bankAccount: {
                    select: {
                        accountHolder: true,
                        accountNumber: true,
                        bankName: true,
                        createdAt: true,
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
                                type: true,
                            },
                        },
                    },
                },
                disability: {
                    select: {
                        disableType: true,
                        disableLevel: true,
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                size: true,
                                type: true,
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
                                type: true,
                            },
                        },
                    },
                },
                teams: {
                    select: {
                        team: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
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
