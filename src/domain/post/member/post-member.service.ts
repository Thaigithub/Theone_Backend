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

    private parseConditionFromQuery(query: PostMemberGetListRequest, siteId: number): Prisma.PostWhereInput {
        if (query.regionList) {
            (query.regionList as string[]).map(async (region) => {
                const [cityCode] = region.split('-');
                const isNationwide = await this.prismaService.city.count({
                    where: {
                        isActive: true,
                        id: parseInt(cityCode),
                        englishName: 'Nationwide',
                    },
                });
                if (isNationwide) query.regionList = undefined;
            });
        }

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
                    OR:
                        query.regionList &&
                        (query.regionList as string[]).map((region) => {
                            const [cityCode, districtCode] = region.split('-');
                            return {
                                site: {
                                    district: {
                                        id: parseInt(districtCode),
                                        city: {
                                            id: parseInt(cityCode),
                                        },
                                    },
                                },
                            };
                        }),
                },
            ],
            siteId,
            experienceType: { in: query.experienceTypeList as ExperienceType[] },
            occupationId: { in: query.occupationList as number[] },
            specialNoteId: { in: query.constructionMachineryList as number[] },
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

    async getList(accountId: number, query: PostMemberGetListRequest, siteId: number): Promise<PostResponse[]> {
        if (siteId) {
            const siteExist = await this.prismaService.site.count({
                where: {
                    isActive: true,
                    id: siteId,
                },
            });
            if (!siteExist) throw new NotFoundException('Site does not exist');
        }
        const memberId = await this.getMemberId(accountId);
        const interestPosts = await this.prismaService.interest.findMany({
            select: {
                postId: true,
            },
            where: {
                memberId,
            },
        });
        const listInterestPostIds = interestPosts.map((item) => {
            return item.postId;
        });
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
            where: this.parseConditionFromQuery(query, siteId),
            orderBy: {
                createdAt: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        return posts.map((item) => {
            const site = item.site;
            const startWorkDate = item.startWorkDate.toISOString().split('T')[0];
            const endWorkDate = item.endWorkDate.toISOString().split('T')[0];
            const endDate = item.endDate.toISOString().split('T')[0];
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
                siteAddressCity: site && site.district ? site.district.city.englishName : null,
                siteAddressDistrict: site && site.district ? site.district.englishName : null,
                isInterest: listInterestPostIds.includes(item.id) ? true : false,
            };
        });
    }

    async getTotal(query: PostMemberGetListRequest, siteId: number): Promise<number> {
        return await this.prismaService.post.count({
            where: this.parseConditionFromQuery(query, siteId),
        });
    }

    async getDetail(id: number, accountId: number): Promise<PostMemberGetDetailResponse> {
        const postExist = await this.prismaService.post.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!postExist) throw new NotFoundException('Post does not exist');

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
        const memberRegisteredCodeIdsList = [
            ...new Set([
                ...memberSpecialLicenseList.specialLicenses.map((item) => {
                    return item.code.id;
                }),
                ...memberCertificatesList.certificates.map((item) => {
                    return item.code.id;
                }),
            ]),
        ];

        const post = await this.prismaService.post.findUnique({
            select: {
                name: true,
                startDate: true,
                endDate: true,
                experienceType: true,
                numberOfPeople: true,
                workLocation: true,
                occupation: {
                    select: {
                        codeName: true,
                    },
                },
                specialNote: {
                    select: {
                        id: true,
                        codeName: true,
                    },
                },
                salaryType: true,
                salaryAmount: true,
                startWorkDate: true,
                endWorkDate: true,
                workday: true,
                startWorkTime: true,
                endWorkTime: true,
                postEditor: true,
                company: {
                    select: {
                        logo: {
                            select: {
                                file: {
                                    select: {
                                        key: true,
                                    },
                                },
                            },
                        },
                    },
                },
                site: {
                    select: {
                        name: true,
                        contact: true,
                        personInCharge: true,
                        personInChargeContact: true,
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
                        originalBuilding: true,
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
                description: post.postEditor,
            },
            eligibility: {
                experienceType: post.experienceType,
                occupation: post.occupation ? post.occupation.codeName : null,
                specialNote: post.specialNote ? post.specialNote.codeName : null,
                isEligibleToApply:
                    !memberRegisteredCodeIdsList.length || memberRegisteredCodeIdsList.includes(post.specialNote?.id)
                        ? true
                        : false,
            },
            workingCondition: {
                salaryType: post.salaryType,
                salaryAmount: post.salaryAmount,
                startWorkDate: post.startWorkDate.toISOString().split('T')[0],
                endWorkDate: post.endWorkDate.toISOString().split('T')[0],
                workday: post.workday,
                startWorkTime: post.startWorkTime.toISOString().split('T')[1],
                endWorkTime: post.endWorkTime.toISOString().split('T')[1],
            },
            siteInformation: {
                companyLogoKey: post.company.logo?.file ? post.company.logo.file.key : null,
                siteName: post.site ? post.site.name : null,
                siteAddress: post.site ? post.site.address : null,
                siteAddressCity: post.site ? post.site.district.city.englishName : null,
                siteAddressDistrict: post.site ? post.site.district.englishName : null,
                personInCharge: post.site ? post.site.personInCharge : null,
                personInChargeContact: post.site ? post.site.personInChargeContact : null,
                contact: post.site ? post.site.contact : null,
                originalBuilding: post.site ? post.site.originalBuilding : null,
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
