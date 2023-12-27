import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InterviewStatus, PostApplicationStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { ChangeApplicationStatus } from './enum/application-member-change-status.enum';
import { ApplicationMemberGetListOfferFilter } from './enum/application-member-get-list-offer-filter.enum';
import { OfferType } from './enum/application-member-get-list-offer-type.enum';
import { ApplicationMemberGetListOfferRequest } from './request/application-member-get-list-offer.request';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListOfferResponse } from './response/application-member-get-list-offer.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@Injectable()
export class ApplicationMemberService {
    constructor(private prismaService: PrismaService) {}
    async getApplicationList(id: number, query: ApplicationMemberGetListRequest): Promise<ApplicationMemberGetListResponse> {
        const teams = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId: id,
                },
                select: {
                    teams: {
                        select: {
                            teamId: true,
                        },
                    },
                },
            })
        ).teams.map((item) => item.teamId);
        const search = {
            skip: query.pageNumber && (parseInt(query.pageNumber) - 1) * parseInt(query.pageSize),
            take: query.pageSize && parseInt(query.pageSize),
            where: {
                OR: [
                    {
                        member: {
                            account: {
                                id,
                            },
                        },
                        status: query.status,
                        assignedAt: {
                            gt: query.startDate && new Date(query.startDate),
                            lt: query.endDate && new Date(query.endDate),
                        },
                    },
                    {
                        team: {
                            id: {
                                in: teams,
                            },
                        },
                        status: query.status,
                    },
                ],
            },
            select: {
                id: true,
                status: true,
                assignedAt: true,
                post: {
                    select: {
                        interested: {
                            where: {
                                member: {
                                    accountId: id,
                                },
                            },
                        },
                        id: true,
                        name: true,
                        endDate: true,
                        status: true,
                        occupation: {
                            select: {
                                codeName: true,
                                id: true,
                            },
                        },

                        site: {
                            select: {
                                name: true,
                                contact: true,
                                address: true,
                                personInCharge: true,
                                originalBuilding: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                fileName: true,
                                                key: true,
                                                type: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
        const application = (await this.prismaService.application.findMany(search)).map((item) => {
            return {
                applicationId: item.id,
                companyLogo: item.post.company.logo.file,
                postId: item.post.id,
                postName: item.post.name,
                postStatus: item.post.status,
                occupationId: item.post.occupation ? item.post.occupation.id : null,
                occupationName: item.post.occupation ? item.post.occupation.codeName : null,
                endDate: item.post.endDate,
                status: item.status,
                appliedDate: item.assignedAt,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                isInterested: item.post.interested.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({ where: search.where });
        return new PaginationResponse(application, new PageInfo(total));
    }
    async getDetailApplication(id: number, accountId: number): Promise<ApplicationMemberGetDetailResponse> {
        const teams = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId: accountId,
                },
                select: {
                    teams: {
                        select: {
                            teamId: true,
                        },
                    },
                },
            })
        ).teams.map((item) => item.teamId);
        const application = await this.prismaService.application.findFirst({
            where: {
                OR: [
                    {
                        member: {
                            account: {
                                id: accountId,
                            },
                        },
                        id,
                    },
                    {
                        team: {
                            id: {
                                in: teams,
                            },
                        },
                        id,
                    },
                ],
            },
            select: {
                assignedAt: true,
                status: true,
                team: {
                    select: {
                        name: true,
                        members: {
                            select: {
                                member: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    select: {
                        interested: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        id: true,
                        name: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        site: {
                            select: {
                                personInCharge: true,
                                personInChargeContact: true,
                                email: true,
                                address: true,
                                name: true,
                                startDate: true,
                                endDate: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                key: true,
                                                fileName: true,
                                                type: true,
                                                // size: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        console.log(application);
        if (!application) throw new NotFoundException('Application not found');
        return {
            companyLogo: application.post.company.logo.file,
            companyName: application.post.company.name,
            companyId: application.post.company.id,
            postId: application.post.id,
            postName: application.post.name,
            postStatus: application.post.status,
            siteAddress: application.post.site ? application.post.site.address : '',
            siteStartDate: application.post.site ? application.post.site.startDate : null,
            siteEndDate: application.post.site ? application.post.site.endDate : null,
            siteName: application.post.site ? application.post.site.name : '',
            sitePersonInCharge: application.post.site ? application.post.site.personInCharge : '',
            sitePersonInChargeContact: application.post.site ? application.post.site.personInChargeContact : '',
            siteEmail: application.post.site ? application.post.site.email : '',
            postEndDate: application.post.startDate,
            postStartDate: application.post.endDate,
            status: application.status,
            appliedDate: application.assignedAt,
            occupationName: application.post.occupation ? application.post.occupation.codeName : null,
            isInterested: application.post.interested.length !== 0 ? true : false,
            team: application.team && {
                name: application.team.name,
                members: application.team.members.map((item) => {
                    return { name: item.member.name, contact: item.member.contact };
                }),
            },
        };
    }
    async changeApplicationStatus(id: number, accountId: number, status: ChangeApplicationStatus): Promise<void> {
        const application = await this.prismaService.application.findFirst({
            where: {
                OR: [
                    {
                        id,
                        member: {
                            accountId,
                        },
                    },
                    {
                        id,
                        team: {
                            leaderId: accountId,
                        },
                    },
                ],
            },
            select: {
                status: true,
                interview: {
                    select: {
                        interviewStatus: true,
                    },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found');
        if (
            application.status !== PostApplicationStatus.APPROVE_BY_COMPANY ||
            application.interview.interviewStatus !== InterviewStatus.PASS
        )
            throw new BadRequestException('Application is not at the correct status to change');
        await this.prismaService.application.update({
            where: {
                id,
            },
            data: {
                status:
                    status === ChangeApplicationStatus.ACCEPT
                        ? PostApplicationStatus.APPROVE_BY_MEMBER
                        : PostApplicationStatus.REJECT_BY_MEMBER,
            },
        });
    }
    async getApplicationOfferList(
        accountId: number,
        body: ApplicationMemberGetListOfferRequest,
    ): Promise<ApplicationMemberGetListOfferResponse> {
        const teams = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    teams: {
                        select: {
                            teamId: true,
                        },
                    },
                },
            })
        ).teams.map((item) => item.teamId);
        const query = {
            where: {},
            select: {
                id: true,
                team: {
                    select: {
                        name: true,
                    },
                },
                memberId: true,
                assignedAt: true,
                status: true,
                interview: {
                    select: {
                        interviewStatus: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        interested: {
                            where: {
                                member: {
                                    accountId,
                                },
                            },
                        },
                        workLocation: true,
                        endDate: true,
                        name: true,
                        occupation: {
                            select: {
                                codeName: true,
                            },
                        },
                        site: {
                            select: {
                                address: true,
                                name: true,
                            },
                        },
                        company: {
                            select: {
                                logo: {
                                    select: {
                                        file: {
                                            select: {
                                                fileName: true,
                                                type: true,
                                                size: true,
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            skip: body.pageNumber && (parseInt(body.pageNumber) - 1) * parseInt(body.pageSize),
            take: body.pageSize && parseInt(body.pageSize),
        };
        switch (body.filter) {
            case ApplicationMemberGetListOfferFilter.ACCEPTED: {
                query.where['OR'] = [
                    {
                        member: {
                            accountId,
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_MEMBER,
                    },
                    {
                        team: {
                            leader: {
                                accountId,
                            },
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_MEMBER,
                    },
                ];
                break;
            }
            case ApplicationMemberGetListOfferFilter.REJECTED: {
                query.where['OR'] = [
                    {
                        member: {
                            accountId,
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.REJECT_BY_MEMBER,
                    },
                    {
                        team: {
                            leader: {
                                accountId,
                            },
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.REJECT_BY_MEMBER,
                    },
                ];
                break;
            }
            case ApplicationMemberGetListOfferFilter.DEADLINE: {
                query.where['OR'] = [
                    {
                        member: {
                            accountId,
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                            endDate: {
                                lt: new Date().toISOString(),
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                    {
                        team: {
                            leader: {
                                accountId,
                            },
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                            endDate: {
                                lt: new Date().toISOString(),
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                ];
                break;
            }
            case ApplicationMemberGetListOfferFilter.TEAM_LEADER_WAITING: {
                query.where = {
                    team: {
                        id: {
                            in: teams,
                        },
                        leaderId: {
                            not: accountId,
                        },
                    },
                    interview: {
                        interviewStatus: InterviewStatus.PASS,
                    },
                    post: {
                        name: {
                            contains: body.postName,
                            mode: 'insensitive',
                        },
                        endDate: {
                            gt: Date(),
                        },
                    },
                    status: PostApplicationStatus.APPROVE_BY_COMPANY,
                };
            }
            case ApplicationMemberGetListOfferFilter.WAITING: {
                query.where['OR'] = [
                    {
                        member: {
                            accountId,
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                    {
                        team: {
                            leader: {
                                accountId,
                            },
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                        status: PostApplicationStatus.APPROVE_BY_COMPANY,
                    },
                ];
                break;
            }
            default: {
                query.where['OR'] = [
                    {
                        member: {
                            accountId,
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        team: {
                            id: {
                                in: teams,
                            },
                        },
                        interview: {
                            interviewStatus: InterviewStatus.PASS,
                        },
                        post: {
                            name: {
                                contains: body.postName,
                                mode: 'insensitive',
                            },
                        },
                    },
                ];
                break;
            }
        }
        const offer = (await this.prismaService.application.findMany(query)).map((item) => {
            return {
                postId: item.post.id,
                endDate: item.post.endDate,
                type: item.team ? OfferType.TEAM : OfferType.INDIVIDUAL,
                id: item.id,
                requestDate: new Date(item.assignedAt).toISOString(),
                applicationStatus: item.status,
                teamName: item.team ? item.team.name : '',
                companyLogo: {
                    key: item.post.company.logo.file.key,
                    fileName: item.post.company.logo.file.fileName,
                    type: item.post.company.logo.file.type,
                    // size: item.post.site.Company.logo.file.size,
                },
                postName: item.post.name,
                siteName: item.post.site ? item.post.site.name : '',
                siteAddress: item.post.site ? item.post.site.address : '',
                occupationName: item.post.occupation ? item.post.occupation.codeName : '',
                workLocation: item.post.workLocation,
                isInterested: item.post.interested.length === 0 ? false : true,
            };
        });
        const total = await this.prismaService.application.count({
            where: query.where,
        });
        return new PaginationResponse(offer, new PageInfo(total));
    }
}
