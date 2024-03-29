/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestObject } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborCompanyCreateRequest } from './request/labor-company-create.request';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyUpsertSalaryRequest } from './request/labor-company-upsert-salary.request';
import { LaborCompanyUpsertWorkDateRequest } from './request/labor-company-upsert-workdate.request';
import { LaborCompanyGetDetailSalaryResponse } from './response/labor-company-get-detail-salary.response';
import { LaborCompanyGetDetailResponse } from './response/labor-company-get-detail.response';
import { LaborCompanyGetListWorkDateResponse } from './response/labor-company-get-list-workdates.response';
import { LaborCompanyGetListResponse } from './response/labor-company-get-list.response';

@Injectable()
export class LaborCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: LaborCompanyGetListRequest): Promise<LaborCompanyGetListResponse> {
        const queryFilter: Prisma.ContractWhereInput = {
            NOT: {
                application: {
                    member: query.type && (query.type === RequestObject.INDIVIDUAL ? null : undefined),
                    team: query.type && (query.type === RequestObject.TEAM ? null : undefined),
                },
            },
            application: {
                post: {
                    company: {
                        accountId,
                    },
                    site: {
                        name: query.keyword && { contains: query.keyword },
                    },
                },
            },
            startDate: {
                gte: query.startDate && new Date(query.startDate),
            },
            endDate: {
                lte: query.startDate && new Date(query.endDate),
            },
        };
        const labors = (
            await this.prismaService.contract.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    labor: {
                        select: {
                            id: true,
                            workDates: {
                                select: {
                                    hour: true,
                                },
                            },
                        },
                    },
                    application: {
                        select: {
                            team: {
                                select: {
                                    name: true,
                                },
                            },
                            member: {
                                select: {
                                    name: true,
                                },
                            },
                            post: {
                                select: {
                                    site: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    startDate: true,
                    endDate: true,
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                contractId: item.id,
                laborId: item.labor ? item.labor.id : null,
                type: item.application.member ? RequestObject.INDIVIDUAL : RequestObject.TEAM,
                name: item.application.member ? item.application.member.name : item.application.team.name,
                siteName: item.application.post.site.name,
                startDate: item.startDate,
                endDate: item.endDate,
                numberOfHours: item.labor
                    ? item.labor.workDates.reduce((accum, current) => {
                          return accum + current.hour;
                      }, 0)
                    : null,
            };
        });
        const total = await this.prismaService.contract.count({
            where: queryFilter,
        });
        return new PaginationResponse(labors, new PageInfo(total));
    }
    async create(accountId: number, body: LaborCompanyCreateRequest): Promise<void> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id: body.contractId,
                application: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            },
            include: {
                application: {
                    include: {
                        member: true,
                        post: {
                            include: {
                                site: true,
                            },
                        },
                    },
                },
                labor: true,
            },
        });
        if (!contract) throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
        if (contract.labor) throw new BadRequestException(Error.LABOR_EXISTED);
        const labor = await this.prismaService.labor.create({
            data: {
                contractId: body.contractId,
                workDates: {
                    createMany: {
                        data: body.workDate.map((item) => {
                            return {
                                date: new Date(item.date),
                                hour: item.hours,
                            };
                        }),
                    },
                },
            },
        });

        if (contract.application.memberId) {
            // Create member evaluation ticket for company
            const memberEvaluation = await this.prismaService.memberEvaluation.upsert({
                create: {
                    memberId: contract.application.memberId,
                    totalEvaluators: 0,
                },
                update: {
                    memberId: contract.application.memberId,
                    totalEvaluators: 0,
                    totalScores: null,
                    averageScore: null,
                    createdAt: new Date(),
                },
                where: {
                    isActive: true,
                    memberId: contract.application.memberId,
                },
            });
            await this.prismaService.memberEvaluationByCompany.create({
                data: {
                    memberEvaluationId: memberEvaluation.id,
                    siteId: contract.application.post.siteId,
                },
            });

            // Create site evaluation ticket for contract
            const siteEvaluation = await this.prismaService.siteEvaluation.upsert({
                create: {
                    siteId: contract.application.post.siteId,
                    totalEvaluators: 0,
                },
                update: {
                    siteId: contract.application.post.siteId,
                    totalEvaluators: 0,
                    totalScores: null,
                    averageScore: null,
                    createdAt: new Date(),
                },
                where: {
                    isActive: true,
                    siteId: contract.application.post.siteId,
                },
            });
            await this.prismaService.siteEvaluationByContract.create({
                data: {
                    siteEvaluationId: siteEvaluation.id,
                    contractId: contract.id,
                },
            });
        } else if (contract.application.teamId) {
            const teamEvaluation = await this.prismaService.teamEvaluation.upsert({
                create: {
                    teamId: contract.application.teamId,
                    totalEvaluators: 0,
                },
                update: {
                    teamId: contract.application.teamId,
                    totalEvaluators: 0,
                    totalScores: null,
                    averageScore: null,
                    createdAt: new Date(),
                },
                where: {
                    isActive: true,
                    teamId: contract.application.teamId,
                },
            });
            await this.prismaService.teamEvaluationByCompany.create({
                data: {
                    teamEvaluationId: teamEvaluation.id,
                    siteId: contract.application.post.siteId,
                },
            });
        }

        await this.prismaService.salaryHistory.createMany({
            data: body.salaryHistory.map((item) => {
                const { date, ...rest } = item;
                return {
                    laborId: labor.id,
                    ...rest,
                    date: new Date(date),
                };
            }),
        });
    }
    async getDetail(accountId: number, id: number): Promise<LaborCompanyGetDetailResponse> {
        const labor = await this.prismaService.labor.findUnique({
            where: {
                id,
                contract: {
                    application: {
                        post: {
                            company: {
                                accountId,
                            },
                        },
                    },
                },
            },
            select: {
                contractId: true,
                id: true,
                workDates: {
                    select: {
                        date: true,
                        hour: true,
                        id: true,
                    },
                },
                salaryHistories: true,
                contract: {
                    select: {
                        paymentForm: true,
                        amount: true,
                        salaryType: true,
                        startDate: true,
                        endDate: true,
                        application: {
                            select: {
                                post: {
                                    select: {
                                        site: {
                                            select: {
                                                name: true,
                                            },
                                        },
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
            },
        });
        return {
            id: labor.id,
            salaryHistory: labor.salaryHistories.map((item) => {
                const { date, ...rest } = item;
                delete rest.laborId;
                return {
                    ...rest,
                    date: date,
                };
            }),
            workDate: labor.workDates.map((item) => {
                return {
                    id: item.id,
                    date: item.date,
                    hours: item.hour,
                };
            }),
            paymentForm: labor.contract.paymentForm,
            type: labor.contract.application.member ? RequestObject.INDIVIDUAL : RequestObject.TEAM,
            name: labor.contract.application.member
                ? labor.contract.application.member.name
                : labor.contract.application.team.name,
            contact: labor.contract.application.member
                ? labor.contract.application.member.contact
                : labor.contract.application.team.leader.contact,
            siteName: labor.contract.application.post.site.name,
            startDate: labor.contract.startDate,
            endDate: labor.contract.endDate,
            salaryType: labor.contract.salaryType,
            amount: labor.contract.amount,
        };
    }
    async getDetailSalary(accountId: number, laborId: number, salaryId: number): Promise<LaborCompanyGetDetailSalaryResponse> {
        const salary = await this.prismaService.salaryHistory.findUnique({
            where: {
                id: salaryId,
                laborId: laborId,
                labor: {
                    contract: {
                        application: {
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!salary) throw new NotFoundException(Error.SALARY_NOT_FOUND);
        return {
            ...salary,
            date: salary.date,
        };
    }
    async createSalary(accountId: number, id: number, body: LaborCompanyUpsertSalaryRequest): Promise<void> {
        const labor = await this.prismaService.labor.findUnique({
            where: {
                id,
                contract: {
                    application: {
                        post: {
                            company: {
                                accountId,
                            },
                        },
                    },
                },
            },
        });
        if (!labor) throw new NotFoundException(Error.LABOR_NOT_FOUND);
        const count = await this.prismaService.salaryHistory.count({
            where: {
                laborId: id,
                date: new Date(body.date),
            },
        });
        if (count !== 0) throw new BadRequestException(Error.SALARY_EXISTED);
        const { date, ...rest } = body;
        await this.prismaService.salaryHistory.create({
            data: {
                laborId: id,
                ...rest,
                date: new Date(date),
            },
        });
    }
    async updateSalary(
        accountId: number,
        laborId: number,
        salaryId: number,
        body: LaborCompanyUpsertSalaryRequest,
    ): Promise<void> {
        const salary = await this.prismaService.salaryHistory.findUnique({
            where: {
                id: salaryId,
                laborId: laborId,
                labor: {
                    contract: {
                        application: {
                            post: {
                                company: {
                                    accountId,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!salary) throw new NotFoundException(Error.SALARY_NOT_FOUND);
        const { date, ...rest } = body;
        await this.prismaService.salaryHistory.update({
            where: {
                id: salaryId,
            },
            data: {
                ...rest,
                date: new Date(date),
            },
        });
    }
    async updateWorkDate(accountId: number, id: number, body: LaborCompanyUpsertWorkDateRequest): Promise<void> {
        const labor = await this.prismaService.labor.findUnique({
            where: {
                id,
                contract: {
                    application: {
                        post: {
                            company: {
                                accountId,
                            },
                        },
                    },
                },
            },
            select: {
                workDates: {
                    select: {
                        id: true,
                        date: true,
                    },
                },
            },
        });
        if (!labor) throw new NotFoundException(Error.LABOR_NOT_FOUND);
        await this.prismaService.workDate.deleteMany({
            where: {
                laborId: id,
            },
        });
        if (body.workDate.length !== 0) {
            await this.prismaService.workDate.createMany({
                data: body.workDate.map((item) => {
                    return {
                        date: new Date(item.date),
                        hour: item.hours,
                        laborId: id,
                    };
                }),
            });
        }
    }

    async getWorkDates(accountId: number, id: number): Promise<LaborCompanyGetListWorkDateResponse> {
        const workDates =( await this.prismaService.workDate.findMany({
            where: {
                laborId: id,
                labor: {
                    contract: {
                        application: {
                            post: {
                                site: {
                                    company: {
                                        accountId: accountId,
                                        isActive: true,
                                    },
                                    isActive: true,
                                },
                                isActive: true,
                            },
                        },
                    },
                },
            },
            select: {
                date: true,
                hour: true,
            },
        })).map((item) => {
            return {
                hours: item.hour,
                date: item.date,
            }
        });
        return {
            workDates: workDates,
        };
    }
}
