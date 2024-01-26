import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerCertificationType, CareerType, Member as MemberPrisma, Prisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { searchCategory } from './dto/member-admin-search-category.request.dto';
import { MemberAdminSearchCategoryFilter } from './enum/member-admin-search-category.enum';
import { MemberAdminSortCategoryFilter } from './enum/member-admin-sort-category.enum';
import { MemberAdminGetPointListRequest } from './request/member-admin-get-point-list.request';
import { ChangeMemberRequest, GetMembersListRequest } from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberResponse } from './response/member-admin-get-list.response';
import { MemberAdminGetPointDetailListResponse } from './response/member-admin-get-point-detail-list.response';
import { MemberAdminGetPointDetailResponse } from './response/member-admin-get-point-detail.response';
import { MemberAdminGetPointListResponse } from './response/member-admin-get-point-list.response';

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

    async calculateExchange(memberId: number) {
        const member = await this.prismaService.member.findFirst({
            where: {
                id: memberId,
                isActive: true,
            },
            select: {
                currencyExchange: {
                    select: {
                        amount: true,
                    },
                    where: {
                        isActive: true,
                    },
                },
            },
        });
        if (!member) {
            throw new NotFoundException('The id is not exist');
        }
        return member.currencyExchange.reduce((sum, current) => sum + current.amount, 0);
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

    async getPointList(query: MemberAdminGetPointListRequest): Promise<MemberAdminGetPointListResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            isActive: true,
            ...(query.searchCategory == MemberAdminSearchCategoryFilter.NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.searchCategory == MemberAdminSearchCategoryFilter.CONTACT && {
                contact: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(!query.searchCategory &&
                query.keyword && {
                    OR: [
                        { name: { contains: query.keyword, mode: 'insensitive' } },
                        { contact: { contains: query.keyword, mode: 'insensitive' } },
                    ],
                }),
        };
        const members = await this.prismaService.member.findMany({
            where: queryFilter,
            select: {
                id: true,
                name: true,
                contact: true,
                totalPoint: true,
                currencyExchange: {
                    select: {
                        amount: true,
                    },
                    where: {
                        isActive: true,
                    },
                },
            },
            orderBy: {
                ...(query.pointHeld && query.pointHeld == MemberAdminSortCategoryFilter.HIGH_TO_LOW && { totalPoint: 'desc' }),
                ...(query.pointHeld && query.pointHeld == MemberAdminSortCategoryFilter.LOW_TO_HIGH && { totalPoint: 'asc' }),
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const results = members.map((item) => {
            const totalExchange = item.currencyExchange.reduce((sum, current) => sum + current.amount, 0);
            return {
                memberId: item.id,
                name: item.name,
                contact: item.contact,
                pointHeld: item.totalPoint,
                totalExchanngePoint: totalExchange,
            };
        });

        const memberCount = await this.prismaService.member.count({
            where: queryFilter,
        });
        return new PaginationResponse(results, new PageInfo(memberCount));
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
            include: {
                account: true,
                disability: true,
                bankAccount: true,
                foreignWorker: true,
                teams: {
                    include: {
                        team: {
                            include: {
                                code: true,
                            },
                        },
                    },
                },
                career: true,
                applyPosts: {
                    include: {
                        contract: true,
                        post: {
                            include: {
                                site: {
                                    include: {
                                        company: true,
                                    },
                                },
                            },
                        },
                    },
                },
                specialLicenses: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        code: true,
                    },
                },
                basicHealthSafetyCertificate: true,
            },
        });

        const healthInsuranceList = member.career.filter(
            (item) => item.certificationType === CareerCertificationType.HEALTH_INSURANCE,
        );
        const employmentInsuranceList = member.career.filter(
            (item) => item.certificationType === CareerCertificationType.EMPLOYMENT_INSURANCE,
        );

        return {
            name: member.name,
            contact: member.contact,
            username: member.account.username,
            status: member.account.status,
            joinDate: member.createdAt.toISOString().split('T')[0],
            level: member.level,
            bankAccount: {
                bankName: member.bankAccount ? member.bankAccount.bankName : null,
                accountNumber: member.bankAccount ? member.bankAccount.accountNumber : null,
                registrationDate: member.bankAccount ? member.bankAccount.createdAt : null,
            },
            foreignWorker: {
                registrationNumber: member.foreignWorker ? member.foreignWorker.registrationNumber : null,
                serialNumber: member.foreignWorker ? member.foreignWorker.serialNumber : null,
                dateOfIssue: member.foreignWorker ? member.foreignWorker.dateOfIssue : null,
            },
            teams: member.teams
                ? member.teams.map((item) => {
                      return {
                          id: item.teamId,
                          name: item.team.name,
                          occupation: item.team.code.codeName,
                      };
                  })
                : [],
            registeredExperienceList: member.career
                ? member.career.map((item) => {
                      if (item.type === CareerType.GENERAL) {
                          return {
                              companyName: item.companyName,
                              startDate: item.startDate.toISOString().split('T')[0],
                              endDate: item.endDate.toISOString().split('T')[0],
                          };
                      }
                  })
                : [],
            contractHistoryList: member.applyPosts
                ? member.applyPosts
                      .filter((item) => {
                          return item.contract;
                      })
                      .map((item) => {
                          return {
                              companyName: item.post.site.company.name,
                              startDate: item.contract.startDate.toISOString().split('T')[0],
                              endDate: item.contract.endDate.toISOString().split('T')[0],
                          };
                      })
                : [],
            specialLicenseList: member.specialLicenses
                ? member.specialLicenses.map((item) => {
                      return {
                          codeName: item.code.codeName,
                          acquisitionDate: item.acquisitionDate.toISOString().split('T')[0],
                          status: item.status,
                      };
                  })
                : [],
            basicHealthSafetyCertificateList: {
                registrationNumber: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.registrationNumber
                    : null,
                dateOfCompletion: member.basicHealthSafetyCertificate
                    ? member.basicHealthSafetyCertificate.dateOfCompletion
                    : null,
            },
            healthInsuranceList:
                healthInsuranceList.length !== 0
                    ? healthInsuranceList.map((item) => {
                          return {
                              startDate: item.startDate.toISOString().split('T')[0],
                              endDate: item.endDate.toISOString().split('T')[0],
                              companyName: item.companyName,
                          };
                      })
                    : [],
            employmentInsuranceList:
                employmentInsuranceList.length !== 0
                    ? employmentInsuranceList.map((item) => {
                          return {
                              startDate: item.startDate.toISOString().split('T')[0],
                              endDate: item.endDate.toISOString().split('T')[0],
                              companyName: item.companyName,
                          };
                      })
                    : [],
        };
    }

    async getPointDetail(id: number): Promise<MemberAdminGetPointDetailResponse> {
        const member = await this.prismaService.member.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                name: true,
                contact: true,
                totalPoint: true,
            },
        });
        if (!member) {
            throw new NotFoundException('The id is not exist');
        }
        const totalExchangePoint = await this.calculateExchange(id);
        return {
            name: member.name,
            contact: member.contact,
            totalPoint: member.totalPoint,
            totalExchangePoint: totalExchangePoint,
        } as MemberAdminGetPointDetailResponse;
    }

    async getPointDetailList(id: number, query: PaginationRequest): Promise<MemberAdminGetPointDetailListResponse> {
        const points = await this.prismaService.point.findMany({
            where: {
                memberId: id,
                isActive: true,
            },
            select: {
                createdAt: true,
                reasonEarn: true,
                amount: true,
                remainAmount: true,
                status: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.point.count({
            where: {
                memberId: id,
                isActive: true,
            },
        });
        const results = points.map((item) => {
            return {
                createAt: item.createdAt,
                reasonEarn: item.reasonEarn,
                amount: item.amount,
                remainAmount: item.remainAmount,
                status: item.status,
            };
        });
        return new PaginationResponse(results, new PageInfo(count));
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
