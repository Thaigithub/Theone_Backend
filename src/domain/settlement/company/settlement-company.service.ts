import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationCategory, Prisma, RequestObject, SettlementStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SettlementCompanyStatus } from './enum/settlement-company-status.enum';
import { SettlementCompanyGetListRequest } from './request/settlement-company-get-list.request';
import { SettlementCompanyGetDetail } from './response/settlement-company-get-detail.response';
import { SettlementCompanyGetListResponse } from './response/settlement-company-get-list.response';

@Injectable()
export class SettlementCompanyService {
    constructor(private readonly prismaService: PrismaService) {}
    async getList(accountId: number, query: SettlementCompanyGetListRequest): Promise<SettlementCompanyGetListResponse> {
        const queryFilter: Prisma.SettlementWhereInput = {
            ...(query.status === SettlementCompanyStatus.REQUESTED && { status: SettlementStatus.REQUESTED }),
            ...(query.status === SettlementCompanyStatus.UNSETTLED && { status: SettlementStatus.UNSETTLED }),
            ...(query.status === SettlementCompanyStatus.SETTLED && { status: SettlementStatus.SETTLED }),
            completeDate: {
                ...(query.startDate && { gte: new Date(query.startDate) }),
                ...(query.endDate && { lte: new Date(query.endDate) }),
            },
            headHuntingRecommendation: {
                AND: [
                    { NOT: { applicationId: null } },
                    {
                        application: {
                            category: ApplicationCategory.HEADHUNTING,
                            NOT: { contract: null },
                            ...(query.type === RequestObject.INDIVIDUAL && {
                                AND: [
                                    { NOT: { memberId: null } },
                                    {
                                        member: {
                                            ...(query.keyword && {
                                                name: { contains: query.keyword, mode: 'insensitive' },
                                            }),
                                        },
                                    },
                                ],
                            }),
                            ...(query.type === RequestObject.TEAM && {
                                AND: [
                                    { NOT: { teamId: null } },
                                    {
                                        team: {
                                            ...(query.keyword && {
                                                name: { contains: query.keyword, mode: 'insensitive' },
                                            }),
                                        },
                                    },
                                ],
                            }),
                            post: {
                                company: {
                                    isActive: true,
                                    accountId: accountId,
                                },
                            },
                        },
                    },
                ],
            },
        };

        const settlements = (
            await this.prismaService.settlement.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    headHuntingRecommendation: {
                        select: {
                            application: {
                                select: {
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
                                                    contact: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    status: true,
                    completeDate: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name:
                    query.type === RequestObject.INDIVIDUAL
                        ? item.headHuntingRecommendation.application.member.name
                        : item.headHuntingRecommendation.application.team.name,
                contact:
                    query.type === RequestObject.INDIVIDUAL
                        ? item.headHuntingRecommendation.application.member.contact
                        : item.headHuntingRecommendation.application.team.leader.contact,
                settlementStatus: item.status,
                completeDate: item.completeDate,
            };
        });

        const count = await this.prismaService.settlement.count({
            where: queryFilter,
        });

        return new PaginationResponse(settlements, new PageInfo(count));
    }

    async getDetail(accountId: number, id: number): Promise<SettlementCompanyGetDetail> {
        const settlement = await this.prismaService.settlement.findUnique({
            where: {
                id: id,
                headHuntingRecommendation: {
                    AND: [
                        { NOT: { applicationId: null } },
                        {
                            application: {
                                post: {
                                    isActive: true,
                                    company: {
                                        accountId: accountId,
                                        isActive: true,
                                    },
                                },
                                NOT: { contract: null },
                                OR: [{ NOT: { member: null } }, { NOT: { team: null } }],
                            },
                        },
                    ],
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
            throw new NotFoundException('The settlement id is not found');
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

    async update(accountId: number, id: number): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            const settlement = await prisma.settlement.findUnique({
                where: {
                    id: id,
                    headHuntingRecommendation: {
                        application: {
                            post: {
                                isActive: true,
                                company: {
                                    accountId: accountId,
                                    isActive: true,
                                },
                            },
                            NOT: { contract: null },
                        },
                    },
                    isActive: true,
                },
                select: {
                    status: true,
                },
            });
            if (!settlement) {
                throw new NotFoundException('The settlement is not found');
            }
            if (settlement.status === SettlementStatus.UNSETTLED) {
                await prisma.settlement.update({
                    where: {
                        id: id,
                        headHuntingRecommendation: {
                            application: {
                                post: {
                                    isActive: true,
                                    company: {
                                        accountId: accountId,
                                        isActive: true,
                                    },
                                },
                            },
                        },
                    },
                    data: {
                        requestDate: new Date(),
                        status: SettlementStatus.REQUESTED,
                    },
                });
            }
        });
    }
}
