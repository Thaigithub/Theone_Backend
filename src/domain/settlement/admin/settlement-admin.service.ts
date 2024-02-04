import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, Prisma, RequestObject, SettlementStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SettlementAdminCategory } from './enum/settlement-admin-category';
import { SettlementAdminStageCategory } from './enum/settlement-admin-stage-category.enum';
import { SettlementAdminAmountRequest } from './request/settlement-admin-get-amount.request';
import { SettlementAdminGetListRequest } from './request/settlement-admin-get-list.request';
import { SettlementAdminGetDetail } from './response/settlement-admin-get-detail.response';
import { SettlementAdminGetListResponse } from './response/settlement-admin-get-list.response';

@Injectable()
export class SettlementAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: SettlementAdminGetListRequest): Promise<SettlementAdminGetListResponse> {
        const queryFilter: Prisma.SettlementWhereInput = {
            status: query.status,
            headHuntingRecommendation: {
                application: {
                    category: ApplicationCategory.HEADHUNTING,
                    ...(query.object === RequestObject.INDIVIDUAL && {
                        NOT: { member: null },
                    }),
                    ...(query.object === RequestObject.TEAM && { NOT: { team: null } }),
                    ...(query.category === SettlementAdminCategory.CONTACT &&
                        query.object === RequestObject.INDIVIDUAL && {
                            member: {
                                contact: { contains: query.keyword, mode: 'insensitive' },
                            },
                        }),
                    ...(query.category === SettlementAdminCategory.NAME &&
                        query.object === RequestObject.INDIVIDUAL && {
                            member: {
                                name: { contains: query.keyword, mode: 'insensitive' },
                            },
                        }),
                    ...(query.category === SettlementAdminCategory.CONTACT &&
                        query.object === RequestObject.TEAM && {
                            team: {
                                leader: { contact: { contains: query.keyword, mode: 'insensitive' } },
                            },
                        }),
                    ...(query.category === SettlementAdminCategory.NAME &&
                        query.object === RequestObject.TEAM && {
                            team: {
                                name: { contains: query.keyword, mode: 'insensitive' },
                            },
                        }),
                    ...(!query.category &&
                        query.keyword && {
                            OR: [
                                {
                                    member: {
                                        OR: [
                                            { name: { contains: query.keyword, mode: 'insensitive' } },
                                            { contact: { contains: query.keyword, mode: 'insensitive' } },
                                        ],
                                    },
                                },
                                {
                                    team: {
                                        OR: [
                                            { name: { contains: query.keyword, mode: 'insensitive' } },
                                            { leader: { contact: { contains: query.keyword, mode: 'insensitive' } } },
                                        ],
                                    },
                                },
                            ],
                        }),
                },
            },

            ...(query.startDate && { completeDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { completeDate: { lte: new Date(query.endDate) } }),
        };
        const settlements = (
            await this.prismaService.settlement.findMany({
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
                select: {
                    id: true,
                    headHuntingRecommendation: {
                        select: {
                            application: {
                                select: {
                                    team: {
                                        select: {
                                            name: true,
                                            leader: {
                                                select: {
                                                    contact: true,
                                                },
                                            },
                                        },
                                    },
                                    member: {
                                        select: {
                                            name: true,
                                            contact: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    requestDate: true,
                    completeDate: true,
                    status: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                object: item.headHuntingRecommendation.application.team ? RequestObject.TEAM : RequestObject.INDIVIDUAL,
                name: item.headHuntingRecommendation.application.team
                    ? item.headHuntingRecommendation.application.team.name
                    : item.headHuntingRecommendation.application.member.name,
                contact: item.headHuntingRecommendation.application.team
                    ? item.headHuntingRecommendation.application.team.leader.contact
                    : item.headHuntingRecommendation.application.member.contact,
                requestDate: item.requestDate,
                status: item.status,
                completeDate: item.completeDate,
            };
        });
        const count = await this.prismaService.settlement.count({
            where: queryFilter,
        });
        return new PaginationResponse(settlements, new PageInfo(count));
    }

    async getDetail(id: number): Promise<SettlementAdminGetDetail> {
        const settlement = await this.prismaService.settlement.findUnique({
            where: {
                id: id,
                headHuntingRecommendation: {
                    application: {
                        NOT: { contract: null },
                        OR: [{ NOT: { member: null } }, { NOT: { team: null } }],
                    },
                },
            },
            select: {
                headHuntingRecommendation: {
                    select: {
                        application: {
                            select: {
                                post: {
                                    select: {
                                        site: {
                                            select: {
                                                name: true,
                                                startDate: true,
                                                endDate: true,
                                            },
                                        },
                                    },
                                },
                                member: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                                team: {
                                    select: {
                                        name: true,
                                        leader: {
                                            select: {
                                                name: true,
                                                contact: true,
                                            },
                                        },
                                    },
                                },
                                contract: {
                                    select: {
                                        startDate: true,
                                        endDate: true,
                                        labor: {
                                            select: {
                                                id: true,
                                                salaryHistories: {
                                                    orderBy: { date: 'desc' },
                                                    take: 1,
                                                    select: {
                                                        base: true,
                                                        totalDeductible: true,
                                                        totalPayment: true,
                                                    },
                                                },
                                                workDates: {
                                                    select: {
                                                        hour: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!settlement) {
            throw new NotFoundException(Error.SETTLEMENT_NOT_FOUND);
        }
        const workLoadInformation = () => {
            const countWorkDays = settlement.headHuntingRecommendation.application.contract.labor
                ? settlement.headHuntingRecommendation.application?.contract.labor.workDates.length
                : null;
            const averageWorkLoad =
                settlement.headHuntingRecommendation.application.contract.labor && countWorkDays > 0
                    ? settlement.headHuntingRecommendation.application.contract.labor.workDates.reduce((total, current) => {
                          return total + current.hour;
                      }, 0) / countWorkDays
                    : null;
            return {
                workDays: countWorkDays,
                workLoad: averageWorkLoad,
                laborId: settlement.headHuntingRecommendation.application.contract.labor
                    ? settlement.headHuntingRecommendation.application.contract.labor.id
                    : null,
            };
        };
        return {
            siteInfor: {
                siteName: settlement.headHuntingRecommendation.application.post.site.name,
                startDateConstruction: settlement.headHuntingRecommendation.application.post.site.startDate,
                endDateConstruction: settlement.headHuntingRecommendation.application.post.site.endDate,
                startDateContract: settlement.headHuntingRecommendation.application.contract.startDate,
                endDateContract: settlement.headHuntingRecommendation.application.contract.endDate,
                isWorking:
                    new Date() <= settlement.headHuntingRecommendation.application.contract.endDate &&
                    new Date() >= settlement.headHuntingRecommendation.application.contract.startDate,
            },
            wageInfor: settlement.headHuntingRecommendation.application.contract.labor
                ? {
                      wage: settlement.headHuntingRecommendation.application.contract.labor?.salaryHistories[0]?.base
                          ? settlement.headHuntingRecommendation.application.contract.labor.salaryHistories[0].base
                          : null,
                      deductibleAmount: settlement.headHuntingRecommendation.application.contract.labor?.salaryHistories[0]
                          ?.totalDeductible
                          ? settlement.headHuntingRecommendation.application.contract.labor.salaryHistories[0].totalDeductible
                          : null,
                      actualSalary: settlement.headHuntingRecommendation.application.contract.labor?.salaryHistories[0]
                          ?.totalPayment
                          ? settlement.headHuntingRecommendation.application.contract.labor.salaryHistories[0].totalPayment
                          : null,
                  }
                : null,
            workLoadInfor: workLoadInformation(),
            leaderName: settlement.headHuntingRecommendation.application.team
                ? settlement.headHuntingRecommendation.application.team.leader.name
                : null,
            teamName: settlement.headHuntingRecommendation.application.team
                ? settlement.headHuntingRecommendation.application.team.name
                : null,
            name: settlement.headHuntingRecommendation.application.team
                ? settlement.headHuntingRecommendation.application.team.leader.name
                : settlement.headHuntingRecommendation.application.member.name,
            contact: settlement.headHuntingRecommendation.application.team
                ? settlement.headHuntingRecommendation.application.team.leader.contact
                : settlement.headHuntingRecommendation.application.member.contact,
        };
    }

    async update(id: number) {
        const settlement = await this.prismaService.settlement.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                status: true,
            },
        });
        if (settlement.status === SettlementStatus.REQUESTED) {
            await this.prismaService.settlement.update({
                where: {
                    id: id,
                    isActive: true,
                },
                data: {
                    status: SettlementStatus.SETTLED,
                    completeDate: new Date(),
                },
            });
        }
    }

    async getAmount(query: SettlementAdminAmountRequest): Promise<CountResponse> {
        const currentDate = new Date();
        const queryFilter: Prisma.SettlementWhereInput = {
            status: SettlementStatus.SETTLED,
            ...(query.stage === SettlementAdminStageCategory.CURRENT_YEAR &&
                !query.status && {
                    usageHistory: { createdAt: { gte: new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0, 0) } },
                }),
            ...(query.stage === SettlementAdminStageCategory.CURRENT_MONTH &&
                !query.status && {
                    usageHistory: {
                        createdAt: { gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0) },
                    },
                }),
            headHuntingRecommendation: {
                NOT: { applicationId: null },
            },
        };
        const count = (
            await this.prismaService.settlement.findMany({
                where: queryFilter,
                select: {
                    headHuntingRecommendation: {
                        select: {
                            headhuntingRequest: {
                                select: {
                                    usageHistory: {
                                        select: {
                                            productPaymentHistory: {
                                                select: {
                                                    cost: true,
                                                    product: {
                                                        select: {
                                                            countLimit: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })
        )
            .map((item) => {
                return {
                    cost: item.headHuntingRecommendation.headhuntingRequest.usageHistory.productPaymentHistory.cost,
                    counLimit:
                        item.headHuntingRecommendation.headhuntingRequest.usageHistory.productPaymentHistory.product.countLimit,
                };
            })
            .reduce((sum, currentObject) => {
                if (currentObject.counLimit === 0) {
                    return sum;
                }
                return sum + (0.1 * currentObject.cost) / currentObject.counLimit;
            }, 0);
        return {
            count: count,
        };
    }
}
