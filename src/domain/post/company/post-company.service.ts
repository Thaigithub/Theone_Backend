import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CodeType, Post, PostCategory, PostType, Prisma, ProductType, RequestStatus } from '@prisma/client';
import { ProductCompanyService } from 'domain/product/company/product-company.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyCheckPullUpStatus } from './enum/post-company-check-pull-up-status.enum';
import { PostCompanyHeadhuntingRequestFilter } from './enum/post-company-headhunting-request-filter.enum';
import { PostCompanyCreateHeadhuntingRequestRequest } from './request/post-company-create-headhunting-request.request';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyHeadhuntingRequestRequest } from './request/post-company-headhunting-request.request';
import { PostCompanyUpdatePullUpStatusRequest } from './request/post-company-update-pull-up-status.request';
import { PostCompanyUpdateTypeRequest } from './request/post-company-update-type.request';
import { PostCompanyCheckPullUpAvailabilityResponse } from './response/post-company-check-pull-up-availability.response';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyCountPostsResponse } from './response/post-company-get-count-post.response';
import { PostCompanyGetListApplicantsResponse } from './response/post-company-get-list-applicants.response';
import { PostCompanyGetListBySite } from './response/post-company-get-list-by-site.response';
import { PostCompanyGetListHeadhuntingRequestResponse } from './response/post-company-get-list-headhunting-request.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly productCompanyService: ProductCompanyService,
    ) {}

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
        if (!post) throw new NotFoundException('Post does not exist');

        return post;
    }

    async getList(accountId: number, query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.type && { type: query.type }),
            ...(query.status && { status: query.status }),
            name: query.name && { contains: query.name, mode: 'insensitive' },
            company: {
                accountId,
            },
        };

        const postList = await this.prismaService.post.findMany({
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
                applicants: true,
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
                        sites: true,
                    },
                },
            },
        });

        if (request.siteId && !account.company.sites.map((site) => site.id).includes(request.siteId)) {
            throw new BadRequestException('Site does not found');
        }

        await this.checkCodeType(request.specialOccupationId, CodeType.SPECIAL);
        await this.checkCodeType(request.occupationId, CodeType.GENERAL);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime && FAKE_STAMP + request.startWorkTime + 'Z';
        request.endWorkTime = request.endWorkTime && FAKE_STAMP + request.endWorkTime + 'Z';

        await this.prismaService.post.create({
            data: {
                type: request.type,
                category: request.category,
                status: request.status,
                name: request.name,
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                experienceType: request.experienceType,
                numberOfPeople: request.numberOfPeople,
                ...(request.specialOccupationId && { specialOccupationId: request.specialOccupationId }),
                ...(request.occupationId && { occupationId: request.occupationId }),
                otherInformation: request.otherInformation || '',
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
                endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
                workday: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor || '',
                siteId: request.siteId || null,
                companyId: account.company.id,
            },
        });
    }

    async getDetail(accountId: number, id: number): Promise<PostCompanyDetailResponse> {
        await this.checkPostExist(id, accountId);

        return await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
                company: {
                    accountId,
                },
            },
            include: {
                specialOccupation: {
                    select: {
                        code: true,
                        codeName: true,
                        codeType: true,
                    },
                },
                occupation: {
                    select: {
                        code: true,
                        codeName: true,
                        codeType: true,
                    },
                },
                site: {
                    select: {
                        name: true,
                        contact: true,
                        address: true,
                        originalBuilding: true,
                        personInCharge: true,
                    },
                },
            },
        });
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
            throw new BadRequestException('Site does not found');
        }

        await this.checkCodeType(request.specialOccupationId, CodeType.SPECIAL);
        await this.checkCodeType(request.occupationId, CodeType.GENERAL);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime && FAKE_STAMP + request.startWorkTime + 'Z';
        request.endWorkTime = request.endWorkTime && FAKE_STAMP + request.endWorkTime + 'Z';

        await this.prismaService.post.update({
            where: {
                isActive: true,
                id,
                companyId: account.company.id,
            },
            data: {
                type: request.type,
                category: request.category,
                status: request.status,
                name: request.name,
                startDate: new Date(request.startDate),
                endDate: new Date(request.endDate),
                experienceType: request.experienceType,
                numberOfPeople: request.numberOfPeople,
                specialOccupationId: request.specialOccupationId || null,
                occupationId: request.occupationId || null,
                otherInformation: request.otherInformation,
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate && new Date(request.startWorkDate),
                endWorkDate: request.endWorkDate && new Date(request.endWorkDate),
                workday: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor,
                siteId: request.siteId,
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
        if (!post) throw new NotFoundException('Post not found');
        await this.prismaService.post.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }

    async checkCodeType(id: number, codeType: CodeType) {
        if (id) {
            const code = await this.prismaService.code.findUnique({
                where: {
                    isActive: true,
                    id,
                    codeType: codeType,
                },
            });

            if (!code) throw new BadRequestException(`Code ID of type ${codeType} does not exist`);
        }
    }

    async getListApplicant(
        accountId: number,
        query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<PostCompanyGetListApplicantsResponse> {
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
                applicants: {
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
            const { applicants, ...rest } = post;
            return {
                ...rest,
                teamCount: applicants.filter((item) => item.team != null).length,
                memberCount: applicants.filter((item) => item.member != null).length,
            };
        });

        return new PaginationResponse(postListsResponse, new PageInfo(postListCount));
    }

    async getListHeadhuntingRequest(
        accountId: number,
        query: PostCompanyHeadhuntingRequestRequest,
    ): Promise<PostCompanyGetListHeadhuntingRequestResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            company: {
                accountId,
            },
            category: PostCategory.HEADHUNTING,
            ...(query.category === PostCompanyHeadhuntingRequestFilter.SITE_NAME && {
                siteName: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === PostCompanyHeadhuntingRequestFilter.POST_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
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
                status: true,
                headhuntingRequest: {
                    select: {
                        date: true,
                        status: true,
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

        return new PaginationResponse(postLists, new PageInfo(postListCount));
    }

    async createHeadhuntingRequest(accountId: number, body: PostCompanyCreateHeadhuntingRequestRequest, id: number) {
        const post = await this.prismaService.post.findUnique({
            where: {
                id,
                company: {
                    accountId,
                },
                category: PostCategory.HEADHUNTING,
            },
        });

        if (!post) {
            throw new BadRequestException('No Headhunting Post found');
        }

        const existRequest = await this.prismaService.headhuntingRequest.findUnique({
            where: {
                postId: id,
                isActive: true,
            },
        });

        if (!existRequest) {
            await this.prismaService.headhuntingRequest.create({
                data: {
                    detail: body.detail,
                    object: body.object,
                    status: RequestStatus.APPLY,
                    postId: id,
                },
            });
        } else {
            if (existRequest.status === RequestStatus.APPLY) {
                throw new BadRequestException('Headhunting request is already applied');
            }

            await this.prismaService.headhuntingRequest.update({
                where: {
                    postId: id,
                    object: body.object,
                    isActive: true,
                },
                data: {
                    detail: body.detail,
                    object: body.object,
                    status: RequestStatus.RE_APPLY,
                },
            });
        }
    }

    async getListSite(accountId: number, siteId: number): Promise<PostCompanyGetListBySite> {
        const posts = (
            await this.prismaService.post.findMany({
                where: {
                    company: {
                        accountId,
                    },
                    siteId,
                    isActive: true,
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
        if (!post) throw new NotFoundException('Post does not exist');
        if (post.freePullUp)
            return { pullUpAvailableStatus: PostCompanyCheckPullUpStatus.FREE_PULL_UP_AVAILABLE, remainingTimes: null };
        else {
            const availablePullUp = await this.prismaService.productPaymentHistory.aggregate({
                _sum: {
                    remainingTimes: true,
                },
                where: {
                    isActive: true,
                    company: {
                        accountId,
                    },
                    product: {
                        productType: ProductType.PULL_UP,
                    },
                    remainingTimes: { gt: 0 },
                },
            });

            return availablePullUp
                ? {
                      pullUpAvailableStatus: PostCompanyCheckPullUpStatus.PRODUCT_PULL_UP_AVAILABLE,
                      remainingTimes: availablePullUp._sum.remainingTimes,
                  }
                : { pullUpAvailableStatus: PostCompanyCheckPullUpStatus.PULL_UP_NOT_AVAILABLE, remainingTimes: null };
        }
    }

    async updatePullUpStatus(postId: number, accountId: number, body: PostCompanyUpdatePullUpStatusRequest): Promise<void> {
        const post = await this.checkPostExist(postId, accountId);
        const availablePullUp = await this.checkPullUpAvailability(postId, accountId);

        if (availablePullUp.pullUpAvailableStatus !== PostCompanyCheckPullUpStatus.PULL_UP_NOT_AVAILABLE) {
            if (post.freePullUp) {
                await this.prismaService.post.update({
                    data: {
                        freePullUp: false,
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
                        expirationDate: { gte: new Date() },
                        remainingTimes: { gt: 0 },
                    },
                    orderBy: {
                        expirationDate: 'asc',
                    },
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
        } else throw new BadRequestException("You don't have free pull up or any PULL_UP produdct");
        await this.prismaService.post.update({
            data: {
                isPulledUp: body.pullUpStatus,
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
        await this.checkPostExist(postId, accountId);
        const availablePremium = await this.productCompanyService.checkPremiumAvailability(accountId);

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
                throw new NotFoundException(`Can not find PREMIUM product with id ${body.productPaymentHistoryId}`);

            await this.prismaService.productPaymentHistory.update({
                data: {
                    remainingTimes: productPaymentHistory.remainingTimes - 1,
                },
                where: {
                    isActive: true,
                    id: productPaymentHistory.id,
                },
            });
        } else throw new BadRequestException("You don't have any PREMIUM_POST produdct");

        await this.prismaService.post.update({
            data: {
                type: body.postType,
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
