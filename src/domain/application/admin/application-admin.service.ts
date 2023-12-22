import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetResponse } from './response/application-admin-get-list.response';

@Injectable()
export class ApplicationAdminService {
    constructor(private prismaService: PrismaService) {}
    async getApplicationList(id: number, query: ApplicationAdminGetListRequest): Promise<ApplicationAdminGetResponse> {
        const applications = await this.prismaService.application.findMany({
            where: { postId: id, post: { isActive: true } },
            select: {
                id: true,
                member: {
                    select: {
                        name: true,
                        contact: true,
                        region: true,
                        totalExperienceYears: true,
                        totalExperienceMonths: true,
                        desiredSalary: true,
                    },
                },
                team: {
                    select: {
                        name: true,
                        region: true,
                    },
                },
                assignedAt: true,
                interview: {
                    select: {
                        interviewStatus: true,
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
                region: region ? region : member?.region,
                totalExperienceYears,
                totalExperienceMonths,
                desiredSalary,
                assignedAt: assignedAt,
                interviewStatus: interview ? interview?.interviewStatus : null,
            };
        });
        const applicationListCount = await this.prismaService.application.count({
            where: { postId: id, post: { isActive: true } },
        });
        return new PaginationResponse(applicationList, new PageInfo(applicationListCount));
    }
    async getApplicationInfor(id: number): Promise<ApplicationAdminGetDetailResponse> {
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
                        interviewRequestDate: true,
                    },
                },
            },
        });
        if (!application) {
            throw new HttpException('The Application Id is not found', HttpStatus.NOT_FOUND);
        }
        const applicationInfor = {
            status: application.status,
            name: application.team ? application.team.name : application.member.name,
            isTeam: application.team ? true : false,
            contact: application.team ? null : application.member.contact,
            leaderName: application.team ? application.team?.leader.name : null,
            contractStatus: application.post.site ? application.post.site.contractStatus : null,
            startDate: application.contract ? application.contract.startDate : null,
            endDate: application.contract ? application.contract.endDate : null,
            interviewRequestDate: application.interview?.interviewRequestDate
                ? application.interview?.interviewRequestDate
                : null,
        };
        return applicationInfor;
    }
}
