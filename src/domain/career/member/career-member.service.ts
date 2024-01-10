import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerCertificationRequestStatus, CareerType, CodeType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GovernmentService } from '../../../services/government/government.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { getTimeDifferenceInMonths, getTimeDifferenceInYears } from '../../../utils/time-calculator';
import { CareerMemberGetListRequest } from './request/career-member-get-list.request';
import { CareerMemberUpsertRequest } from './request/career-member-upsert.request';
import { CareerMemberGetDetailResponse } from './response/career-member-get-detail.response';
import { CareerMemberGetListResponse } from './response/career-member-get-list.response';

@Injectable()
export class CareerMemberService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly governmentService: GovernmentService,
    ) {}

    async getListGeneral(query: CareerMemberGetListRequest, accountId: number): Promise<CareerMemberGetListResponse> {
        const search = {
            select: {
                id: true,
                type: true,
                certificationType: true,
                companyName: true,
                siteName: true,
                startDate: true,
                endDate: true,
                occupation: true,
            },
            where: {
                isActive: true,
                type: query.type,
                certificationType: query.certificationType,
                member: {
                    accountId,
                },
            },
            orderBy: {
                startDate: Prisma.SortOrder.desc,
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        const careers = (await this.prismaService.career.findMany(search)).map((item) => {
            const { occupation, ...rest } = item;
            return {
                ...rest,
                occupationName: occupation.codeName,
            };
        });
        const total = await this.prismaService.career.count({ where: search.where });
        return new PaginationResponse(careers, new PageInfo(total));
    }

    async getDetailGeneral(id: number, accountId: number): Promise<CareerMemberGetDetailResponse> {
        const response = await this.prismaService.career.findUnique({
            select: {
                id: true,
                type: true,
                companyName: true,
                siteName: true,
                startDate: true,
                endDate: true,
                occupation: true,
                isExperienced: true,
            },
            where: {
                isActive: true,
                id,
                member: {
                    accountId,
                },
            },
        });
        if (!response) throw new NotFoundException('Career does not exist');
        const { occupation, ...rest } = response;
        return {
            ...rest,
            occupationName: occupation.codeName,
        };
    }

    async createGeneral(body: CareerMemberUpsertRequest, accountId: number): Promise<void> {
        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                codeType: CodeType.GENERAL,
                isActive: true,
            },
        });

        if (!occupation) throw new NotFoundException('Occupation not found');

        await this.prismaService.member.update({
            where: {
                accountId,
            },
            data: {
                career: {
                    create: {
                        ...body,
                        experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                        experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                        type: CareerType.GENERAL,
                        occupationId: occupation.id,
                    },
                },
            },
        });
    }

    async updateGeneral(id: number, accountId: number, body: CareerMemberUpsertRequest): Promise<void> {
        const career = await this.prismaService.career.findUnique({
            where: {
                id,
                isActive: true,
                member: {
                    accountId,
                },
            },
        });
        if (!career) throw new NotFoundException('Career not found');
        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                codeType: CodeType.GENERAL,
                isActive: true,
            },
        });
        if (!occupation) throw new NotFoundException('Occupation not found');
        await this.prismaService.career.update({
            data: {
                ...body,
                experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                occupationId: occupation.id,
            },
            where: {
                id,
            },
        });
    }

    async deleteGeneral(id: number, accountId: number): Promise<void> {
        const career = await this.prismaService.career.findUnique({
            where: {
                isActive: true,
                id,
                member: {
                    accountId,
                },
            },
        });
        if (!career) throw new NotFoundException('Career not found');

        await this.prismaService.career.update({
            where: {
                isActive: true,
                id,
                member: {
                    accountId,
                },
            },
            data: {
                isActive: false,
            },
        });
    }

    async createCertificateRequest(accountId: number): Promise<void> {
        const request = await this.prismaService.careerCertificationRequest.count({
            where: {
                member: {
                    accountId,
                },
                status: CareerCertificationRequestStatus.APPROVED,
            },
        });
        if (request < 1) throw new ConflictException('Request already approved');

        await this.prismaService.member.update({
            where: {
                accountId,
            },
            data: {
                careerCertificationRequest: {
                    upsert: {
                        create: {
                            status: CareerCertificationRequestStatus.REQUESTING,
                        },
                        update: {
                            status: CareerCertificationRequestStatus.REQUESTING,
                        },
                    },
                },
            },
        });
    }

    async getCertExperienceByHealthInsurance(accountId: number): Promise<void> {
        const application = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    careerCertificationRequest: true,
                },
            })
        ).careerCertificationRequest;
        if (!application || application.status != CareerCertificationRequestStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');
        // await this.governmentService.saveCertificationExperienceHealthInsurance(accountId);
    }

    async getCertExperienceByEmploymentInsurance(accountId: number): Promise<void> {
        const application = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    careerCertificationRequest: true,
                },
            })
        ).careerCertificationRequest;
        if (!application || application.status != CareerCertificationRequestStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');
        // await this.governmentService.saveCertificationExperienceEmploymentInsurance(accountId);
    }

    async getCertExperienceByTheOneSite(accountId: number): Promise<void> {
        const application = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    careerCertificationRequest: true,
                },
            })
        ).careerCertificationRequest;
        if (!application || application.status != CareerCertificationRequestStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');
        // await this.governmentService.saveCertificationTheOneSite(accountId);
    }
}
