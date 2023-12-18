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

                        site: {
                            select: {
                                name: true,
                                contact: true,
                                address: true,
                                personInCharge: true,
                                originalBuilding: true,
                                Company: {
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
                },
            },
        };
        const application = (await this.prismaService.application.findMany(search)).map((item) => {
            return {
                companyLogo: item.post.site.Company.logo.file,
                postId: item.post.id,
                postName: item.post.name,
                postStatus: item.post.status,
                occupationId: item.post.occupation.id,
                occupationName: item.post.occupation.codeName,
                endDate: item.post.endDate,
                status: item.status,
                appliedDate: item.assignedAt,
                siteName: item.post.site.name,
                siteAddress: item.post.site.address,
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
                        status: true,
                        site: {
                            select: {
                                address: true,
                                name: true,
                                startDate: true,
                                endDate: true,
                                Company: {
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
                },
            },
        });
        return {
            companyLogo: application.post.site.Company.logo.file,
            companyName: application.post.site.Company.name,
            companyId: application.post.site.Company.id,
            postId: application.post.id,
            postName: application.post.name,
            postStatus: application.post.status,
            siteAddress: application.post.site.address,
            siteStartDate: application.post.site.startDate,
            siteEndDate: application.post.site.endDate,
            siteName: application.post.site.name,
            postEndDate: application.post.startDate,
            postStartDate: application.post.endDate,
            status: application.status,
            appliedDate: application.assignedAt,
        };
    }
}
