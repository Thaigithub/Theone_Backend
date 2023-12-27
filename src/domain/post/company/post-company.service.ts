import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeType, PostCategory, PostStatus, PostType, Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyHeadhuntingRequestFilter } from './enum/post-company-headhunting-request-filter.enum';
import { PostCompanyCreateHeadhuntingRequestRequest } from './request/post-company-create-headhunting-request.request';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyHeadhuntingRequestRequest } from './request/post-company-headhunting-request.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetListApplicantsResponse } from './response/post-company-get-list-applicants.response';
import { PostCompanyGetListBySite } from './response/post-company-get-list-by-site.response';
import { PostCompanyGetListHeadhuntingRequestResponse } from './response/post-company-get-list-headhunting-request.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        const account = await this.getRequestAccount(accountId);

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.type && { type: PostType[query.type] }),
            ...(query.status && { status: PostStatus[query.status] }),
            name: { contains: query.name, mode: 'insensitive' },
            companyId: account.company.id,
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

    async create(accountId: number, request: PostCompanyCreateRequest) {
        const account = await this.getRequestAccount(accountId);

        if (request.siteId && !account.company.sites.map((site) => site.id).includes(request.siteId)) {
            throw new BadRequestException('Site does not found');
        }

        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

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
                ...(request.specialNoteId && { specialNoteId: request.specialNoteId }),
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
                workLocation: request.workLocation,
                companyId: account.company.id,
            },
        });
    }

    async getPostDetails(accountId: number, id: number): Promise<PostCompanyDetailResponse> {
        const account = await this.getRequestAccount(accountId);

        return await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
                companyId: account.company.id,
            },
            include: {
                specialNote: {
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

    async changePostInfo(accountId: number, id: number, request: PostCompanyCreateRequest) {
        const account = await this.getRequestAccount(accountId);

        if (request.siteId && !account.company.sites.map((site) => site.id).includes(request.siteId)) {
            throw new BadRequestException('Site does not found');
        }

        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

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
                specialNoteId: request.specialNoteId || null,
                occupationId: request.occupationId || null,
                otherInformation: request.otherInformation,
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: new Date(request.startWorkDate),
                endWorkDate: new Date(request.endWorkDate),
                workday: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                postEditor: request.postEditor,
                workLocation: request.workLocation,
                siteId: request.siteId,
            },
        });
    }

    async deletePost(accountId: number, id: number) {
        const account = await this.getRequestAccount(accountId);

        await this.prismaService.post.update({
            where: {
                id,
                isActive: true,
                companyId: account.company.id,
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

    async getListApplicantSite(
        accountId: number,
        query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<PostCompanyGetListApplicantsResponse> {
        const account = await this.getRequestAccount(accountId);

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            companyId: account.company.id,
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
        accountId: any,
        query: PostCompanyHeadhuntingRequestRequest,
    ): Promise<PostCompanyGetListHeadhuntingRequestResponse> {
        const account = await this.getRequestAccount(accountId);

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            companyId: account.company.id,
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

    async createHeadhuntingRequest(accountId: any, body: PostCompanyCreateHeadhuntingRequestRequest, id: number) {
        const account = await this.getRequestAccount(accountId);

        const post = await this.prismaService.post.findUnique({
            where: {
                id,
                companyId: account.company.id,
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

    async getRequestAccount(accountId: number) {
        return await this.prismaService.account.findUnique({
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
    }
    async getListBySite(accountId: number, siteId: number): Promise<PostCompanyGetListBySite> {
        const posts = (
            await this.prismaService.post.findMany({
                where: {
                    company: {
                        accountId,
                    },
                    siteId,
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
}
