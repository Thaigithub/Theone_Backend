import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborType } from './enum/labor-company-labor-type.enum';
import { LaborCompanyCreateRequest } from './request/labor-company-create.request';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyCreateSalaryRequest } from './request/labor-company-salary-create.request';
import { LaborCompanyUpdateRequest } from './request/labor-company-update.request';
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
                        numberOfHours: true,
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
                numberOfHours: item.labor ? item.labor.numberOfHours : null,
            };
        });
        const total = await this.prismaService.contract.count({
            where: request.where,
        });
        return new PaginationResponse(labor, new PageInfo(total));
    }
    async create(accountId: number, body: LaborCompanyCreateRequest): Promise<void> {
        const count = body.workDate
            .map((item) => {
                const month = new Date(item.date).getMonth();
                const year = new Date(item.date).getFullYear();
                return year * 100 + month;
            })
            .reduce((accum, current) => {
                if (!accum.includes(current)) return [...accum, current];
            }, []).length;
        if (count !== body.workDate.length) throw new BadRequestException('Only one payment each month');
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
            },
        });
        if (!contract) throw new NotFoundException('Contract not found');
        if (contract.labor) throw new BadRequestException('Labor existed!');
        const labor = await this.prismaService.labor.create({
            data: {
                contractId: body.contractId,
                numberOfHours: body.numberOfHours,
                workDates: body.workDate.map((item) => new Date(item.date)),
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
                    month: new Date(date).getMonth(),
                    year: new Date(date).getFullYear(),
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
                numberOfHours: true,
                workDates: true,
                salaryHistories: true,
                contract: {
                    select: {
                        amount: true,
                        paymentForm: true,
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
            numberOfHours: labor.numberOfHours,
            salaryHistory: labor.salaryHistories.map((item) => {
                const { month, year, laborId, ...rest } = item;
                return {
                    ...rest,
                    date: `${year}-${month}-01`,
                };
            }),
            workDate: labor.workDates,
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
            paymentForm: labor.contract.paymentForm,
            amount: labor.contract.amount,
        };
    }
    async update(accountId: number, id: number, body: LaborCompanyUpdateRequest): Promise<void> {
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
        await this.prismaService.labor.update({
            where: {
                id,
            },
            data: {
                workDates: body.workDate.map((item) => new Date(item.date)),
                numberOfHours: body.numberOfHours,
            },
        });
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
            date: new Date(salary.year, salary.month),
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
                year: new Date(body.date).getFullYear(),
                month: new Date(body.date).getMonth(),
            },
        });
        if (count !== 0) throw new BadRequestException('Salary has been registered for this month');
        const { date, ...rest } = body;
        await this.prismaService.salaryHistory.create({
            data: {
                laborId: id,
                ...rest,
                month: new Date(date).getMonth(),
                year: new Date(date).getFullYear(),
            },
        });
    }
}
