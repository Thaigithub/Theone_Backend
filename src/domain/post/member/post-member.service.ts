import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { PostMemberGetDetailResponse } from './response/post-member-get-detail.response';
import { PostResponse } from './response/post-member-get-list.response';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';

@Injectable()
export class PostMemberService {
    constructor(private prismaService: PrismaService) {}

    protected async parseConditionFromQuery(query: PostMemberGetListRequest, siteId: number): Promise<Prisma.PostWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupationList?.map((item) => parseInt(item));
        const constructionMachineryList = query.constructionMachineryList?.map((item) => parseInt(item));
        let districtList = query.regionList?.map((item) => {
            return parseInt(item.split('-')[1]);
        });
        const districtEntireCitiesList = await this.prismaService.district.findMany({
            where: {
                id: { in: districtList },
                englishName: 'All',
            },
        });
        const districtEntireCitiesIdList = districtEntireCitiesList?.map((item) => {
            return item.id;
        });
        districtList = districtList?.filter((item) => {
            return !districtEntireCitiesIdList.includes(item);
        });
        const cityList = districtEntireCitiesList?.map((item) => {
            return item.cityId;
        });

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
                        query.regionList
                            ? {
                                  site: {
                                      district: { id: { in: districtList } },
                                  },
                              }
                            : {},
                        districtEntireCitiesList
                            ? {
                                  site: {
                                      district: { cityId: { in: cityList } },
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

    private async getMemberId(accountId: number) {
        const member = await this.prismaService.member.findUnique({
            select: {
                id: true,
                isActive: true,
            },
            where: {
                accountId,
            },
        });
        return member.id;
    }

    async getList(accountId: number | undefined, query: PostMemberGetListRequest, siteId: number): Promise<PostResponse[]> {
        if (siteId) {
            const siteExist = await this.prismaService.site.count({
                where: {
                    isActive: true,
                    id: siteId,
                },
            });
            if (!siteExist) throw new NotFoundException('Site does not exist');
        }

        let listInterestPostIds: number[];

        if (accountId) {
            const memberId = await this.getMemberId(accountId);
            const interestPosts = await this.prismaService.interest.findMany({
                select: {
                    postId: true,
                },
                where: {
                    memberId,
                },
            });
            listInterestPostIds = interestPosts.map((item) => {
                return item.postId;
            });
        }

        const posts = await this.prismaService.post.findMany({
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
            },
            where: await this.parseConditionFromQuery(query, siteId),
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });

        return posts.map((item) => {
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
                ...item,
                occupation,
                startWorkDate,
                endWorkDate,
                endDate,
                siteName: site ? site.name : null,
                siteAddress: site ? site.address : null,
                siteAddressCity: site?.district ? site.district.city.englishName : null,
                siteAddressDistrict: site?.district ? site.district.englishName : null,
                isInterest: listInterestPostIds && listInterestPostIds.includes(item.id) ? true : false,
            };
        });
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
            const memberCertificatesList = await this.prismaService.member.findUnique({
                select: {
                    certificates: {
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
                    ...memberCertificatesList.certificates.map((item) => {
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
                    },
                },
                occupation: true,
                specialOccupation: true,
            },
            where: {
                isActive: true,
                id,
            },
        });

        let siteIsInterested: boolean = false;
        if (accountId) {
            const memberId = await this.getMemberId(accountId);
            const interest = await this.prismaService.interest.findUnique({
                where: {
                    memberId_siteId: {
                        memberId,
                        siteId: post.siteId,
                    },
                },
            });
            if (interest) siteIsInterested = true;
        }

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
                id: post.site.id,
                companyLogoKey: post.company.logo?.file ? post.company.logo.file.key : null,
                siteName: post.site ? post.site.name : null,
                siteAddress: post.site ? post.site.address : null,
                startDate: post.site.startDate ? post.site.startDate.toISOString().split('T')[0] : null,
                endDate: post.site.endDate ? post.site.endDate.toISOString().split('T')[0] : null,
                originalBuilding: post.site ? post.site.originalBuilding : null,
                isInterest: siteIsInterested,
            },
            workLocation: post.workLocation,
        };
    }

    async addApplyPost(accountId: number, id: number) {
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

    async updateInterestPost(accountId: number, id: number): Promise<PostMemberUpdateInterestResponse> {
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
}
