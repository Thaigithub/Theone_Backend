import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostMemberService } from 'domain/post/member/post-member.service';
import { SiteMemberService } from 'domain/site/member/site-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { InterestMemberGetListCategory } from './enum/interest-member-get-filter';
import { InterestMemberDeleteRequest } from './request/interest-member-delete.request';
import { InterestMemberGetListRequest } from './request/interest-member-get-list.request';
import { InterestMemberGetListResponse } from './response/interest-member-get-list.response.ts';
import { Error } from 'utils/error.enum';

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
            ...(query.interestType === InterestMemberGetListCategory.POST && {
                AND: [
                    { NOT: { postId: null } },
                    {
                        post: {
                            isActive: true,
                        },
                    },
                ],
            }),
            ...(query.interestType === InterestMemberGetListCategory.SITE && {
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
                            posts: true,
                            address: true,
                            company: {
                                select: {
                                    logo: {
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
                    post: {
                        select: {
                            id: true,
                            name: true,
                            startDate: true,
                            endDate: true,
                            code: {
                                select: {
                                    name: true,
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
                orderBy: {
                    assignedAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                site:
                    query.interestType === InterestMemberGetListCategory.SITE
                        ? {
                              id: item.site.id,
                              name: item.site.name,
                              address: item.site.address,
                              countPost: item.site.posts.length,
                              logo: item.site?.company?.logo
                                  ? {
                                        fileName: item.site.company.logo.fileName,
                                        key: item.site.company.logo.key,
                                        size: Number(item.site.company.logo.size),
                                        type: item.site.company.logo.type,
                                    }
                                  : null,
                          }
                        : null,
                post:
                    query.interestType === InterestMemberGetListCategory.POST
                        ? {
                              id: item.post.id,
                              name: item.post.name,
                              startDate: item.post.startDate,
                              endDate: item.post.endDate,
                              codeName: item.post?.code ? item.post.code.name : null,
                              siteName: item.post?.site ? item.post.site.name : null,
                              siteAddress: item.post?.site ? item.post.site.address : null,
                              logo: item.post?.company?.logo
                                  ? {
                                        fileName: item.post.company.logo.fileName,
                                        key: item.post.company.logo.key,
                                        size: Number(item.post.company.logo.size),
                                        type: item.post.company.logo.type,
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
            throw new NotFoundException(Error.INTEREST_NOT_FOUND);
        }
        if (body.interestType === InterestMemberGetListCategory.POST) {
            if (interest.postId) {
                await this.postMemberService.updateInterest(accountId, interest.postId);
            } else {
                throw new NotFoundException(Error.POST_INTEREST_NOT_FOUND);
            }
        } else {
            if (interest.siteId) {
                await this.siteMemberService.updateInterest(accountId, interest.siteId);
            } else {
                throw new NotFoundException(Error.SITE_INTEREST_NOT_FOUND);
            }
        }
    }
}
