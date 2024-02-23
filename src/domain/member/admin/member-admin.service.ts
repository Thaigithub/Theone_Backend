import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerCertificationType, CareerType, Member as MemberPrisma, PointStatus, Prisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { searchCategory } from './dto/member-admin-search-category.request.dto';
import { MemberAdminGetListCategory } from './enum/member-admin-get-list-recommendation-approval-category.enum';
import { MemberAdminGetListRecommendationSort } from './enum/member-admin-get-list-recommendation-sort.enum';
import { MemberAdminSearchCategoryFilter } from './enum/member-admin-search-category.enum';
import { MemberAdminSortCategoryFilter } from './enum/member-admin-sort-category.enum';
import { MemberAdminGetCountRequest } from './request/member-admin-count.request';
import { MemberAdminGetListRecommendationRequest } from './request/member-admin-get-list-recommendation.request';
import { MemberAdminGetPoinDetailtListRequest } from './request/member-admin-get-point-detail-list.request';
import { MemberAdminGetPointListRequest } from './request/member-admin-get-point-list.request';
import { ChangeMemberRequest, GetMembersListRequest } from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberAdminGetListRecommendationResponse } from './response/member-admin-get-list-recommendation.response';
import { MemberAdminGetListResponse } from './response/member-admin-get-list.response';
import { MemberAdminGetPointDetailListResponse } from './response/member-admin-get-point-detail-list.response';
import { MemberAdminGetPointDetailResponse } from './response/member-admin-get-point-detail.response';
import { MemberAdminGetPointListResponse } from './response/member-admin-get-point-list.response';

