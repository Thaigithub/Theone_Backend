import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { CountResponse } from 'utils/generics/count.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationAdminContractStatus } from './enum/application-admin-contract-status.enum';
import { ApplicationAdminGetCountRequest } from './request/application-admin-get-count.request';
import { ApplicationAdminGetListPostRequest } from './request/application-admin-get-list-post.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetLisPostResponse } from './response/application-admin-get-list-post.response';

@Injectable()
export class ApplicationAdminService {
    constructor(private prismaService: PrismaService) {}

    async getListPost(postId: number, query: ApplicationAdminGetListPostRequest): Promise<ApplicationAdminGetLisPostResponse> {
        const applications = await this.prismaService.application.findMany({
            where: {
                postId,
                post: { isActive: true },
                isActive: true,
            },
            select: {
                id: true,
                member: {
                    include: {
                        region: true,
                    },
                },
                team: {
                    include: {
                        region: true,
                    },
                },
                assignedAt: true,
                interview: {
                    select: {
                        status: true,
                    },
                },
            },

            ...QueryPagingHelper.queryPaging(query),
        });
        const applicationList = applications.map((applicant) => {
            const { id, assignedAt, member, team, interview } = applicant;
            const { name, region, totalExperienceYears, totalExperienceMonths, desiredSalary } = member || {};
            return {
                id: id,
                name: name ? name : team.name,
                contact: member?.contact ? member?.contact : null,
                isTeam: team ? true : false,
                region: region ? region : null,
                address: member?.address ? member.address : null,
                totalExperienceYears,
                totalExperienceMonths,
                desiredSalary,
                assignedAt: assignedAt,
                interviewStatus: interview ? interview?.status : null,
            };
        });
        const applicationListCount = await this.prismaService.application.count({
            where: { postId, post: { isActive: true } },
        });
        return new PaginationResponse(applicationList, new PageInfo(applicationListCount));
    }

    async getDetail(id: number): Promise<ApplicationAdminGetDetailResponse> {
        const application = await this.prismaService.application.findUnique({
            where: {
                id: id,
                post: { isActive: true },
                isActive: true,
            },
            select: {
                status: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
                    },
                },
                team: {
                    select: {
                        name: true,
                        leader: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                post: {
                    select: {
                        site: {
                            select: {
                                contractStatus: true,
                            },
                        },
                    },
                },
                contract: {
                    select: {
                        startDate: true,
                        endDate: true,
                    },
                },
                interview: {
                    select: {
                        requestDate: true,
                    },
                },
            },
        });
        if (!application) {
            throw new NotFoundException(Error.APPLICATION_NOT_FOUND);
        }
        const applicationInfor = {
            status: application.status,
            name: application.team ? application.team.name : application.member.name,
            isTeam: application.team ? true : false,
            contact: application.team ? null : application.member.contact,
            leaderName: application.team ? application.team?.leader.name : null,
            contractStatus: application.contract
                ? application.contract.endDate >= new Date()
                    ? ApplicationAdminContractStatus.UNDER_CONTRACT
                    : ApplicationAdminContractStatus.CONTRACT_EXPIRED
                : ApplicationAdminContractStatus.CONTRACT_NOT_FOUND,
            startDate: application.contract ? application.contract.startDate : null,
            endDate: application.contract ? application.contract.endDate : null,
            interviewRequestDate: application.interview?.requestDate ? application.interview?.requestDate : null,
        };
        return applicationInfor;
    }

    async getCount(query: ApplicationAdminGetCountRequest): Promise<CountResponse> {
        const queryFilter: Prisma.ApplicationWhereInput = {
            ...(query.postType && {
                post: {
                    type: query.postType,
                },
            }),
            isActive: true,
        };
        const count = await this.prismaService.application.count({
            where: queryFilter,
        });
        return {
            count: count,
        };
    }
}
