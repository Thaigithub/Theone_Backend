import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborType } from './enum/labor-company-labor-type.enum';
import { LaborCompanyGetListRequest } from './request/labor-company-get-list.request';
import { LaborCompanyGetListResponse } from './response/labor-company-get-list.response';

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
}
