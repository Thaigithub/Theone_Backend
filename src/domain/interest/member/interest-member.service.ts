import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostMemberService } from 'domain/post/member/post-member.service';
import { SiteMemberService } from 'domain/site/member/site-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterestMemberGetFilter } from './dto/interest-member-get-filter';
import { InterestMemberDeleteRequest } from './request/interest-member-delete.request';
import { InterestMemberGetListRequest } from './request/interest-member-get-list.request';
import { InterestMemberGetListResponse } from './response/interest-member-get-list.response.ts';

@Injectable()
export class InterestMemberService {
    constructor(
        private prismaService: PrismaService,
        private postMemberService: PostMemberService,
        private siteMemberService: SiteMemberService,
    ) {}

    async getList(accountId: number, query: InterestMemberGetListRequest): Promise<InterestMemberGetListResponse> {
        const queryFilter: Prisma.InterestWhereInput = {
            member: {
                accountId: accountId,
                isActive: true,
            },
            ...(query.interestType === InterestMemberGetFilter.POST && {
                AND: [
                    { NOT: { postId: null } },
                    {
                        post: {
                            isActive: true,
                        },
                    },
                ],
            }),
            ...(query.interestType === InterestMemberGetFilter.SITE && {
                AND: [
                    { NOT: { siteId: null } },
                    {
                        site: {
                            isActive: true,
                        },
                    },
                ],
            }),
        };
        const interests = (
            await this.prismaService.interest.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    site: {
                        select: {
                            id: true,
                            name: true,
                            post: true,
                            address: true,
                            company: {
                                select: {
                                    logo: {
                                        select: {
                                            file: {
                                                select: {
                                                    key: true,
                                                    fileName: true,
                                                    size: true,
                                                    type: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            name: true,
                            startDate: true,
                            endDate: true,
                            occupation: {
                                select: {
                                    codeName: true,
                                },
                            },
                            site: {
                                select: {
                                    name: true,
                                    address: true,
                                },
                            },
                            company: {
                                select: {
                                    logo: {
                                        select: {
                                            file: {
                                                select: {
                                                    key: true,
                                                    fileName: true,
                                                    size: true,
                                                    type: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    assignedAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                site:
                    query.interestType === InterestMemberGetFilter.SITE
                        ? {
                              id: item.site.id,
                              name: item.site.name,
                              address: item.site.address,
                              countPost: item.site.post.length,
                              logo: item.site?.company?.logo
                                  ? {
                                        fileName: item.site.company.logo.file.fileName,
                                        key: item.site.company.logo.file.key,
                                        size: Number(item.site.company.logo.file.size),
                                        type: item.site.company.logo.file.type,
                                    }
                                  : null,
                          }
                        : null,
                post:
                    query.interestType === InterestMemberGetFilter.POST
                        ? {
                              id: item.post.id,
                              name: item.post.name,
                              startDate: item.post.startDate,
                              endDate: item.post.endDate,
                              codeName: item.post?.occupation ? item.post.occupation.codeName : null,
                              siteName: item.post?.site ? item.post.site.name : null,
                              siteAddress: item.post?.site ? item.post.site.address : null,
                              logo: item.post?.company?.logo
                                  ? {
                                        fileName: item.post.company.logo.file.fileName,
                                        key: item.post.company.logo.file.key,
                                        size: Number(item.post.company.logo.file.size),
                                        type: item.post.company.logo.file.type,
                                    }
                                  : null,
                          }
                        : null,
            };
        });
        const countInterests = await this.prismaService.interest.count({
            where: queryFilter,
        });
        return new PaginationResponse(interests, new PageInfo(countInterests));
    }

    async delete(accountId: number, id: number, body: InterestMemberDeleteRequest): Promise<void> {
        const interest = await this.prismaService.interest.findUnique({
            where: {
                id: id,
                member: {
                    accountId: accountId,
                    isActive: true,
                },
            },
            select: {
                siteId: true,
                postId: true,
            },
        });
        if (!interest) {
            throw new NotFoundException('The interest is not exist');
        }
        if (body.interestType === InterestMemberGetFilter.POST) {
            if (interest.postId) {
                await this.postMemberService.updateInterestPost(accountId, interest.postId);
            } else {
                throw new NotFoundException('The Post of interest is not exist');
            }
        } else {
            if (interest.siteId) {
                await this.siteMemberService.updateInterestSite(accountId, interest.siteId);
            } else {
                throw new NotFoundException('The Site of interest is not exist');
            }
        }
    }
}