@Injectable()
export class MemberAdminService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
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
                currencyExchanges: {
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
            throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        }
        return member.currencyExchanges.reduce((sum, current) => sum + current.amount, 0);
    }

    // Methods used by controller
    async getList(query: GetMembersListRequest): Promise<MemberAdminGetListResponse> {
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
            where: this.parseConditionsFromQuery(query),

            ...QueryPagingHelper.queryPaging(query),
        });

        const count = await this.prismaService.member.count({ where: this.parseConditionsFromQuery(query) });
        return new PaginationResponse(members, new PageInfo(count));
    }

    async getCount(query: MemberAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            ...(query.accountStatus && {
                account: {
                    status: query.accountStatus,
                },
            }),
            ...(query.level && {
                level: query.level,
            }),
            isActive: true,
        };
        const count = await this.prismaService.member.count({
            where: queryFilter,
        });
        return {
            count: count,
        };
    }

    async getPointList(query: MemberAdminGetPointListRequest): Promise<MemberAdminGetPointListResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            isActive: true,
            ...(query.category == MemberAdminSearchCategoryFilter.NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category == MemberAdminSearchCategoryFilter.CONTACT && {
                contact: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(!query.category &&
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
                currencyExchanges: {
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
            const totalExchange = item.currencyExchanges.reduce((sum, current) => sum + current.amount, 0);
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

        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

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
                careers: true,
                applications: {
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
                licenses: {
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

        const healthInsuranceList = member.careers.filter(
            (item) => item.certificationType === CareerCertificationType.HEALTH_INSURANCE,
        );
        const employmentInsuranceList = member.careers.filter(
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
                residenceStatus: member.foreignWorker ? member.foreignWorker.residenceStatus : null,
            },
            teams: member.teams
                ? member.teams.map((item) => {
                      return {
                          id: item.teamId,
                          name: item.team.name,
                          occupation: item.team.code.name,
                      };
                  })
                : [],
            registeredExperienceList:
                member.careers.map((item) => {
                    if (item.type === CareerType.GENERAL) {
                        return {
                            companyName: item.companyName,
                            startDate: item.startDate.toISOString().split('T')[0],
                            endDate: item.endDate.toISOString().split('T')[0],
                        };
                    }
                }) || [],
            contractHistoryList:
                member.applications
                    .filter((item) => {
                        return item.contract;
                    })
                    .map((item) => {
                        return {
                            companyName: item.post.site.company.name,
                            startDate: item.contract.startDate.toISOString().split('T')[0],
                            endDate: item.contract.endDate.toISOString().split('T')[0],
                        };
                    }) || [],
            licenseList:
                member.licenses.map((item) => {
                    return {
                        codeName: item.code.name,
                        acquisitionDate: item.acquisitionDate.toISOString().split('T')[0],
                        status: item.status,
                    };
                }) || [],
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
            throw new NotFoundException(Error.MEMBER_NOT_FOUND);
        }
        const totalExchangePoint = await this.calculateExchange(id);
        return {
            name: member.name,
            contact: member.contact,
            totalPoint: member.totalPoint,
            totalExchangePoint: totalExchangePoint,
        } as MemberAdminGetPointDetailResponse;
    }

    async getPointDetailList(
        id: number,
        query: MemberAdminGetPoinDetailtListRequest,
    ): Promise<MemberAdminGetPointDetailListResponse> {
        const queryFilter: Prisma.PointWhereInput = {
            memberId: id,
            isActive: true,
            ...(query.status && { status: query.status }),
        };
        const points = await this.prismaService.point.findMany({
            where: queryFilter,
            select: {
                updatedAt: true,
                reason: true,
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
            where: queryFilter,
        });
        const results = points.map((item) => {
            return {
                completeAt: item.status !== PointStatus.APPROVED && item.status !== PointStatus.REJECTED ? null : item.updatedAt,
                reason: item.reason,
                amount: item.status !== PointStatus.APPROVED ? null : item.amount,
                remainAmount:
                    item.status !== PointStatus.APPROVED && item.status !== PointStatus.REJECTED ? null : item.remainAmount,
                status: item.status,
            };
        });
        return new PaginationResponse(results, new PageInfo(count));
    }

    async getListHeadhunting(query: MemberAdminGetListRecommendationRequest): Promise<MemberAdminGetListRecommendationResponse> {
        const queryFilter: Prisma.MemberWhereInput = {
            isActive: true,
            ...(query.tier && { level: query.tier }),
            ...(query.category === MemberAdminGetListCategory.WORK_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === MemberAdminGetListCategory.ID && {
                account: { username: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.category === MemberAdminGetListCategory.CONTACT && {
                contact: { contains: query.keyword, mode: 'insensitive' },
            }),
            //TODO: Special
        };

        const list = await this.prismaService.member.findMany({
            select: {
                id: true,
                level: true,
                name: true,
                contact: true,
                careers: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        code: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                licenses: {
                    where: {
                        isActive: true,
                    },
                    select: {
                        code: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                account: {
                    select: {
                        username: true,
                    },
                },
                memberEvaluation: {
                    select: {
                        averageScore: true,
                    },
                },
                headhuntingRecommendations: {
                    include: {
                        headhuntingRequest: {
                            select: {
                                headhunting: {
                                    select: {
                                        postId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                ...(query.sortScore === MemberAdminGetListRecommendationSort.HIGHEST_SCORE && {
                    memberEvaluation: { averageScore: { sort: 'desc', nulls: 'last' } },
                }),
                ...(query.sortScore === MemberAdminGetListRecommendationSort.LOWEST_SCORE && {
                    memberEvaluation: { averageScore: { sort: 'asc', nulls: 'last' } },
                }),
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const listCount = await this.prismaService.member.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const recommendation = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                id: query.requestId,
                isActive: true,
            },
            select: {
                headhunting: {
                    select: {
                        recommendations: {
                            select: {
                                memberId: true,
                            },
                            where: {
                                NOT: {
                                    member: null,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!recommendation) throw new NotFoundException(Error.HEADHUNTING_REQUEST_NOT_FOUND);

        const responseList = list.map((item) => {
            return {
                id: item.id,
                name: item.name,
                username: item.account.username,
                contact: item.contact,
                level: item.level,
                desiredOccupations:
                    item.careers && item.careers.length > 0
                        ? item.careers.map((item) => {
                              return item.code.name;
                          })
                        : [],
                licenses: item.licenses
                    ? item.licenses.map((subItem) => {
                          return subItem.code.name;
                      })
                    : [],
                averageScore: item.memberEvaluation ? item.memberEvaluation.averageScore : null,
                isSuggest: recommendation.headhunting.recommendations.map((item) => item.memberId).includes(item.id),
            };
        });

        return new PaginationResponse(responseList, new PageInfo(listCount));
    }

    async updateMember(id: number, body: ChangeMemberRequest): Promise<void> {
        const memberExist = await this.prismaService.member.count({
            where: {
                id,
            },
        });

        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

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
            } else throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
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
