import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerCertificationRequestStatus, CareerCertificationType, CareerType, CodeType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GovernmentService } from '../../../services/government/government.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { getTimeDifferenceInMonths, getTimeDifferenceInYears } from '../../../utils/time-calculator';
import { CareerMemberGetListGeneralRequest } from './request/career-member-get-list-general.request';
import { CareerMemberUpsertGeneralRequest } from './request/career-member-upsert-general.request';
import { CareerMemberGetDetailGeneralResponse } from './response/career-member-get-detail-general.response';
import { CareerResponse } from './response/career-member-get-list-certification.response';
import { CareerMemberGetListGeneralResponse } from './response/career-member-get-list-general.response';
import { BaseResponse } from 'utils/generics/base.response';

@Injectable()
export class CareerMemberService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly governmentService: GovernmentService,
    ) {}

    async getListGeneral(
        query: CareerMemberGetListGeneralRequest,
        accountId: number,
    ): Promise<CareerMemberGetListGeneralResponse> {
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
                type: CareerType.GENERAL,
                certificationType: CareerCertificationType.NONE,
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

    async getDetailGeneral(id: number, accountId: number): Promise<CareerMemberGetDetailGeneralResponse> {
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
                type: CareerType.GENERAL,
                certificationType: CareerCertificationType.NONE,
            },
        });
        if (!response) throw new NotFoundException('Career does not exist');
        const { occupation, ...rest } = response;
        return {
            ...rest,
            occupationId: occupation.id,
            occupationName: occupation.codeName,
        };
    }

    async createGeneral(body: CareerMemberUpsertGeneralRequest, accountId: number): Promise<BaseResponse<void>> {
        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                codeType: CodeType.GENERAL,
                isActive: true,
            },
        });

        if (!occupation) throw new NotFoundException('Occupation not found');

        if (!body.isExperienced) {
            const isNotExperienceCareerExist = await this.prismaService.career.findFirst({
                where: {
                    isActive: true,
                    member: {
                        accountId,
                    },
                    isExperienced: body.isExperienced,
                },
            });
            if (isNotExperienceCareerExist) return BaseResponse.error('Only 1 No Experience Career can be registered');
        }
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
                        certificationType: CareerCertificationType.NONE,
                    },
                },
            },
        });
        return BaseResponse.ok();
    }

    async updateGeneral(id: number, accountId: number, body: CareerMemberUpsertGeneralRequest): Promise<void> {
        const career = await this.prismaService.career.findUnique({
            where: {
                id,
                isActive: true,
                member: {
                    accountId,
                },
                type: CareerType.GENERAL,
                certificationType: CareerCertificationType.NONE,
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
        const { startDate, endDate, ...restBody } = body;
        await this.prismaService.career.update({
            data: {
                ...restBody,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
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
                type: CareerType.GENERAL,
                certificationType: CareerCertificationType.NONE,
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

    async getListCertification(accountId: number) {
        const member = await this.prismaService.member.findUnique({
            where: {
                accountId: accountId,
                isActive: true,
            },
            select: {
                careerCertificationRequest: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (!member) {
            throw new NotFoundException('The member id is not found');
        }
        if (!member.careerCertificationRequest) {
            return {
                status: 'NOT_REQUESTED',
                data: null,
            };
        } else if (member.careerCertificationRequest.status === CareerCertificationRequestStatus.REQUESTING) {
            return {
                status: 'REQUESTING',
                data: null,
            };
        } else if (member.careerCertificationRequest.status === CareerCertificationRequestStatus.REFUSED) {
            return {
                status: 'REFUSED',
                data: null,
            };
        }
        const career = (
            await this.prismaService.career.findMany({
                where: {
                    isActive: true,
                    type: CareerType.CERTIFICATION,
                    member: {
                        accountId,
                        isActive: true,
                    },
                },
                select: {
                    type: true,
                    certificationType: true,
                    companyName: true,
                    siteName: true,
                    startDate: true,
                    endDate: true,
                    createdAt: true,
                    occupation: true,
                },
            })
        ).reduce((result: { [key: string]: CareerResponse[] }, currentItem) => {
            if (!result[currentItem.certificationType]) {
                result[currentItem.certificationType] = [];
            }
            result[currentItem.certificationType].push({
                companyName: currentItem.companyName,
                startDate: currentItem.startDate,
                endDate: currentItem.endDate,
                createdAt: currentItem.createdAt,
                occupationName: currentItem.occupation.codeName,
            });
            return result;
        }, {});

        return {
            status: 'APPROVED',
            data: {
                healthInsurances: career[CareerCertificationType.HEALTH_INSURANCE]
                    ? career[CareerCertificationType.HEALTH_INSURANCE]
                    : [],
                employeeInsurances: career[CareerCertificationType.EMPLOYMENT_INSURANCE]
                    ? career[CareerCertificationType.EMPLOYMENT_INSURANCE]
                    : null,
                oneSiteInquiries: career[CareerCertificationType.THE_ONE_SITE]
                    ? career[CareerCertificationType.THE_ONE_SITE]
                    : [],
            },
        };
    }

    async createCertificationRequest(accountId: number): Promise<void> {
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
        await this.governmentService.saveCertificationExperienceHealthInsurance(accountId);
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
        await this.governmentService.saveCertificationExperienceEmploymentInsurance(accountId);
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
        await this.governmentService.saveCertificationTheOneSite(accountId);
    }
}
