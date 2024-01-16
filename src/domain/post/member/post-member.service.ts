import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, PostType, Prisma } from '@prisma/client';
import { RegionService } from 'domain/region/region.service';
import { PrismaService } from 'services/prisma/prisma.service';
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
        private readonly prismaService: PrismaService,
        private readonly regionService: RegionService,
    ) {}

    protected async parseConditionFromQuery(query: PostMemberGetListRequest, siteId: number): Promise<Prisma.PostWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupationList?.map((item) => parseInt(item));
        const constructionMachineryList = query.constructionMachineryList?.map((item) => parseInt(item));
        const { districtsList, citiesList } = await this.regionService.parseFromRegionList(query.regionList);

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
                    OR: [
                        districtsList.length
                            ? {
                                  site: {
                                      district: { id: { in: districtsList } },
                                  },
                              }
                            : {},
                        citiesList.length
                            ? {
                                  site: {
                                      district: { cityId: { in: citiesList } },
                                  },
                              }
                            : {},
                    ],
                },
            ],
            siteId,
            type: query.postType,
            experienceType: query.experienceTypeList && { in: experienceTypeList },
            occupationId: query.occupationList && { in: occupationList },
            specialOccupationId: query.constructionMachineryList && { in: constructionMachineryList },
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
                    numberOfPeople: true,
                    endDate: true,
                    occupation: {
                        select: {
                            codeName: true,
                        },
                    },
                    site: {
                        select: {
                            name: true,
                            address: true,
                            district: {
                                select: {
                                    englishName: true,
                                    city: {
                                        select: {
                                            englishName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    interested: {
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
                orderBy: {
                    createdAt: 'desc',
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            const site = item.site;
            const startWorkDate = item.startWorkDate ? item.startWorkDate.toISOString().split('T')[0] : null;
            const endWorkDate = item.endWorkDate ? item.endWorkDate.toISOString().split('T')[0] : null;
            const endDate = item.endDate ? item.endDate.toISOString().split('T')[0] : null;
            const occupation = item.occupation ? item.occupation.codeName : null;
            delete item.site;
            delete item.occupation;
            delete item.startWorkDate;
            delete item.endWorkDate;
            delete item.endDate;
            return {
                id: item.id,
                name: item.name,
                numberOfPeople: item.numberOfPeople,
                occupation,
                startWorkDate,
                endWorkDate,
                endDate,
                siteName: site ? site.name : null,
                siteAddress: site ? site.address : null,
                siteAddressCity: site?.district ? site.district.city.englishName : null,
                siteAddressDistrict: site?.district ? site.district.englishName : null,
                isInterested: accountId && item.interested.length > 0 ? true : false,
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
            const memberSpecialLicenseList = await this.prismaService.member.findUnique({
                select: {
                    specialLicenses: {
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
                    ...memberSpecialLicenseList.specialLicenses.map((item) => {
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
                            include: {
                                file: true,
                            },
                        },
                    },
                },
                site: {
                    include: {
                        district: {
                            include: {
                                city: true,
                            },
                        },
                        interestMember: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                    },
                },
                occupation: true,
                specialOccupation: true,
                interested: {
                    where: {
                        NOT: { member: null },
                        member: {
                            accountId: accountId,
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

        return {
            postInformation: {
                name: post.name,
                startDate: post.startDate.toISOString().split('T')[0],
                endDate: post.endDate.toISOString().split('T')[0],
                numberOfPeople: post.numberOfPeople,
                personInCharge: post.company.presentativeName,
            },
            eligibility: {
                experienceType: post.experienceType,
                occupation: post.occupation ? post.occupation.codeName : null,
                specialNote: post.specialOccupation ? post.specialOccupation.codeName : null,
                otherInformation: post.otherInformation,
                isEligibleToApply: memberRegisteredCodeIdsList
                    ? !memberRegisteredCodeIdsList.length || memberRegisteredCodeIdsList.includes(post.specialOccupation?.id)
                        ? true
                        : false
                    : false,
            },
            detail: post.postEditor,
            siteInformation: {
                id: post.siteId,
                companyLogoKey: post.company.logo?.file ? post.company.logo.file.key : null,
                siteName: post.site ? post.site.name : null,
                siteAddress: post.site ? post.site.address : null,
                startDate: post.site?.startDate ? post.site.startDate.toISOString().split('T')[0] : null,
                endDate: post.site?.endDate ? post.site.endDate.toISOString().split('T')[0] : null,
                originalBuilding: post.site ? post.site.originalBuilding : null,
                originalContractor: post.site ? post.site.contractStatus : null,
                isInterest: post.site && accountId && post.site?.interestMember.length !== 0 ? true : false,
            },
            workLocation: post.workLocation,
            isInterest: accountId && post.interested.length !== 0 ? true : false,
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
        const search = {
            ...QueryPagingHelper.queryPaging(query),
            where: {
                type: PostType.PREMIUM,
                isHidden: false,
                isActive: true,
            },
            select: {
                company: {
                    select: {
                        logo: {
                            select: {
                                file: true,
                            },
                        },
                    },
                },
                name: true,
                endDate: true,
                id: true,
                site: true,
                workLocation: true,
                occupation: true,
                interested: {
                    where: {
                        member: {
                            accountId,
                        },
                    },
                },
            },
        };
        const posts = (await this.prismaService.post.findMany(search)).map((item) => {
            return {
                companyLogo: {
                    fileName: item.company.logo.file.fileName,
                    type: item.company.logo.file.type,
                    key: item.company.logo.file.key,
                    size: Number(item.company.logo.file.size),
                },
                postName: item.name,
                endDate: item.endDate,
                id: item.id,
                siteName: item.site?.name || null,
                workLocation: item.workLocation,
                isInterested: accountId ? (item.interested.length === 0 ? false : true) : null,
                occupationName: item.occupation?.codeName || null,
            };
        });
        const total = await this.prismaService.post.count({ where: search.where });
        return new PaginationResponse(posts, new PageInfo(total));
    }
}
