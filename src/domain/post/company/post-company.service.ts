import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeType, PostStatus, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyPostCategoryFilter } from './dto/post-company-filter';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.type && { type: PostType[query.type] }),
            ...(query.status && { status: PostStatus[query.status] }),
            name: { contains: query.name, mode: 'insensitive' },
            site: {
                companyId: account.company.id,
            },
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
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        // Check Site is belong to current company
        const currentSite = await this.prismaService.site.findUnique({
            where: {
                id: request.siteId,
                companyId: account.company.id,
                isActive: true,
            },
        });

        if (!currentSite) {
            throw new BadRequestException('Site ID does not exist.');
        }

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
                siteId: request.siteId,
                postEditor: request.postEditor || '',
            },
        });
    }

    async getPostDetails(accountId: number, id: number): Promise<PostCompanyDetailResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        return await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
                site: {
                    companyId: account.company.id,
                },
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
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

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
                site: {
                    companyId: account.company.id,
                },
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
                siteId: request.siteId,
                postEditor: request.postEditor,
            },
        });
    }

    async deletePost(accountId: number, id: number) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        await this.prismaService.post.update({
            where: {
                id,
                isActive: true,
                site: {
                    companyId: account.company.id,
                },
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
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            site: {
                companyId: account.company.id,
            },
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
}
