/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, PostType, Prisma } from '@prisma/client';
import { RegionService } from 'domain/region/region.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostMemberGetListPremiumRequest } from './request/post-member-get-list-premium.request';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { PostMemberGetDetailResponse } from './response/post-member-get-detail.response';
import { PostMemberGetListPremiumResponse } from './response/post-member-get-list-premium.response';
import { PostMemberGetListResponse } from './response/post-member-get-list.response';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';

@Injectable()
export class PostMemberService {
    constructor(
        private prismaService: PrismaService,
        private regionService: RegionService,
        private storageService: StorageService,
    ) {}

    protected async parseConditionFromQuery(query: PostMemberGetListRequest, siteId: number): Promise<Prisma.PostWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupationList?.map((item) => parseInt(item));
        const constructionMachineryList = query.constructionMachineryList?.map((item) => parseInt(item));
        const { ids } = await this.regionService.parseFromRegionList(query.regionList);

        return {
            isActive: true,
            AND: [
                {
                    OR: query.keyword && [
                        {
                            name: { contains: query.keyword, mode: 'insensitive' },
                        },
                        {
                            site: {
                                name: { contains: query.keyword, mode: 'insensitive' },
                            },
                        },
                    ],
                },
                {
                    site: {
                        region: {
                            id: { in: ids },
                        },
                    },
                },
            ],
            siteId,
            type: query.postType,
            experienceType: query.experienceTypeList && { in: experienceTypeList },
            OR: [
                { codeId: query.occupationList && { in: occupationList } },
                { codeId: query.constructionMachineryList && { in: constructionMachineryList } },
            ],
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
        };
    }

    async getList(
        accountId: number | undefined,
        query: PostMemberGetListRequest,
        siteId: number,
    ): Promise<PostMemberGetListResponse> {
        if (siteId) {
            const siteExist = await this.prismaService.site.count({
                where: {
                    isActive: true,
                    id: siteId,
                },
            });
            if (!siteExist) throw new NotFoundException('Site does not exist');
        }

        const posts = (
            await this.prismaService.post.findMany({
                select: {
                    id: true,
                    name: true,
                    startWorkDate: true,
                    endWorkDate: true,
                    numberOfPeoples: true,
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
                            region: {
                                select: {
                                    districtEnglishName: true,
                                    districtKoreanName: true,
                                    cityEnglishName: true,
                                    cityKoreanName: true,
                                },
                            },
                        },
                    },
                    interests: {
                        where: {
                            member: {
                                accountId: accountId,
                                isActive: true,
                            },
                        },
                        select: {
                            id: true,
                        },
                        take: 1,
                    },
                },
                where: await this.parseConditionFromQuery(query, siteId),
                orderBy: [
                    {
                        isPulledUp: 'desc',
                    },
                    {
                        createdAt: 'desc',
                    },
                ],
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            const site = item.site;
            const startWorkDate = item.startWorkDate ? item.startWorkDate.toISOString().split('T')[0] : null;
            const endWorkDate = item.endWorkDate ? item.endWorkDate.toISOString().split('T')[0] : null;
            const endDate = item.endDate ? item.endDate.toISOString().split('T')[0] : null;
            const occupation = item.code ? item.code.name : null;
            delete item.site;
            delete item.code;
            delete item.startWorkDate;
            delete item.endWorkDate;
            delete item.endDate;
            return {
                id: item.id,
                name: item.name,
                numberOfPeople: item.numberOfPeoples,
                occupation,
                startWorkDate,
                endWorkDate,
                endDate,
                siteName: site ? site.name : null,
                siteAddress: site ? site.address : null,
                siteAddressCity: site?.region ? site.region.cityEnglishName : null,
                siteAddressDistrict: site?.region ? site.region.districtEnglishName : null,
                isInterested: accountId && item.interests.length > 0 ? true : false,
            };
        });
        const count = await this.prismaService.post.count({
            where: await this.parseConditionFromQuery(query, siteId),
        });
        return new PaginationResponse(posts, new PageInfo(count));
    }

    async getTotal(query: PostMemberGetListRequest, siteId: number): Promise<number> {
        return await this.prismaService.post.count({
            where: await this.parseConditionFromQuery(query, siteId),
        });
    }

    async getDetail(id: number, accountId: number | undefined): Promise<PostMemberGetDetailResponse> {
        const postExist = await this.prismaService.post.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!postExist) throw new NotFoundException('Post does not exist');

        let memberRegisteredCodeIdsList = null;
        if (accountId) {
            const memberLicenseList = await this.prismaService.member.findUnique({
                select: {
                    licenses: {
                        where: {
                            isActive: true,
                        },
                        select: {
                            code: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    accountId,
                },
            });
            memberRegisteredCodeIdsList = [
                ...new Set([
                    ...memberLicenseList.licenses.map((item) => {
                        return item.code.id;
                    }),
                ]),
            ];
        }

        const post = await this.prismaService.post.findUnique({
            include: {
                company: {
                    include: {
                        logo: {
                            select: {
                                key: true,
                                type: true,
                                size: true,
                                fileName: true,
                            },
                        },
                    },
                },
                site: {
                    include: {
                        region: {
                            select: {
                                districtEnglishName: true,
                                districtKoreanName: true,
                                cityEnglishName: true,
                                cityKoreanName: true,
                            },
                        },
                        interests: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                    },
                },
                code: true,
                interests: {
                    where: {
                        member: {
                            accountId,
                            isActive: true,
                        },
                    },
                },
            },
            where: {
                isActive: true,
                id,
            },
        });

        await this.prismaService.post.update({
            where: {
                id,
            },
            data: {
                view: post.view + 1,
            },
        });
        return {
            postInformation: {
                status: post.status,
                name: post.name,
                startDate: post.startDate.toISOString().split('T')[0],
                endDate: post.endDate.toISOString().split('T')[0],
                numberOfPeople: post.numberOfPeoples,
                personInCharge: post.company.presentativeName,
            },
            eligibility: {
                experienceType: post.experienceType,
                codeName: post.code ? post.code.name : null,
                otherInformation: post.otherInformation,
                isEligibleToApply: memberRegisteredCodeIdsList
                    ? !memberRegisteredCodeIdsList.length || memberRegisteredCodeIdsList.includes(post.code?.id)
                        ? true
                        : false
                    : false,
            },
            detail: post.postEditor,
            siteInformation: {
                id: post.siteId,
                companyLogoKey: post.company.logo ? post.company.logo.key : null,
                siteName: post.site ? post.site.name : null,
                siteAddress: post.site ? post.site.address : null,
                startDate: post.site?.startDate ? post.site.startDate.toISOString().split('T')[0] : null,
                endDate: post.site?.endDate ? post.site.endDate.toISOString().split('T')[0] : null,
                originalBuilding: post.site ? post.site.originalBuilding : null,
                longitude: post.site ? post.site.longitude : null,
                latitude: post.site ? post.site.latitude : null,
                originalContractor: post.site ? post.site.contractStatus : null,
                isInterest: post.site && accountId && post.site?.interests.length !== 0 ? true : false,
            },
            isInterest: accountId && post.interests.length !== 0 ? true : false,
        };
    }

    async addApplyPostMember(accountId: number, id: number) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        // Check exist post
        const post = await this.prismaService.post.findUnique({
            where: {
                id,
                isActive: true,
            },
        });
        if (!post) {
            throw new BadRequestException('Post does not exist');
        }

        const application = await this.prismaService.application.findUnique({
            where: {
                memberId_postId: {
                    memberId: account.member.id,
                    postId: post.id,
                },
            },
        });
        if (application) {
            throw new BadRequestException('This job post is already applied');
        }
        await this.prismaService.application.create({
            data: {
                member: { connect: { id: account.member.id } },
                post: { connect: { id: id } },
            },
        });
    }

    async addApplyPostTeam(accountId: number, postId: number, teamId: number) {
        const isTeamLeader = await this.prismaService.team.findUnique({
            where: {
                leader: {
                    accountId,
                },
                id: teamId,
            },
        });
        if (!isTeamLeader) return BaseResponse.error('You are not leader of this team');
        //Check exist post
        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
                isActive: true,
            },
        });

        if (!post) {
            throw new BadRequestException('Post does not exist');
        }

        //Check exist team - post
        const application = await this.prismaService.application.findUnique({
            where: {
                teamId_postId: {
                    teamId: teamId,
                    postId: post.id,
                },
            },
        });
        if (application) {
            throw new BadRequestException('This job post is already applied');
        }

        const newApplication = await this.prismaService.application.create({
            data: {
                team: { connect: { id: teamId } },
                post: { connect: { id: postId } },
            },
        });
        return BaseResponse.of(newApplication);
    }

    async updateInterest(accountId: number, id: number): Promise<PostMemberUpdateInterestResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });

        if (!post) {
            throw new BadRequestException('Post does not exist');
        }

        //Check exist member - post
        //If exist, remove that record
        //Else, add that record
        const application = await this.prismaService.interest.findUnique({
            where: {
                memberId_postId: {
                    memberId: account.member.id,
                    postId: post.id,
                },
            },
        });

        if (application) {
            await this.prismaService.interest.delete({
                where: {
                    memberId_postId: {
                        memberId: account.member.id,
                        postId: post.id,
                    },
                },
            });
            return { isInterested: false };
        } else {
            await this.prismaService.interest.create({
                data: {
                    member: { connect: { id: account.member.id } },
                    post: { connect: { id: post.id } },
                },
            });
            return { isInterested: true };
        }
    }

    async getListPremium(
        accountId: number | undefined,
        query: PostMemberGetListPremiumRequest,
    ): Promise<PostMemberGetListPremiumResponse> {
        const queryFilter: Prisma.PostWhereInput = {
            type: PostType.PREMIUM,
            isHidden: false,
            isActive: true,
        };
        const posts = await Promise.all(
            (
                await this.prismaService.post.findMany({
                    where: queryFilter,
                    select: {
                        company: {
                            select: {
                                logo: {
                                    select: {
                                        fileName: true,
                                        key: true,
                                        size: true,
                                        type: true,
                                    },
                                },
                            },
                        },
                        name: true,
                        endDate: true,
                        id: true,
                        site: {
                            select: {
                                name: true,
                                address: true,
                            },
                        },
                        code: true,
                        interests: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                    },
                    orderBy: [
                        {
                            isPulledUp: Prisma.SortOrder.desc,
                        },
                        {
                            createdAt: Prisma.SortOrder.desc,
                        },
                    ],
                    ...QueryPagingHelper.queryPaging(query),
                })
            ).map(async (item) => {
                return {
                    companyLogo: {
                        fileName: item.company.logo.fileName,
                        type: item.company.logo.type,
                        key: item.company.logo.key,
                        size: Number(item.company.logo.size),
                    },
                    postName: item.name,
                    endDate: item.endDate,
                    id: item.id,
                    siteName: item.site?.name || null,
                    siteAddress: item.site?.address || null,
                    isInterested: accountId ? (item.interests.length === 0 ? false : true) : null,
                    occupationName: item.code?.name || null,
                    urlLogo: await this.storageService.getSignedUrl(item.company.logo.key),
                };
            }),
        );
        const total = await this.prismaService.post.count({ where: queryFilter });
        return new PaginationResponse(posts, new PageInfo(total));
    }
}
