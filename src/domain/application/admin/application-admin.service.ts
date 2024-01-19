import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationAdminContractStatus } from './enum/application-admin-contract-status.enum';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list-for-post.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetResponse } from './response/application-admin-get-list-for-post.response';

@Injectable()
export class ApplicationAdminService {
    constructor(private prismaService: PrismaService) {}

    async getListForPost(postId: number, query: ApplicationAdminGetListRequest): Promise<ApplicationAdminGetResponse> {
        const applications = await this.prismaService.application.findMany({
            where: { postId, post: { isActive: true } },
            select: {
                id: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
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
                        address: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                    },
                },
                team: {
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
            const { name, district, totalExperienceYears, totalExperienceMonths, desiredSalary } = member || {};
            return {
                id: id,
                name: name ? name : team.name,
                contact: member?.contact ? member?.contact : null,
                isTeam: team ? true : false,
                city: district?.city || null,
                district: district ? district : null,
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
            where: { id: id, post: { isActive: true } },
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
            throw new NotFoundException('Application not found');
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
}