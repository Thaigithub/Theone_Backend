import { Injectable } from '@nestjs/common';
import { Member as MemberPrisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { ChangeMemberRequest, GetMembersListRequest } from './request/member-admin.request';
import { MemberDetailResponse, MemberResponse } from './response/member-admin.response';
import { searchCategory } from './dto/member-admin-search-category.request.dto';

@Injectable()
export class MemberAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    private parseConditionsFromQuery(query: GetMembersListRequest) {
        const search = {
            level: query.level,
            account: {
                status: query.status,
                isActive: true,
            },
        };
        switch (query.searchCategory) {
            case searchCategory.NAME: {
                search['name'] = query.searchKeyword;
                break;
            }
            case searchCategory.USERNAME: {
                search.account['username'] = query.searchKeyword;
            }
        }
        return search;
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
            },
        });
    }

    async updateMember(id: number, body: ChangeMemberRequest): Promise<void> {
        const account = await this.prismaService.member.findUnique({
            select: {
                accountId: true,
            },
            where: {
                id,
            },
        });

        await this.prismaService.member.update({
            where: {
                isActive: true,
                id,
            },
            data: {
                level: body.level,
                account: {
                    update: {
                        status: body.status,
                    },
                },
            },
        });

        await this.prismaService.accountStatusHistory.create({
            data: {
                status: body.status,
                message: body.message,
                accountId: account.accountId,
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
