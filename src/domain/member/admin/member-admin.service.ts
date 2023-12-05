import { Injectable } from '@nestjs/common';
import { Member as MemberPrisma } from '@prisma/client';
import { GetMembersListRequest, ChangeMemberRequest } from './request/member-admin.request';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { MemberResponse, MemberDetailResponse } from './response/member-admin.response';

@Injectable()
export class MemberAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    private parseConditionsFromQuery(query: GetMembersListRequest) {
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

    private async findByIds(memberIds: number[]): Promise<MemberPrisma[]> {
        return await this.prismaService.member.findMany({
            where: {
                isActive: true,
                id: {
                    in: memberIds,
                },
            },
        });
    }

    // Methods used by controller
    async getList(query: GetMembersListRequest): Promise<MemberResponse[]> {
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

    async getTotal(query: GetMembersListRequest): Promise<number> {
        return await this.prismaService.member.count({
            // Conditions based on request query
            where: this.parseConditionsFromQuery(query),
        });
    }

    async getDetail(id: number): Promise<MemberDetailResponse> {
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

    async download(memberIds: number[], response: Response): Promise<void> {
        const members = await this.findByIds(memberIds);
        const excelStream = await this.excelService.createExcelFile(members, 'Members');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
