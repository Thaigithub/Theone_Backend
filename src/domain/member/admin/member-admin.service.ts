import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Member as MemberPrisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { searchCategory } from './dto/member-admin-search-category.request.dto';
import { ChangeMemberRequest, GetMembersListRequest } from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberResponse } from './response/member-admin-get-list.response';

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

            ...QueryPagingHelper.queryPaging(query),
        });
    }

    async getTotal(query: GetMembersListRequest): Promise<number> {
        return await this.prismaService.member.count({
            // Conditions based on request query
            where: this.parseConditionsFromQuery(query),
        });
    }

    async getDetail(id: number): Promise<MemberAdminGetDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                id,
            },
        });

        if (!memberExist) throw new NotFoundException('Member does not exist');

        const member = await this.prismaService.member.findUnique({
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
                        bankName: true,
                        accountNumber: true,
                        createdAt: true,
                    },
                },
                foreignWorker: {
                    select: {
                        registrationNumber: true,
                        serialNumber: true,
                        dateOfIssue: true,
                    },
                },
                disability: {
                    select: {
                        disableType: true,
                    },
                },
                teams: {
                    select: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                code: {
                                    select: {
                                        id: true,
                                        code: true,
                                        codeName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const teamList = member.teams.map((item) => {
            return {
                id: item.team.id,
                name: item.team.name,
                occupation: item.team.code.codeName,
            };
        });

        const { account, disability, createdAt, bankAccount, foreignWorker, ...newMember } = member;

        delete newMember.email;
        delete newMember.desiredOccupation;
        delete newMember.signupMethod;

        const newBankAccount = {
            bankName: bankAccount?.bankName,
            accountNumber: bankAccount?.accountNumber,
            registrationDate: bankAccount?.createdAt,
        };

        const newForeignWorker = {
            registrationNumber: foreignWorker?.registrationNumber,
            serialNumber: foreignWorker?.serialNumber,
            dateOfIssue: foreignWorker?.dateOfIssue,
        };

        return {
            ...newMember,
            bankAccount: newBankAccount,
            foreignWorker: newForeignWorker,
            joinDate: createdAt,
            obstacle: disability ? disability.disableType : null,
            username: account.username,
            status: account.status,
            teams: teamList,
        };
    }

    async updateMember(id: number, body: ChangeMemberRequest): Promise<void> {
        const memberExist = await this.prismaService.member.count({
            where: {
                id,
            },
        });

        if (!memberExist) throw new NotFoundException('Member does not exist');

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
        if (body.status !== undefined) {
            if (body.message !== undefined) {
                await this.prismaService.accountStatusHistory.create({
                    data: {
                        status: body.status,
                        message: body.message,
                        accountId: account.accountId,
                    },
                });
            } else throw new BadRequestException('Missing message');
        }
    }

    async download(memberIds: number[], response: Response): Promise<void> {
        const members = await this.findByIds(memberIds);
        const excelStream = await this.excelService.createExcelFile(members, 'Members');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
}
