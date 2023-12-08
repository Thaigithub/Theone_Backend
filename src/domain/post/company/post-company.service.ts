import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeType, PostStatus, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostCompanyPostStatusFilter, PostCompanyPostTypeFilter } from './dto/post-company-filter';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            isActive: true,
            ...(query.type !== PostCompanyPostTypeFilter.ALL && { type: PostType[query.type] }),
            ...(query.status !== PostCompanyPostStatusFilter.ALL && { status: PostStatus[query.status] }),
            name: { contains: query.name, mode: 'insensitive' },
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

        return new PostCompanyGetListResponse(postList, postListCount);
    }

    async create(request: PostCompanyCreateRequest) {
        //TODO: Checking site belong to company

        const currentSite = await this.prismaService.site.findUnique({
            where: {
                id: request.siteId,
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

    async getPostDetails(id: number): Promise<PostCompanyDetailResponse> {
        return await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
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

    async changePostInfo(id: number, request: PostCompanyCreateRequest) {
        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = FAKE_STAMP + request.startWorkTime;
        request.endWorkTime = FAKE_STAMP + request.endWorkTime;

        console.log('HELLO', request);

        await this.prismaService.post.update({
            where: {
                isActive: true,
                id,
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

    async deletePost(id: number) {
        //TODO: Soft Delete a Post
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
}
