import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { PostResponse } from './response/post-member-get-list.response';

@Injectable()
export class PostMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PostMemberGetListRequest): Promise<PostResponse[]> {
        const posts = await this.prismaService.post.findMany({
            select: {
                id: true,
                name: true,
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
                endDate: true,
            },
            where: {
                isActive: true,
            },
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
        return posts.map((item) => {
            const occupation = item.occupation?.codeName;
            const site = item.site;
            delete item.occupation;
            delete item.site;
            return {
                ...item,
                occupation,
                siteName: site.name,
                siteAddress: site.address,
                siteAddressCity: site.addressCity,
                siteAddressDistrict: site.addressDistrict,
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
