import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { MemberMemberAddSiteOrPost } from './request/member-member-add-site.request';
import {
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from './request/member-member.request';
import { MemberMemebrUpdateInterestResponse } from './response/member-member-update-interest.response';

@Injectable()
export class MemberMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async findIdByAccountId(id: number): Promise<number> {
        const result = await this.prismaService.member.findUnique({
            where: {
                accountId: id,
            },
            select: {
                id: true,
            },
        });
        return result.id;
    }

    async upsertBankAccount(id: number, request: UpsertBankAccountRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                bankAccount: {
                    upsert: {
                        update: {
                            accountHolder: request.accountHolder,
                            accountNumber: request.accountNumber,
                            bankName: request.bankName,
                        },
                        create: {
                            accountHolder: request.accountHolder,
                            accountNumber: request.accountNumber,
                            bankName: request.bankName,
                        },
                    },
                },
            },
        });
    }

    async upsertHSTCertificate(id: number, request: UpsertHSTCertificateRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                basicHealthSafetyCertificate: {
                    upsert: {
                        update: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertForeignWorker(id: number, request: UpsertForeignWorkerRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                foreignWorker: {
                    upsert: {
                        update: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertDisability(id: number, request: UpsertDisabilityRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                disability: {
                    upsert: {
                        update: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async updateInterestSite(accountId: number, payload: MemberMemberAddSiteOrPost): Promise<MemberMemebrUpdateInterestResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        const site = await this.prismaService.site.findUnique({
            where: {
                id: payload.id,
                isActive: true,
            },
        });

        if (!site) {
            throw new BadRequestException('Site does not exist');
        }

        //Check exist member - site
        //If exist, remove that record
        //Else, add that record
        const application = await this.prismaService.interest.findUnique({
            where: {
                memberId_siteId: {
                    memberId: account.member.id,
                    siteId: site.id,
                },
            },
        });

        if (application) {
            await this.prismaService.interest.delete({
                where: {
                    memberId_siteId: {
                        memberId: account.member.id,
                        siteId: site.id,
                    },
                },
            });

            return { isInterested: false };
        } else {
            await this.prismaService.interest.create({
                data: {
                    member: { connect: { id: account.member.id } },
                    site: { connect: { id: site.id } },
                },
            });

            return { isInterested: true };
        }
    }

    async updateInterestPost(accountId: number, payload: MemberMemberAddSiteOrPost): Promise<MemberMemebrUpdateInterestResponse> {
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
                id: payload.id,
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

    async addApplyPost(accountId: number, payload: MemberMemberAddSiteOrPost) {
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
                id: payload.id,
                isActive: true,
            },
        });
        if (!post) {
            throw new BadRequestException('Post does not exist');
        }

        //Check exist member - post
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
                post: { connect: { id: payload.id } },
            },
        });
    }
}
