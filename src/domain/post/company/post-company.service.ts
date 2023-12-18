import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeType, PostCategory, PostStatus, PostType, Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyPostCategoryFilter } from './enum/post-company-filter.enum';
import { PostCompanyHeadhuntingRequestFilter } from './enum/post-company-headhunting-request-filter.enum';
import { PostCompanyCreateHeadhuntingRequestRequest } from './request/post-company-create-headhunting-request.request';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyHeadhuntingRequestRequest } from './request/post-company-headhunting-request.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
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
                siteName: true,
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

        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = FAKE_STAMP + request.startWorkTime;
        request.endWorkTime = FAKE_STAMP + request.endWorkTime;

        await this.prismaService.post.create({
            data: {
                type: request.type,
                category: request.category,
                status: request.status,
                name: request.name,
                startDate: request.startDate,
                endDate: request.endDate,
                experienceType: request.experienceType,
                numberOfPeople: request.numberOfPeople,
                ...(request.specialNoteId && { specialNoteId: request.specialNoteId }),
                ...(request.occupationId && { occupationId: request.occupationId }),
                otherInformation: request.otherInformation || '',
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate,
                endWorkDate: request.endWorkDate,
                workday: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                siteName: request.siteName || '',
                siteContact: request.siteContact || '',
                sitePersonInCharge: request.sitePersonInCharge || '',
                originalBuilding: request.originalBuilding || '',
                siteAddress: request.siteAddress || '',
                postEditor: request.postEditor || '',
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
            },
        });
    }

    async changePostInfo(accountId: number, id: number, request: PostCompanyCreateRequest) {
        const account = await this.getRequestAccount(accountId);

        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = FAKE_STAMP + request.startWorkTime;
        request.endWorkTime = FAKE_STAMP + request.endWorkTime;

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
                startDate: request.startDate,
                endDate: request.endDate,
                experienceType: request.experienceType,
                numberOfPeople: request.numberOfPeople,
                specialNoteId: request.specialNoteId || null,
                occupationId: request.occupationId || null,
                otherInformation: request.otherInformation,
                salaryType: request.salaryType,
                salaryAmount: request.salaryAmount,
                startWorkDate: request.startWorkDate,
                endWorkDate: request.endWorkDate,
                workday: request.workday,
                startWorkTime: request.startWorkTime,
                endWorkTime: request.endWorkTime,
                siteName: request.siteName,
                siteContact: request.siteContact,
                sitePersonInCharge: request.sitePersonInCharge,
                originalBuilding: request.originalBuilding,
                siteAddress: request.siteAddress,
                postEditor: request.postEditor,
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
    ): Promise<PostCompanyGetListResponse> {
        const account = await this.getRequestAccount(accountId);

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            companyId: account.company.id,
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
            ...(query.type && { type: PostType[query.type] }),
            ...(query.category === PostCompanyPostCategoryFilter.POST_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
            ...(query.category === PostCompanyPostCategoryFilter.SITE_NAME && {
                siteName: { contains: query.keyword, mode: 'insensitive' },
            }),
        };

        const postLists = await this.prismaService.post.findMany({
            select: {
                id: true,
                name: true,
                siteName: true,
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

        return new PaginationResponse(postLists, new PageInfo(postListCount));
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
                siteName: true,
                startDate: true,
                endDate: true,
                status: true,
                HeadhuntingRequest: {
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

    async createHeadhuntingRequest(accountId: any, body: PostCompanyCreateHeadhuntingRequestRequest) {
        const account = await this.getRequestAccount(accountId);

        const post = await this.prismaService.post.findUnique({
            where: {
                id: body.postId,
                companyId: account.company.id,
                category: PostCategory.HEADHUNTING,
            },
        });

        if (!post) {
            throw new BadRequestException('No Headhunting Post found');
        }

        await this.prismaService.headhuntingRequest.create({
            data: {
                detail: body.detail,
                object: body.object,
                status: RequestStatus.WAITING_FOR_APPROVAL,
                postId: body.postId,
            },
        });
    }

    async getRequestAccount(accountId: number) {
        return await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });
    }
}
