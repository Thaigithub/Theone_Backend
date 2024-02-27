/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
    HeadhuntingRequestStatus,
    NotificationType,
    PaymentStatus,
    Post,
    PostCategory,
    PostStatus,
    PostType,
    Prisma,
    ProductType,
    RefundStatus
} from '@prisma/client';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
import { ProductCompanyService } from 'domain/product/company/product-company.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyCheckPullUpStatus } from './enum/post-company-check-pull-up-status.enum';
import { PostCompanyGetListHeadhuntingCategory } from './enum/post-company-get-list-headhunting-category.enum';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicationRequest } from './request/post-company-get-list-application.request';
import { PostCompanyGetListHeadhuntingRequest } from './request/post-company-get-list-headhunting.request';
import { PostCompanyGetListSiteRequest } from './request/post-company-get-list-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyUpdatePullUpStatusRequest } from './request/post-company-update-pull-up-status.request';
import { PostCompanyUpdateTypeRequest } from './request/post-company-update-type.request';
import { PostCompanyCheckPullUpAvailabilityResponse } from './response/post-company-check-pull-up-availability.response';
import { PostCompanyCountPostsResponse } from './response/post-company-get-count-post.response';
import { PostCompanyGetDetailResponse } from './response/post-company-get-detail.response';
import { PostCompanyGetListApplicationResponse } from './response/post-company-get-list-application.response';
import { PostCompanyGetListHeadhuntingRequestResponse } from './response/post-company-get-list-headhunting-request.response';
import { PostCompanyGetListSiteResponse } from './response/post-company-get-list-site.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(
        private prismaService: PrismaService,
        private productCompanyService: ProductCompanyService,
        private notificationMemberService: NotificationMemberService
    ) { }

    private async checkPostExist(postId: number, accountId: number): Promise<Post> {
        const post = await this.prismaService.post.findUnique({
            where: {
                isActive: true,
                id: postId,
                company: {
                    accountId,
                },
            },
        });
        if (!post) throw new NotFoundException(Error.POST_NOT_FOUND);

        return post;
    }

    private getStatus(startDate: Date, endDate: Date): PostStatus {
        if (new Date() >= startDate && new Date() <= endDate) return PostStatus.RECRUITING;
        else if (new Date() <= startDate) return PostStatus.PREPARE;
        else if (new Date() >= endDate) return PostStatus.DEADLINE;
    }

    async getList(accountId: number, query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.type && { type: query.type }),
            ...(query.status && { status: query.status }),
            ...(query.category && { category: query.category}),
            name: query.name && { contains: query.name, mode: 'insensitive' },
            company: {
                accountId,
            },
        };

        const postList = (
            await this.prismaService.post.findMany({
                select: {
                    id: true,
                    name: true,
                    site: {
                        select: {
                            name: true,
                        },
                    },
                    startDate: true,
                    endDate: true,
                    view: true,
                    type: true,
                    status: true,
                    applications: true,
                    isPulledUp: true,
                },
                where: queryFilter,
                orderBy: {
                    updatedAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                site: {
                    name: item.site ? item.site.name : '',
                },
                startDate: item.startDate,
                endDate: item.endDate,
                view: item.view,
                type: item.type,
                status: item.status,
                applicants: item.applications,
                isPulledUp: item.isPulledUp,
            };
        });

        const postListCount = await this.prismaService.post.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(postList, new PageInfo(postListCount));
    }

    async count(accountId: number): Promise<PostCompanyCountPostsResponse> {
        const posts = await this.prismaService.post.count({
            // Conditions based on request query
            where: {
                isActive: true,
                company: {
                    accountId: accountId,
                },
            },
        });
        return { countPost: posts };
    }

    async create(accountId: number, request: PostCompanyCreateRequest) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: {
                    include: {
                        sites: {
                            where: {
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });

        if (request.siteId && !account.company.sites.map((site) => site.id).includes(request.siteId)) {
            throw new BadRequestException(Error.SITE_NOT_FOUND);
        }
        if (request.occupationId) {
            await this.checkCodeType(request.occupationId);
        }
        if (request.category === PostCategory.HEADHUNTING) {
            const site = request.siteId ? await this.prismaService.site.findUnique({
                where: {
                    id: request.siteId,
                    isActive: true,
                },
            }) : null;
            if (!site) {
                throw new BadRequestException(Error.SITE_IS_REQURIED_FOR_HEADHUNTING_POST);
            }
        }

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime && FAKE_STAMP + request.startWorkTime + 'Z';
        request.endWorkTime = request.endWorkTime && FAKE_STAMP + request.endWorkTime + 'Z';

        const post = await this.prismaService.post.create({
            data: {
                category: request.category,
                status: this.getStatus(new Date(request.startDate), new Date(request.endDate)),
                name: request.name,
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                experienceType: request.experienceType,
                numberOfPeoples: request.numberOfPeople,
                ...(request.occupationId && { code: { connect: { id: request.occupationId } } }),
                otherInformation: request.otherInformation || '',
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
                endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
                workdays: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor || '',
                site: request.siteId && {
                    connect: {
                        id: request.siteId
                    }
                },
                company: {
                    connect: {
                        id: account.company.id,
                    }
                },
                headhunting:
                    request.category === PostCategory.HEADHUNTING
                        ? {
                            create: {},
                        }
                        : undefined,
            },
            select: {
                id: true,
                siteId: true,
            },
        });
        if (post.siteId) {
            const memberAccountIds = (
                await this.prismaService.site.findUnique({
                    where: {
                        id: request.siteId,
                    },
                    select: {
                        interests: {
                            where: {
                                member: {
                                    isActive: true,
                                },
                            },
                            select: {
                                member: {
                                    select: {
                                        accountId: true,
                                    },
                                },
                            },
                        },
                    },
                })
            ).interests.map((item) => {
                return item.member.accountId;
            });
            for (const id of memberAccountIds) {
                await this.notificationMemberService.create(
                    id,
                    '관심 업체(현장) 공고 등록',
                    '관심 업체(현장)가 공고를 등록했습니다.',
                    NotificationType.POST,
                    post.id,
                );
            }
        }



    }

    async getDetail(accountId: number, id: number): Promise<PostCompanyGetDetailResponse> {
        await this.checkPostExist(id, accountId);

        const record = await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
                company: {
                    accountId,
                },
            },
            include: {
                code: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
                site: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        address: true,
                        personInCharge: true,
                    },
                },
            },
        });

        const post = {
            type: record.type,
            category: record.category,
            status: record.status,
            name: record.name,
            startDate: record.startDate,
            endDate: record.endDate,
            experienceType: record.experienceType,
            numberOfPeople: record.numberOfPeoples,
            occupation: record.code
                ? {
                    codeName: record.code.name,
                    code: record.code.code,
                }
                : null,
            otherInformation: record.otherInformation,
            salaryType: record.salaryType,
            salaryAmount: record.salaryAmount,
            startWorkDate: record.startWorkDate,
            endWorkDate: record.endWorkDate,
            workday: record.workdays,
            startWorkTime: record.startWorkTime,
            endWorkTime: record.endWorkTime,
            site: {
                name: record.site ? record.site.name : null,
                id: record.site ? record.site.id : null,
            },
            postEditor: record.postEditor,
        };

        return post;
    }

    async update(accountId: number, id: number, request: PostCompanyCreateRequest) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: {
                    include: {
                        sites: true,
                    },
                },
            },
        });

        if (request.siteId && !account.company.sites.map((site) => site.id).includes(request.siteId)) {
            throw new BadRequestException(Error.SITE_NOT_FOUND);
        }
        if (request.occupationId) {
            await this.checkCodeType(request.occupationId);
        }

        const post = await this.prismaService.post.findUnique({
            where: {
                id,
                company: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                category: true,
                headhunting: {
                    select: {
                        requests: {
                            where: {
                                status: HeadhuntingRequestStatus.APPROVED,
                            },
                        },
                    },
                },
                siteId: true,
                codeId: true,
                company: {
                    select: {
                        matchingRequests: {
                            where: {
                                recommendations: {
                                    some: {
                                        OR: [
                                            {
                                                team: {
                                                    applications: {
                                                        some: {
                                                            postId: id,
                                                            NOT: {
                                                                contract: null,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                member: {
                                                    applications: {
                                                        some: {
                                                            postId: id,
                                                            NOT: {
                                                                contract: null,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },

                    },
                },
            },
        });
        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime && FAKE_STAMP + request.startWorkTime + 'Z';
        request.endWorkTime = request.endWorkTime && FAKE_STAMP + request.endWorkTime + 'Z';
        if (!post) throw new NotFoundException(Error.POST_NOT_FOUND);
        if (post.category === PostCategory.HEADHUNTING) {
            if (request.category && request.category !== PostCategory.HEADHUNTING) {
                if (post.headhunting.requests.length !== 0)
                    throw new BadRequestException(Error.HEADHUNTING_RECOMMENDATION_EXISTED);
            }
        }
        if (request.category === PostCategory.HEADHUNTING && request.siteId) {
            const site = await this.prismaService.site.findUnique({
                where: {
                    id: request.siteId,
                    isActive: true,
                },
            });
            if (!site) {
                throw new BadRequestException(Error.SITE_IS_REQURIED_FOR_HEADHUNTING_POST);
            }
        }

        if (post.category === PostCategory.MATCHING) {
            if (request.category && request.category !== PostCategory.MATCHING) {
                if (post.company.matchingRequests.length !== 0)
                    throw new BadRequestException(Error.MATCHING_RECOMMENDATION_EXISTED);
            }
        }
        await this.prismaService.post.update({
            where: {
                isActive: true,
                id,
                companyId: account.company.id,
            },
            data: {
                category: request.category,
                status: this.getStatus(new Date(request.startDate), new Date(request.endDate)),
                name: request.name,
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                experienceType: request.experienceType,
                numberOfPeoples: request.numberOfPeople,
                ...(request.occupationId && request.occupationId !== post.codeId && {
                    code: {
                        ...(post.codeId && { disconnect: { id: post.codeId } }),
                    },
                }),
                ...(request.occupationId && {
                    code: {
                        connect: { id: request.occupationId },
                    },
                }),
                ...(request.otherInformation && { otherInformation: request.otherInformation }),
                ...(request.salaryType && { salaryType: request.salaryType }),
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
                endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
                workdays: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor,
                ...(request.siteId && request.siteId !== post.siteId && post.siteId && {
                    site: {
                        disconnect: { id: post.siteId },
                    },
                }),
                ...(request.siteId && {
                    site: {
                        connect: { id: request.siteId },
                    }
                }),
                headhunting:
                    request.category === PostCategory.MATCHING
                        ? post.headhunting
                            ? { update: { isActive: false } }
                            : undefined
                        : request.category === PostCategory.HEADHUNTING
                            ? post.headhunting
                                ? { update: { isActive: true } }
                                : {
                                    create: {},
                                }
                            : post.headhunting
                                ? { update: { isActive: false } }
                                : undefined,
            },
        });
    }

    async delete(accountId: number, id: number) {
        const post = await this.prismaService.post.findUnique({
            where: {
                company: {
                    accountId,
                },
                id,
            },
        });
        if (!post) throw new NotFoundException(Error.POST_NOT_FOUND);
        await this.prismaService.post.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }

    async checkCodeType(id: number) {
        if (id) {
            const code = await this.prismaService.code.findUnique({
                where: {
                    isActive: true,
                    id,
                },
            });

            if (!code) throw new BadRequestException(Error.OCCUPATION_NOT_FOUND);
        }
    }

    async getListApplication(
        accountId: number,
        query: PostCompanyGetListApplicationRequest,
    ): Promise<PostCompanyGetListApplicationResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
            ...(query.type && { type: PostType[query.type] }),
            ...(query.keyword && {
                OR: [
                    { name: { contains: query.keyword, mode: 'insensitive' } },
                    { site: { name: { contains: query.keyword, mode: 'insensitive' } } },
                ],
            }),
        };

        const postLists = await this.prismaService.post.findMany({
            select: {
                id: true,
                name: true,
                site: {
                    select: {
                        name: true,
                    },
                },
                startDate: true,
                endDate: true,
                view: true,
                type: true,
                status: true,
                applications: {
                    select: {
                        team: true,
                        member: true,
                    },
                },
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            ...QueryPagingHelper.queryPaging(query),
        });

        const postListCount = await this.prismaService.post.count({
            // Conditions based on request query
            where: queryFilter,
        });

        const postListsResponse = postLists.map((post) => {
            const { applications, ...rest } = post;
            return {
                ...rest,
                teamCount: applications.filter((item) => item.team != null).length,
                memberCount: applications.filter((item) => item.member != null).length,
            };
        });
        // name: string;
        // type: PostType;
        // status: PostStatus;
        // startDate: Post['startDate'];
        // endDate: Post['endDate'];
        // site: PostCompanyGetItemListSiteResponse;
        // view: number;
        // teamCount: number;
        // memberCount: number;
        return new PaginationResponse(postListsResponse, new PageInfo(postListCount));
    }

    async getListHeadhunting(
        accountId: number,
        query: PostCompanyGetListHeadhuntingRequest,
    ): Promise<PostCompanyGetListHeadhuntingRequestResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
            category: PostCategory.HEADHUNTING,
            ...(query.category === PostCompanyGetListHeadhuntingCategory.SITE_NAME && {
                siteName: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === PostCompanyGetListHeadhuntingCategory.POST_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
            NOT: {
                headhunting: null,
            },
        };

        const postLists = (
            await this.prismaService.post.findMany({
                select: {
                    id: true,
                    name: true,
                    site: {
                        select: {
                            name: true,
                            isActive: true,
                        },
                    },
                    startDate: true,
                    endDate: true,
                    status: true,
                    headhunting: {
                        select: {
                            id: true,
                            requests: {
                                select: {
                                    date: true,
                                    status: true,
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
                            },
                        },
                    },
                },
                where: queryFilter,
                orderBy: {
                    createdAt: 'desc',
                },
                // Pagination
                // If both pageNumber and pageSize is provided then handle the pagination
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                status: item.status,
                startDate: item.startDate,
                endDate: item.endDate,
                site: {
                    name: item.site.name,
                    isActive: item.site.isActive,
                },
                headhuntingRequest:
                    item.headhunting && item.headhunting.requests.length > 0 ? item.headhunting.requests[0] : null,
                headhuntingId: item.headhunting.id,
            };
        });

        const postListCount = await this.prismaService.post.count({
            // Conditions based on request query
            where: queryFilter,
        });

        return new PaginationResponse(postLists, new PageInfo(postListCount));
    }

    async getListSite(accountId: number, siteId: number, query: PostCompanyGetListSiteRequest): Promise<PostCompanyGetListSiteResponse> {
        const posts = (
            await this.prismaService.post.findMany({
                where: {
                    company: {
                        accountId,
                    },
                    siteId,
                    isActive: true,
                    category: query.category
                },
                select: {
                    id: true,
                    name: true,
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
            };
        });
        return new PaginationResponse(posts, new PageInfo(posts.length));
    }

    async checkPullUpAvailability(postId: number, accountId: number): Promise<PostCompanyCheckPullUpAvailabilityResponse> {
        const post = await this.prismaService.post.findUnique({
            where: {
                isActive: true,
                id: postId,
                company: {
                    accountId,
                },
            },
        });
        if (!post) throw new NotFoundException(Error.POST_NOT_FOUND);
        if (post.freePullUp)
            return { pullUpAvailableStatus: PostCompanyCheckPullUpStatus.FREE_PULL_UP_AVAILABLE, remainingTimes: null };
        else {
            const availablePullUp = await this.prismaService.productPaymentHistory.aggregate({
                _sum: {
                    remainingTimes: true,
                },
                where: {
                    isActive: true,
                    status: PaymentStatus.COMPLETE,
                    company: {
                        accountId,
                    },
                    product: {
                        productType: ProductType.PULL_UP,
                    },
                    remainingTimes: { gt: 0 },
                },
            });

            return availablePullUp._sum.remainingTimes
                ? {
                    pullUpAvailableStatus: PostCompanyCheckPullUpStatus.PRODUCT_PULL_UP_AVAILABLE,
                    remainingTimes: availablePullUp._sum.remainingTimes,
                }
                : { pullUpAvailableStatus: PostCompanyCheckPullUpStatus.PULL_UP_NOT_AVAILABLE, remainingTimes: null };
        }
    }

    async updatePullUpStatus(postId: number, accountId: number, body: PostCompanyUpdatePullUpStatusRequest): Promise<void> {
        const post = await this.checkPostExist(postId, accountId);
        if (post.isPulledUp) throw new BadRequestException(Error.POST_HAS_BEEN_PULLED_UP);
        const availablePullUp = await this.checkPullUpAvailability(postId, accountId);
        const now = new Date();
        if (availablePullUp.pullUpAvailableStatus !== PostCompanyCheckPullUpStatus.PULL_UP_NOT_AVAILABLE) {
            if (post.freePullUp) {
                await this.prismaService.post.update({
                    data: {
                        freePullUp: false,
                        nextFreePulledUpTime: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
                    },
                    where: {
                        isActive: true,
                        id: postId,
                        company: {
                            accountId,
                        },
                    },
                });
            } else {
                const earliestPullUpProduct = await this.prismaService.productPaymentHistory.findFirst({
                    where: {
                        isActive: true,
                        product: {
                            productType: ProductType.PULL_UP,
                        },
                        status: PaymentStatus.COMPLETE,

                        expirationDate: { gte: new Date() },
                        remainingTimes: { gt: 0 },
                        OR: [{ refund: null }, { refund: { NOT: { status: RefundStatus.APPROVED } } }],
                        company: {
                            accountId,
                        },
                    },
                    orderBy: [
                        {
                            expirationDate: Prisma.SortOrder.asc,
                        },
                        {
                            remainingTimes: Prisma.SortOrder.asc,
                        },
                    ],
                });
                if (availablePullUp.pullUpAvailableStatus === PostCompanyCheckPullUpStatus.PRODUCT_PULL_UP_AVAILABLE) {
                    await this.prismaService.productPaymentHistory.update({
                        data: {
                            remainingTimes: earliestPullUpProduct.remainingTimes - 1,
                        },
                        where: {
                            isActive: true,
                            id: earliestPullUpProduct.id,
                        },
                    });
                }
            }
        } else throw new BadRequestException(Error.PRODUCT_NOT_FOUND);

        await this.prismaService.post.update({
            data: {
                isPulledUp: body.pullUpStatus,
                pullUpExpirationTime: new Date(now.getTime() + 1000 * 60 * 60 * 24),
            },
            where: {
                isActive: true,
                id: postId,
                company: {
                    accountId,
                },
            },
        });
    }

    async updateType(postId: number, accountId: number, body: PostCompanyUpdateTypeRequest): Promise<void> {
        const post = await this.checkPostExist(postId, accountId);
        const availablePremium = await this.productCompanyService.checkAvailability(accountId, {productType: ProductType.PREMIUM_POST});

        if (availablePremium.isAvailable) {
            const productPaymentHistory = await this.prismaService.productPaymentHistory.findUnique({
                where: {
                    isActive: true,
                    id: body.productPaymentHistoryId,
                    product: {
                        productType: ProductType.PREMIUM_POST,
                    },
                    expirationDate: { gte: new Date() },
                    remainingTimes: { gt: 0 },
                },
            });
            if (!productPaymentHistory)
                throw new NotFoundException(Error.PRODUCT_NOT_FOUND);

            await this.prismaService.productPaymentHistory.update({
                data: {
                    remainingTimes: productPaymentHistory.remainingTimes - 1,
                },
                where: {
                    isActive: true,
                    id: productPaymentHistory.id,
                },
            });
        } else throw new BadRequestException(Error.PRODUCT_NOT_FOUND);

        if (post.type === PostType.PREMIUM) throw new BadRequestException(Error.POST_HAS_BEEN_PREMIUM);

        const now = new Date();
        await this.prismaService.post.update({
            data: {
                type: body.postType,
                premiumExpirationTime: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7 * 2),
            },
            where: {
                isActive: true,
                id: postId,
                company: {
                    accountId,
                },
            },
        });
    }
}
