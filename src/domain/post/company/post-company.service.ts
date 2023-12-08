import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeType, PostStatus, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PostCompanyPostStatusFilter, PostCompanyPostTypeFilter } from './dto/post-company-filter';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Injectable()
export class PostCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PostCompanyGetListRequest): Promise<PostCompanyGetListResponse> {
        //TODO: Get list posts
        return {} as PostCompanyGetListResponse;
    }

    private parseConditionsFromQuery(query: PostCompanyGetListRequest): Prisma.PostWhereInput {
        return {
            isActive: true,
            ...(query.type !== PostCompanyPostTypeFilter.ALL && { type: PostType[query.type] }),
            ...(query.status !== PostCompanyPostStatusFilter.ALL && { status: PostStatus[query.status] }),
            name: { contains: query.name, mode: 'insensitive' },
        };
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

        if (request.specialNoteId) {
            const currentSpecialNote = await this.prismaService.code.findUnique({
                where: {
                    id: request.specialNoteId,
                    isActive: true,
                    codeType: CodeType.SPECIAL_NOTE,
                },
            });

            if (!currentSpecialNote) {
                throw new BadRequestException('Special note ID does not exist.');
            }
        }

        if (request.occupationId) {
            const currentOccupation = await this.prismaService.code.findUnique({
                where: {
                    id: request.occupationId,
                    isActive: true,
                    codeType: CodeType.JOB,
                },
            });

            if (!currentOccupation) {
                throw new BadRequestException('Occupation ID does not exist.');
            }
        }

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

    async changePostInfo(id: number, payload: PostCompanyCreateRequest) {
        //TODO: Update a Post
        return {} as PostCompanyCreateRequest;
    }

    async deletePost(id: number) {
        //TODO: Soft Delete a Post
    }
}
