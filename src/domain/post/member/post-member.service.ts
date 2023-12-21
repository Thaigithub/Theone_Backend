import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';
import { OccupationResponse, PostResponse } from './response/post-member-get-list.response';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { CodeType, ExperienceType } from '@prisma/client';

@Injectable()
export class PostMemberService {
    constructor(private prismaService: PrismaService) {}

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

    async getCodeList(typeOfCode: CodeType): Promise<OccupationResponse[]> {
        return await this.prismaService.code.findMany({
            select: {
                id: true,
                codeName: true,
            },
            where: {
                isActive: true,
                codeType: typeOfCode,
            },
        });
    }

    async getList(query: PostMemberGetListRequest, accountId: number): Promise<PostResponse[]> {
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
                        addressCity: true,
                        addressDistrict: true,
                    },
                },
            },
            where: {
                isActive: true,
                experienceType: { in: query.experienceTypeList as ExperienceType[] },
                occupationId: { in: query.occupationList as number[] },
                specialNoteId: { in: query.constructionMachineryList as number[] },
            },
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return posts.map((item) => {
            const site = item.site;
            const occupation = item.occupation ? item.occupation.codeName : null;
            delete item.site;
            delete item.occupation;
            return {
                ...item,
                occupation,
                siteName: site.name,
                siteAddress: site.address,
                siteAddressCity: site.addressCity,
                siteAddressDistrict: site.addressDistrict,
                isInterest: listInterestPostIds.includes(item.id) ? true : false,
            };
        });
    }

    async getTotal(): Promise<number> {
        return await this.prismaService.post.count({
            where: {
                isActive: true,
            },
        });
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
