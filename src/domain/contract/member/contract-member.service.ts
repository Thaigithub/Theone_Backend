import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractMemberGetListStatus } from './enum/contract-member-get-list-status.enum';
import { ContractMemberGetListForSalaryRequest } from './request/contract-member-get-list-for-salary.request';
import { ContractMemberGetListRequest } from './request/contract-member-get-list.request';
import { ContractMemberGetDetailForSalaryResponse } from './response/contract-member-get-detail-for-salary.response';
import { ContractMemberGetDetailResponse } from './response/contract-member-get-detail.response';
import { ContractMemberGetListForSalaryResponse } from './response/contract-member-get-list-for-salary.response';
import { ContractMemberGetListResponse } from './response/contract-member-get-list.response';

@Injectable()
export class ContractMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: ContractMemberGetListRequest): Promise<ContractMemberGetListResponse> {
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                startDate: {
                    gte: query.startDate && new Date(query.startDate),
                },
                endDate: {
                    lte: query.endDate && new Date(query.endDate),
                },
                application: {
                    OR: [
                        {
                            member: {
                                accountId,
                            },
                        },
                        {
                            team: {
                                OR: [
                                    {
                                        leader: {
                                            accountId,
                                        },
                                    },
                                    {
                                        members: {
                                            some: {
                                                member: {
                                                    accountId,
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            select: {
                id: true,
                application: {
                    select: {
                        post: {
                            select: {
                                interests: {
                                    where: {
                                        member: {
                                            accountId,
                                        },
                                    },
                                },
                                code: {
                                    select: {
                                        name: true,
                                    },
                                },
                                endDate: true,
                                name: true,
                                id: true,
                                company: {
                                    select: {
                                        logo: true,
                                    },
                                },
                                site: {
                                    select: {
                                        name: true,
                                        startDate: true,
                                        endDate: true,
                                        address: true,
                                    },
                                },
                            },
                        },
                    },
                },
                startDate: true,
                endDate: true,
            },
        };
        if (query.status) {
            if (query.status === ContractMemberGetListStatus.ON_DUTY) {
                search.where.endDate['gte'] = new Date();
            } else {
                search.where.endDate['lt'] = new Date();
            }
        }
        const contracts = (await this.prismaService.contract.findMany(search)).map((item) => {
            return {
                companyLogo: {
                    fileName: item.application.post.company.logo.fileName,
                    type: item.application.post.company.logo.type,
                    key: item.application.post.company.logo.key,
                    size: Number(item.application.post.company.logo.size),
                },
                siteName: item.application.post.site.name,
                siteStartDate: item.application.post.site.startDate,
                siteEndDate: item.application.post.site.endDate,
                contractId: item.id,
                startDate: item.startDate,
                endDate: item.endDate,
                postId: item.application.post.id,
                postName: item.application.post.name,
                postEndDate: item.application.post.endDate,
                siteAddress: item.application.post.site.address,
                occupation: item.application.post.code?.name || null,
                isInterested: item.application.post.interests.length === 0 ? false : true,
                status: item.endDate < new Date() ? ContractMemberGetListStatus.END_OF_DUTY : ContractMemberGetListStatus.ON_DUTY,
            };
        });
        const total = await this.prismaService.contract.count({ where: search.where });
        return new PaginationResponse(contracts, new PageInfo(total));
    }

    async getDetail(accountId: number, id: number): Promise<ContractMemberGetDetailResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
                OR: [
                    {
                        application: {
                            member: {
                                accountId,
                            },
                        },
                    },
                    {
                        application: {
                            team: {
                                OR: [
                                    {
                                        leader: {
                                            accountId,
                                        },
                                    },
                                    {
                                        members: {
                                            some: {
                                                member: {
                                                    accountId,
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            select: {
                manager: true,
                contact: true,
                createdAt: true,
                startDate: true,
                endDate: true,
                file: true,
                application: {
                    select: {
                        post: {
                            select: {
                                name: true,
                                site: {
                                    select: {
                                        name: true,
                                        address: true,
                                        startDate: true,
                                        endDate: true,
                                        personInCharge: true,
                                    },
                                },
                                company: {
                                    select: {
                                        logo: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!contract) {
            throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
        }
        return {
            companyLogo: {
                fileName: contract.application.post.company.logo.fileName,
                key: contract.application.post.company.logo.key,
                type: contract.application.post.company.logo.type,
                size: Number(contract.application.post.company.logo.size),
            },
            postName: contract.application.post.name,
            siteName: contract.application.post.site.name,
            siteAddress: contract.application.post.site.address,
            siteStartDate: contract.application.post.site.startDate,
            siteEndDate: contract.application.post.site.endDate,
            file: {
                fileName: contract.file.fileName,
                key: contract.file.key,
                type: contract.file.type,
                size: Number(contract.file.size),
            },
            startDate: contract.startDate,
            endDate: contract.endDate,
            created: contract.createdAt,
            companyName: contract.application.post.company.name,
            personInCharge: contract.application.post.site.personInCharge,
            manager: contract.manager,
            contact: contract.contact,
        };
    }

    async getListSalary(
        accountId: number,
        query: ContractMemberGetListForSalaryRequest,
    ): Promise<ContractMemberGetListForSalaryResponse> {
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                NOT: {
                    labor: null,
                },
                OR: [
                    {
                        application: {
                            member: {
                                accountId,
                            },
                        },
                        startDate: {
                            gte: query.startDate && new Date(query.startDate),
                        },
                        endDate: {
                            lte: query.endDate && new Date(query.endDate),
                        },
                    },
                    {
                        application: {
                            team: {
                                members: {
                                    every: {
                                        member: {
                                            accountId,
                                        },
                                    },
                                },
                            },
                        },
                        startDate: {
                            gte: query.startDate && new Date(query.startDate),
                        },
                        endDate: {
                            lte: query.endDate && new Date(query.endDate),
                        },
                    },
                ],
            },
            select: {
                id: true,
                application: {
                    select: {
                        post: {
                            select: {
                                company: {
                                    select: {
                                        logo: true,
                                        name: true,
                                    },
                                },
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
                labor: {
                    select: {
                        salaryHistories: {
                            select: {
                                actualPayment: true,
                            },
                        },
                        workDates: {
                            select: {
                                hour: true,
                            },
                        },
                    },
                },
                salaryType: true,
            },
        };
        if (query.status) {
            if (query.status === ContractMemberGetListStatus.ON_DUTY) {
                search.where.OR.map((item) => {
                    item.endDate['gte'] = new Date();
                    return item;
                });
            } else {
                search.where.OR.map((item) => {
                    item.endDate['lt'] = new Date();
                    return item;
                });
            }
        }

        const contracts = (await this.prismaService.contract.findMany(search)).map((item) => {
            return {
                id: item.id,
                companyLogo: {
                    fileName: item.application.post.company.logo.fileName,
                    type: item.application.post.company.logo.type,
                    key: item.application.post.company.logo.key,
                    size: Number(item.application.post.company.logo.size),
                },
                companyName: item.application.post.company.name,
                startDate: item.startDate,
                endDate: item.endDate,
                salaryType: item.salaryType,
                amount:
                    item.labor.salaryHistories.length !== 0
                        ? item.labor.salaryHistories.reduce((accum, curent) => {
                              return accum + curent.actualPayment;
                          }, 0)
                        : 0,
                totalDays: item.labor.workDates.length,
                totalHours: item.labor.workDates.reduce((accum, current) => {
                    return accum + current.hour;
                }, 0),
                siteName: item.application.post.site.name,
                status: item.endDate < new Date() ? ContractMemberGetListStatus.END_OF_DUTY : ContractMemberGetListStatus.ON_DUTY,
            };
        });
        const total = await this.prismaService.contract.count({ where: search.where });
        return new PaginationResponse(contracts, new PageInfo(total));
    }

    async getTotal(accountId: number): Promise<number> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

        return await this.prismaService.contract.count({
            where: {
                application: {
                    member: {
                        accountId,
                    },
                },
            },
        });
    }

    async getDetailSalary(accountId: number, id: number): Promise<ContractMemberGetDetailForSalaryResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id,
                OR: [
                    {
                        application: {
                            member: {
                                accountId,
                            },
                        },
                    },
                    {
                        application: {
                            team: {
                                members: {
                                    some: {
                                        member: {
                                            accountId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                startDate: true,
                endDate: true,
                paymentForm: true,
                salaryType: true,
                labor: {
                    select: {
                        workDates: {
                            select: {
                                hour: true,
                            },
                        },
                        salaryHistories: true,
                    },
                },
                application: {
                    select: {
                        post: {
                            select: {
                                company: {
                                    select: {
                                        name: true,
                                        logo: true,
                                    },
                                },
                                site: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        member: {
                            select: {
                                name: true,
                            },
                        },
                        team: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!contract) throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
        return {
            companyName: contract.application.post.company.name,
            siteName: contract.application.post.site.name,
            companyLogo: {
                fileName: contract.application.post.company.logo.fileName,
                type: contract.application.post.company.logo.type,
                key: contract.application.post.company.logo.key,
                size: Number(contract.application.post.company.logo.size),
            },
            name: contract.application.member ? contract.application.member.name : contract.application.team.name,
            paymentForm: contract.paymentForm,
            salaryType: contract.salaryType,
            totalDays: contract.labor.workDates.length,
            totalHours: contract.labor.workDates.reduce((accum, current) => {
                return accum + current.hour;
            }, 0),
            startDate: contract.startDate,
            endDate: contract.endDate,
            salaryHistories: contract.labor.salaryHistories,
        };
    }
}
