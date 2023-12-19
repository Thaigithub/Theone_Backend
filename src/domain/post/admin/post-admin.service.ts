import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CodeType, PostType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostAdminPostStatusFilter, PostAdminSearchCategoryFilter } from './dto/post-admin-filter';
import { PostAdminDeleteRequest } from './request/post-admin-delete.request';
import { PostAdminGetListRequest } from './request/post-admin-get-list.request';
import { PostAdminGetListResponse } from './response/post-admin-get-list.response';
import { PostAdminModifyRequest } from './request/post-admin-modify-request';
import { PostAdminDetailResponse } from './response/post-admin-detail.response';

@Injectable()
export class PostAdminService {
    constructor(private prismaService: PrismaService) {}
    async getList(query: PostAdminGetListRequest): Promise<PostAdminGetListResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            ...(query.type && { type: PostType[query.type] }),
            ...(query.status == PostAdminPostStatusFilter.CLOSED && { status: 'DEADLINE' }),
            ...(query.status == PostAdminPostStatusFilter.HIDDEN && { isHidden: true }),
            ...(query.status == PostAdminPostStatusFilter.STOPPED && { isActive: false }),
            ...(!query.searchCategory && query.searchTerm
                ? {
                      OR: [
                          { name: { contains: query.searchTerm, mode: 'insensitive' } },
                          { site: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
                          { site: { personInCharge: { contains: query.searchTerm, mode: 'insensitive' } } },
                          { site: { contact: { contains: query.searchTerm, mode: 'insensitive' } } },
                      ],
                  }
                : {}),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.ANNOUNCEMENT_NAME && {
                name: { contains: query.searchTerm, mode: 'insensitive' },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.SITE_NAME && {
                site: { name: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.REPRESENTATIVE_NAME && {
                site: { personInCharge: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
            ...(query.searchCategory == PostAdminSearchCategoryFilter.SITE_CONTACT_INFO && {
                site: { contact: { contains: query.searchTerm, mode: 'insensitive' } },
            }),
            startDate: { gte: query.startDate ? new Date(query.startDate).toISOString() : undefined },
            endDate: { lte: query.endDate ? new Date(query.endDate).toISOString() : undefined },
        };
        const postList = await this.prismaService.post.findMany({
            select: {
                id: true,
                type: true,
                name: true,
                site: {
                    select: {
                        name: true,
                        contact: true,
                        address: true,
                        originalBuilding: true,
                        personInCharge: true,
                    },
                },
                isHidden: true,
            },
            where: queryFilter,
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const postListCount = await this.prismaService.post.count({
            where: queryFilter,
        });
        return new PaginationResponse(postList, new PageInfo(postListCount));
    }

    async getPostDetails(id: number): Promise<PostAdminDetailResponse> {
        const infor = await this.prismaService.post.findUnique({
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
        if (!infor) {
            throw new NotFoundException(`The Post Id does not exist`);
        }
        return infor;
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

    async changePostInfo(id: number, request: PostAdminModifyRequest) {
        await this.checkCodeType(request.specialNoteId, CodeType.SPECIAL_NOTE);
        await this.checkCodeType(request.occupationId, CodeType.JOB);

        //Modified Time to timestampz
        const FAKE_STAMP = '2023-12-31T';
        request.startWorkTime = request.startWorkTime ? FAKE_STAMP + request.startWorkTime : undefined;
        request.endWorkTime = request.endWorkTime ? FAKE_STAMP + request.endWorkTime : undefined;

        try {
            await this.prismaService.post.update({
                where: {
                    id: id,
                    isActive: true,
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
                    siteId: request.siteId,
                    postEditor: request.postEditor,
                    deleteReason: request.deleteReason,
                },
            });
            const post_record = await this.prismaService.post.findUnique({
                where: {
                    id: id,
                },
            });
            if (post_record.siteId) {
                await this.prismaService.site.update({
                    where: {
                        id: post_record.siteId,
                    },
                    data: {
                        name: request.siteName,
                        address: request.siteAddress,
                        contact: request.siteContact,
                        personInCharge: request.sitePersonInCharge,
                        originalBuilding: request.originalBuilding,
                    },
                });
            }
        } catch (err) {
            throw new HttpException('The Post or Site is not found or has been deleted', HttpStatus.NOT_FOUND);
        }
    }

    async deletePost(id: number, query: PostAdminDeleteRequest) {
        try {
            await this.prismaService.post.update({
                where: {
                    id,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    deleteReason: query.deleteReason,
                },
            });
        } catch (err) {
            throw new HttpException('The Post Id with positive status not found!', HttpStatus.NOT_FOUND);
        }
    }
}
