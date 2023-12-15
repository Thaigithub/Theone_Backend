import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@Injectable()
export class ApplicationMemberService {
    constructor(private prismaService: PrismaService) {}
    async getApplicationList(id: number, query: ApplicationMemberGetListRequest): Promise<ApplicationMemberGetListResponse> {
        const search = {
            skip: query.pageNumber && (query.pageNumber - 1) * query.pageSize,
            take: query.pageSize,
            where: {
                member: {
                    account: {
                        id,
                    },
                },
                status: query.status,
            },
            select: {
                id: true,
                status: true,
                assignedAt: true,
                post: {
                    select: {
                        id: true,
                        name: true,
                        endDate: true,
                        status: true,
                        siteName: true,
                        siteAddress: true,
                        occupation: {
                            select: {
                                codeName: true,
                                id: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                fileName: true,
                                                key: true,
                                                type: true,
                                                size: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        const application = (await this.prismaService.application.findMany(search)).map((item) => {
            return {
                companyLogo: item.post.company.logo.file,
                postId: item.post.id,
                postName: item.post.name,
                postStatus: item.post.status,
                // siteId: item.post.site.id,
                siteAddress: item.post.siteAddress,
                siteName: item.post.siteName,
                occupationId: item.post.occupation.id,
                occupationName: item.post.occupation.codeName,
                endDate: item.post.endDate,
                status: item.status,
                appliedDate: item.assignedAt,
            };
        });
        const total = await this.prismaService.application.count({ where: search.where });
        return new PaginationResponse(application, new PageInfo(total));
    }
    async getDetailApplication(id: number, accountId: number): Promise<ApplicationMemberGetDetailResponse> {
        const count = await this.prismaService.application.count({
            where: {
                id,
                member: {
                    accountId,
                },
            },
        });
        if (count === 0) throw new NotFoundException('Application not found');
        const application = await this.prismaService.application.findUnique({
            where: {
                id,
                member: {
                    accountId,
                },
            },
            select: {
                assignedAt: true,
                status: true,
                post: {
                    select: {
                        id: true,
                        name: true,
                        startDate: true,
                        endDate: true,
                        siteAddress: true,
                        siteName: true,
                        status: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                key: true,
                                                fileName: true,
                                                type: true,
                                                size: true,
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
        return {
            companyLogo: application.post.company.logo.file,
            companyName: application.post.company.name,
            companyId: application.post.company.id,
            postId: application.post.id,
            postName: application.post.name,
            postStatus: application.post.status,
            siteAddress: application.post.siteAddress,
            // siteStartDate: application.post.site.startDate,
            // siteEndDate: application.post.site.endDate,
            siteName: application.post.siteName,
            postEndDate: application.post.startDate,
            postStartDate: application.post.endDate,
            status: application.status,
            appliedDate: application.assignedAt,
        };
    }
}
