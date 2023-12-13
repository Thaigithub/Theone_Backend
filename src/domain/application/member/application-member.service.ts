import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
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
                        occupation: {
                            select: {
                                codeName: true,
                                id: true,
                            },
                        },
                        site: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
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
                siteId: item.post.site.id,
                siteAddress: item.post.site.address,
                siteName: item.post.site.name,
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
}
