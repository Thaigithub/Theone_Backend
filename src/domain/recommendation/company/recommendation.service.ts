import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { InterviewStatus, PostApplicationStatus, RequestObject, SupportCategory } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { RecommendationCompanyInterviewProposeRequest } from './request/recommendaation-company-interview-proposed.request';

@Injectable()
export class RecommendationCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async proposeInterview(
        accountId: number,
        applicantId: number,
        supportCategory: SupportCategory,
        body: RecommendationCompanyInterviewProposeRequest,
    ) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: body.postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new BadRequestException('No Post found');

        if (body.object === RequestObject.INDIVIDUAL) {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    memberId_postId: {
                        memberId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant && supportCategory === SupportCategory.HEADHUNTING)
                throw new BadRequestException('No applicant found');

            await this.proposeInterviewEachObject('memberId', applicantId, supportCategory, body);
        } else {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    teamId_postId: {
                        teamId: applicantId,
                        postId: body.postId,
                    },
                },
            });

            if (!applicant && supportCategory === SupportCategory.HEADHUNTING)
                throw new BadRequestException('No applicant found');

            await this.proposeInterviewEachObject('teamId', applicantId, supportCategory, body);
        }
    }

    async proposeInterviewEachObject(
        object: string,
        applicantId: number,
        supportCategory: SupportCategory,
        body: RecommendationCompanyInterviewProposeRequest,
    ) {
        await this.prismaService.application.create({
            data: {
                [object]: applicantId,
                postId: body.postId,
                status: PostApplicationStatus.PROPOSAL_INTERVIEW,
                interview: {
                    create: {
                        interviewStatus: InterviewStatus.INTERVIEWING,
                        supportCategory: supportCategory,
                    },
                },
            },
        });
    }

    async getDetailApplicants(accountId: number, applicantId: number, postId: number, isTeam: boolean) {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
                isActive: true,
                companyId: account.company.id,
            },
        });

        if (!post) throw new NotFoundException('No post found');

        if (!isTeam) {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    memberId_postId: {
                        memberId: applicantId,
                        postId: postId,
                    },
                },
            });

            if (!applicant) throw new NotFoundException('No applicant found');

            return await this.prismaService.member.findUnique({
                where: {
                    id: applicantId,
                    isActive: true,
                },
                select: {
                    name: true,
                    contact: true,
                    email: true,
                    district: {
                        select: {
                            englishName: true,
                            koreanName: true,
                            city: {
                                select: {
                                    englishName: true,
                                    koreanName: true,
                                },
                            },
                        },
                    },
                    desiredSalary: true,
                    totalExperienceYears: true,
                    totalExperienceMonths: true,
                    account: {
                        select: {
                            username: true,
                        },
                    },
                    career: {
                        select: {
                            companyName: true,
                            siteName: true,
                            occupation: true,
                            startDate: true,
                            endDate: true,
                            experiencedYears: true,
                            experiencedMonths: true,
                        },
                    },
                    certificates: {
                        select: {
                            name: true,
                            certificateNumber: true,
                        },
                    },
                    specialLicenses: {
                        select: {
                            code: {
                                select: {
                                    codeName: true,
                                },
                            },
                            licenseNumber: true,
                        },
                    },
                    basicHealthSafetyCertificate: {
                        select: {
                            registrationNumber: true,
                            dateOfCompletion: true,
                            file: true,
                        },
                    },
                },
            });
        } else {
            const applicant = await this.prismaService.headhuntingRecommendation.findUnique({
                where: {
                    teamId_postId: {
                        teamId: applicantId,
                        postId: postId,
                    },
                },
            });

            if (!applicant) throw new BadRequestException('No applicant found');

            const team = await this.prismaService.team.findUnique({
                where: {
                    id: applicantId,
                    isActive: true,
                },
                select: {
                    name: true,
                    district: {
                        select: {
                            englishName: true,
                            koreanName: true,
                            city: {
                                select: {
                                    englishName: true,
                                    koreanName: true,
                                },
                            },
                        },
                    },
                    leader: {
                        select: {
                            contact: true,
                            totalExperienceYears: true,
                            totalExperienceMonths: true,
                            desiredSalary: true,
                        },
                    },
                    members: {
                        select: {
                            member: {
                                select: {
                                    name: true,
                                    contact: true,
                                    desiredOccupations: {
                                        select: {
                                            code: {
                                                select: {
                                                    codeName: true,
                                                },
                                            },
                                        },
                                    },
                                    totalExperienceYears: true,
                                    totalExperienceMonths: true,
                                },
                            },
                        },
                        orderBy: [
                            {
                                member: {
                                    totalExperienceYears: 'desc',
                                },
                            },
                            {
                                member: {
                                    totalExperienceMonths: 'desc',
                                },
                            },
                        ],
                    },
                },
            });

            const { members, ...rest } = team;
            return {
                ...rest,
                members: members.map((item) => {
                    const desiredOccupations = item.member.desiredOccupations;
                    return {
                        name: item.member.name,
                        contact: item.member.contact,
                        totalExperienceYears: item.member.totalExperienceYears,
                        totalExperienceMonths: item.member.totalExperienceMonths,
                        desiredOccupations: desiredOccupations
                            ? desiredOccupations.map((item) => {
                                  return item.code.codeName;
                              })
                            : [],
                    };
                }),
            };
        }
    }
}
