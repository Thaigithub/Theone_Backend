import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SalaryType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborType } from './enum/labor-company-labor-type.enum';
import { LaborCompanyCreateRequest } from './request/labor-company-create.request';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyCreateSalaryRequest } from './request/labor-company-salary-create.request';
import { LaborCompanyUpsertWorkDateRequest } from './request/labor-company-update-workdate.request';
import { LaborCompanyGetDetailResponse } from './response/labor-company-get-detail.response';
import { LaborCompanyGetListResponse } from './response/labor-company-get-list.response';
import { LaborCompanyGetDetailSalaryResponse } from './response/labor-company-salary-get-detail';

@Injectable()
export class LaborCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getList(accountId: number, query: LaborCompanyGetListRequest): Promise<LaborCompanyGetListResponse> {
        const request = {
            where: {
                NOT: {
                    application: {
                        member: query.type && (query.type === LaborType.INDIVIDUAL ? null : undefined),
                        team: query.type && (query.type === LaborType.TEAM ? null : undefined),
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
            },
            select: {
                id: true,
                labor: {
                    select: {
                        id: true,
                        workDates: {
                            select: {
                                hours: true,
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
        };
        const labor = (await this.prismaService.contract.findMany(request)).map((item) => {
            return {
                contractId: item.id,
                laborId: item.labor ? item.labor.id : null,
                type: item.application.member ? LaborType.INDIVIDUAL : LaborType.TEAM,
                name: item.application.member ? item.application.member.name : item.application.team.name,
                siteName: item.application.post.site.name,
                startDate: item.startDate,
                endDate: item.endDate,
                numberOfHours: item.labor
                    ? item.labor.workDates.reduce((accum, current) => {
                          return accum + current.hours;
                      }, 0)
                    : null,
            };
        });
        const total = await this.prismaService.contract.count({
            where: request.where,
        });
        return new PaginationResponse(labor, new PageInfo(total));
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
            select: {
                labor: true,
                salaryType: true,
            },
        });
        if (!contract) throw new NotFoundException('Contract not found');
        if (contract.labor) throw new BadRequestException('Labor existed!');
        if (contract.salaryType === SalaryType.MONTHLY) {
            const count = body.salaryHistory
                .map((item) => {
                    const month = new Date(item.date).getMonth();
                    const year = new Date(item.date).getFullYear();
                    return `${year}-${month}`;
                })
                .reduce((accum, current) => {
                    if (!accum.includes(current)) {
                        accum.push(current);
                        return accum;
                    } else return accum;
                }, []);
            if (count.length !== body.salaryHistory.length) throw new BadRequestException('Only one payment each month');
        } else if (contract.salaryType === SalaryType.DAILY) {
            const count = body.salaryHistory
                .map((item) => item.date)
                .reduce((accum, current) => {
                    if (!accum.includes(current)) {
                        accum.push(current);
                        return accum;
                    } else return accum;
                }, []);
            if (count.length !== body.salaryHistory.length) throw new BadRequestException('Only one payment each day');
        }
        const labor = await this.prismaService.labor.create({
            data: {
                contractId: body.contractId,
                workDates: {
                    createMany: {
                        data: body.workDate.map((item) => {
                            return {
                                date: new Date(item.date),
                                hours: item.hours,
                            };
                        }),
                    },
                },
            },
            select: {
                id: true,
            },
        });
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
                        hours: true,
                        id: true,
                    },
                },
                salaryHistories: true,
                contract: {
                    select: {
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
                const { date, laborId, ...rest } = item;
                return {
                    ...rest,
                    date: date.toISOString(),
                };
            }),
            workDate: labor.workDates.map((item) => {
                return {
                    id: item.id,
                    date: item.date,
                    hours: item.hours,
                };
            }),
            type: labor.contract.application.member ? LaborType.INDIVIDUAL : LaborType.TEAM,
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
        if (!salary) throw new NotFoundException('Salary not found');
        return {
            ...salary,
            date: salary.date,
        };
    }
    async createSalary(accountId: number, id: number, body: LaborCompanyCreateSalaryRequest): Promise<void> {
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
        if (!labor) throw new NotFoundException('Labor not found');
        const count = await this.prismaService.salaryHistory.count({
            where: {
                laborId: id,
                date: new Date(body.date),
            },
        });
        if (count !== 0) throw new BadRequestException('Salary has been registered for this month');
        const { date, ...rest } = body;
        await this.prismaService.salaryHistory.create({
            data: {
                laborId: id,
                ...rest,
                date: new Date(date),
            },
        });
    }
    async updateWorkDate(
        accountId: number,
        id: number,
        workDateId: number,
        body: LaborCompanyUpsertWorkDateRequest,
    ): Promise<void> {
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
        if (!labor) throw new NotFoundException('Labor not found');
        if (!labor.workDates.map((item) => item.id).includes(workDateId)) throw new NotFoundException('WorkDate not found');
        if (labor.workDates.map((item) => item.date).includes(new Date(body.date)))
            throw new ConflictException('A salary with this date has been registered');
        await this.prismaService.workDate.update({
            where: {
                id,
            },
            data: {
                date: new Date(body.date),
                hours: body.hours,
            },
        });
    }
    async createWorkDate(accountId: number, id: number, body: LaborCompanyUpsertWorkDateRequest): Promise<void> {
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
                        date: true,
                    },
                },
            },
        });
        if (!labor) throw new NotFoundException('Labor not found');
        if (labor.workDates.map((item) => item.date).includes(new Date(body.date)))
            throw new ConflictException('A salary with this date has been registered');
        await this.prismaService.workDate.create({
            data: {
                date: new Date(body.date),
                hours: body.hours,
                laborId: id,
            },
        });
    }
    async deleteWorkDate(accountId: number, id: number, workDateId: number): Promise<void> {
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
        if (!labor) throw new NotFoundException('Labor not found');
        if (!labor.workDates.map((item) => item.id).includes(workDateId)) throw new NotFoundException('WorkDate not found');
        await this.prismaService.workDate.delete({
            where: {
                id: workDateId,
            },
        });
    }
}
