import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerCertificationRequestStatus, CareerCertificationType, CareerType, Prisma } from '@prisma/client';
import { AccountMemberService } from 'domain/account/member/account-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { BaseResponse } from 'utils/generics/base.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GovernmentService } from '../../../services/government/government.service';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { getTimeDifferenceInMonths, getTimeDifferenceInYears } from '../../../utils/time-calculator';
import { CareerMemberGetListGeneralRequest } from './request/career-member-get-list-general.request';
import { CareerMemberUpsertGeneralRequest } from './request/career-member-upsert-general.request';
import { CareerMemberGetDetailGeneralResponse } from './response/career-member-get-detail-general.response';
import { CareerResponse } from './response/career-member-get-list-certification.response';
import { CareerMemberGetListGeneralResponse } from './response/career-member-get-list-general.response';

@Injectable()
export class CareerMemberService {
    constructor(
        private prismaService: PrismaService,
        private governmentService: GovernmentService,
        private accountMemberService: AccountMemberService,
    ) {}

    async getListGeneral(
        query: CareerMemberGetListGeneralRequest,
        accountId: number,
    ): Promise<CareerMemberGetListGeneralResponse> {
        const queryFilter: Prisma.CareerWhereInput = {
            isActive: true,
            type: CareerType.GENERAL,
            certificationType: CareerCertificationType.NONE,
            member: {
                accountId,
            },
        };
        const careers = (
            await this.prismaService.career.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    type: true,
                    certificationType: true,
                    companyName: true,
                    siteName: true,
                    startDate: true,
                    endDate: true,
                    code: true,
                },
                orderBy: {
                    startDate: Prisma.SortOrder.desc,
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            const { code, ...rest } = item;
            return {
                ...rest,
                occupationName: code.name,
            };
        });
        const total = await this.prismaService.career.count({ where: queryFilter });
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
                code: true,
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
        if (!response) throw new NotFoundException(Error.CAREER_NOT_FOUND);
        const { code, ...rest } = response;
        return {
            ...rest,
            occupationId: code.id,
            occupationName: code.name,
        };
    }

    async createGeneral(body: CareerMemberUpsertGeneralRequest, accountId: number): Promise<BaseResponse<void>> {
        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                isActive: true,
            },
        });

        if (!occupation) throw new NotFoundException(Error.OCCUPATION_NOT_FOUND);

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
        const codeId = body.occupationId;
        delete body.occupationId;
        const member = await this.prismaService.member.update({
            where: {
                accountId,
            },
            data: {
                careers: {
                    create: {
                        ...body,
                        experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                        experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                        type: CareerType.GENERAL,
                        code: {
                            connect: { id: codeId },
                        },
                        certificationType: CareerCertificationType.NONE,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        await this.accountMemberService.upgradeMember(member.id);

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
        if (!career) throw new NotFoundException(Error.CAREER_NOT_FOUND);
        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                isActive: true,
            },
        });
        if (!occupation) throw new NotFoundException(Error.OCCUPATION_NOT_FOUND);
        const { startDate, endDate, ...restBody } = body;
        await this.prismaService.career.update({
            data: {
                ...restBody,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                codeId: body.occupationId,
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
        if (!career) throw new NotFoundException(Error.CAREER_NOT_FOUND);

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
            throw new NotFoundException(Error.MEMBER_NOT_FOUND);
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
                    code: true,
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
                occupationName: currentItem.code.name,
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
            },
        });

        if (request) throw new BadRequestException(Error.CAREER_REQUEST_ALREADY_EXISTED);

        const certificate = await this.prismaService.careerCertificationRequest.create({
            data: {
                member: {
                    connect: {
                        accountId,
                    },
                },
                status: CareerCertificationRequestStatus.REQUESTING,
            },
            select: {
                memberId: true,
            },
        });
        await this.accountMemberService.upgradeMember(certificate.memberId);
    }

    async getCertExperienceByHealthInsurance(accountId: number): Promise<void> {
        const application = (
            await this.prismaService.member.findUnique({
                where: {
                    accountId,
                },
                select: {
                    careerCertificationRequest: true,
                    id: true,
                },
            })
        ).careerCertificationRequest;
        if (!application) throw new NotFoundException(Error.CAREER_REQUEST_NOT_FOUND);
        if (application.status != CareerCertificationRequestStatus.APPROVED)
            throw new BadRequestException(Error.CAREER_REQUEST_STATUS_IS_NOT_APPROPRIATE);
        await this.governmentService.saveCertificationExperienceHealthInsurance(accountId);
        await this.accountMemberService.upgradeMember(application.memberId);
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
        if (!application) throw new NotFoundException(Error.CAREER_REQUEST_NOT_FOUND);
        if (application.status != CareerCertificationRequestStatus.APPROVED)
            throw new BadRequestException(Error.CAREER_REQUEST_STATUS_IS_NOT_APPROPRIATE);
        await this.governmentService.saveCertificationExperienceEmploymentInsurance(accountId);
        await this.accountMemberService.upgradeMember(application.memberId);
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
        if (!application) throw new NotFoundException(Error.CAREER_REQUEST_NOT_FOUND);
        if (application.status != CareerCertificationRequestStatus.APPROVED)
            throw new BadRequestException(Error.CAREER_REQUEST_STATUS_IS_NOT_APPROPRIATE);
        await this.governmentService.saveCertificationTheOneSite(accountId);
        await this.accountMemberService.upgradeMember(application.memberId);
    }
}
