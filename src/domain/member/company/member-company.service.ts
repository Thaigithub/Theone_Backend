/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceType, MemberLevel, PaymentStatus, Prisma, ProductType, RefundStatus } from '@prisma/client';
import { RegionService } from 'domain/region/region.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { MemberCompanyCheckMemberRequest } from './request/member-company-check-member.request';
import { MemberCompanyGetListRequest } from './request/member-company-get-list.request';
import { MemberCompanyCountWorkersResponse } from './response/member-company-get-count-worker.response';
import { MemberCompanyGetDetailResponse } from './response/member-company-get-detail.response';
import { MemberCompanyGetListResponse } from './response/member-company-get-list.response';

@Injectable()
export class MemberCompanyService {
    constructor(
        private prismaService: PrismaService,
        private regionService: RegionService,
    ) {}

    private async parseConditionFromQuery(query: MemberCompanyGetListRequest): Promise<Prisma.MemberWhereInput> {
        const experienceTypeList = query.experienceTypeList?.map((item) => ExperienceType[item]);
        const occupationList = query.occupation?.map((item) => parseInt(item));
        const { ids } = await this.regionService.parseFromRegionList(query.regionList);

        return {
            isActive: true,
            AND: [
                {
                    OR: query.keyword && [
                        {
                            licenses: {
                                some: {
                                    code: {
                                        name: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                },
                            },
                        },
                        {
                            region: {
                                OR: [
                                    {
                                        districtEnglishName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        districtKoreanName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        cityEnglishName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                    {
                                        cityKoreanName: { contains: query.keyword, mode: 'insensitive' },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    OR: query.experienceTypeList && [
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.REGARDLESS)
                            ? { lt: 1 }
                            : undefined,
                        },
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.SHORT)
                                ? { gte: 1, lte: 4 }
                                : undefined,
                        },
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.MEDIUM)
                                ? { gte: 5, lte: 9 }
                                : undefined,
                        },
                        {
                            totalExperienceYears: experienceTypeList.includes(ExperienceType.LONG)
                                ? { gte: 10 }
                                : undefined,
                        },
                    ],
                },
                {
                    ...(occupationList &&
                        occupationList.length > 0 && {
                        licenses: {
                            some: {
                                code: {
                                    id: { in: occupationList },
                                },
                            },
                        },
                    }),
                },
                {
                    ...(ids &&
                        ids.length > 0 && {
                        region: {
                            id: { in: ids },
                        },
                    }),
                },
            ],
            NOT: {
                level: { in: Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER)},
            }
        } as Prisma.MemberWhereInput;
    }

    private async isMemberInformationRevealable(accountId: number, memberId: number): Promise<boolean> {
        const headhuntingRecommendation = await this.prismaService.headhuntingRecommendation.findFirst({
            where: {
                OR: [
                    {
                        memberId,
                    },
                    {
                        team: {
                            OR: [
                                {
                                    leaderId: memberId,
                                },
                                {
                                    members: {
                                        some: {
                                            memberId,
                                        },
                                    },
                                }
                            ]
                        }
                    }
                ],
                headhunting: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                }
            },
        });

        if (headhuntingRecommendation) return true;

        const matchingReommendation = await this.prismaService.matchingRecommendation.findFirst({
            where: {
                OR: [
                    {
                        memberId,
                    },
                    {
                        team: {
                            OR: [
                                {
                                    leaderId: memberId,
                                },
                                {
                                    members: {
                                        some: {
                                            memberId,
                                        },
                                    },
                                }
                            ]
                        }
                    }
                ],
                matchingRequest: {
                    company: {
                        accountId,
                    },
                }
            },
        });

        if (matchingReommendation) return true;

        return false;
    }

    async getList(accountId: number, query: MemberCompanyGetListRequest): Promise<MemberCompanyGetListResponse> {
        const records = (
            await this.prismaService.member.findMany({
                include: {
                    account: {
                        select: {
                            isActive: true,
                        },
                    },
                    licenses: {
                        where: {
                            isActive: true,
                        },
                        include: {
                            code: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                    region: {
                        select: {
                            districtKoreanName: true,
                            cityKoreanName: true,
                        },
                    },
                    memberInformationRequests: {
                        where: {
                            company: {
                                accountId,
                            },
                        },
                    },
                },
                where: await this.parseConditionFromQuery(query),
                ...QueryPagingHelper.queryPaging(query),
            })
        )
        
        const members = await Promise.all(records.map(async (item) => {
            const isChecked = item.memberInformationRequests.length > 0 || await this.isMemberInformationRevealable(accountId, item.id);

            return {
                id: item.id,
                name: item.name,
                contact: isChecked ? item.contact : null,
                desiredSalary: item.desiredSalary,
                cityKoreanName: item.region ? item.region.cityKoreanName : null,
                districtKoreanName: item.region ? item.region.districtKoreanName : null,
                totalExperienceYears: item.totalExperienceYears,
                totalExperienceMonths: item.totalExperienceMonths,
                licenses: isChecked ? item.licenses : null,
                occupations: item.licenses.map((item) => { return item.code.name; }),
                isChecked,
            };
        }));
        const total = await this.prismaService.member.count({
            where: await this.parseConditionFromQuery(query),
        });
        return new PaginationResponse(members, new PageInfo(total));
    }

    async getDetail(accountId: number, id: number, checkInformationRequired: boolean): Promise<MemberCompanyGetDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                id,
                OR: [
                    {
                        headhuntingRecommendations: {
                            some: {
                                headhunting: {
                                    post: {
                                        company: {
                                            accountId,
                                        }
                                    }
                                }
                            }
                        },
                    },
                    {
                        matchingRecommendations: {
                            some: {
                                matchingRequest: {
                                    company: {
                                        accountId,
                                    }
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            level: { in: Array<MemberLevel>(MemberLevel.GOLD, MemberLevel.PLATINUM, MemberLevel.SILVER)}
                        }
                    }
                ],
            },
        });
        if (!memberExist) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

        const member = await this.prismaService.member.findUnique({
            include: {
                account: true,
                region: {
                    select: {
                        districtEnglishName: true,
                        districtKoreanName: true,
                        cityEnglishName: true,
                        cityKoreanName: true,
                    },
                },
                careers: {
                    include: {
                        code: true,
                    },
                },
                licenses: {
                    where: {
                        isActive: true,
                    },
                    include: {
                        code: true,
                    },
                },
                basicHealthSafetyCertificate: {
                    include: {
                        file: true,
                    },
                },
                memberInformationRequests: {
                    where: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
            },
            where: {
                isActive: true,
                id,
            },
        });

        const isChecked = checkInformationRequired ? (member.memberInformationRequests.length > 0) || (await this.isMemberInformationRevealable(accountId, id)) : true;

        if (isChecked) {
            return {
                name: member.name,
                username: member.account.username,
                contact: member.contact,
                email: member.email,
                district: {
                    englishName: member.region ? member.region.districtEnglishName : null,
                    koreanName: member.region ? member.region.districtKoreanName : null,
                },
                city: {
                    englishName: member.region ? member.region.cityEnglishName : null,
                    koreanName: member.region ? member.region.cityKoreanName : null,
                },
                desiredSalary: member.desiredSalary,
                totalExperienceYears: member.totalExperienceYears,
                totalExperienceMonths: member.totalExperienceMonths,
                careers: member.careers
                    ? member.careers.map((item) => {
                        return {
                            startDate: item.startDate,
                            endDate: item.endDate,
                            companyName: item.companyName,
                            siteName: item.siteName,
                            occupation: item.code.name,
                        };
                    })
                    : [],
                licenses: member.licenses
                    ? member.licenses.map((item) => {
                        return {
                            codeName: item.code.name,
                            licenseNumber: item.licenseNumber,
                        };
                    })
                    : [],
                occupations: member.licenses.map(item => item.code.name),
                basicHealthSafetyCertificate: member.basicHealthSafetyCertificate ? {
                    registrationNumber: member.basicHealthSafetyCertificate.registrationNumber,
                    dateOfCompletion: member.basicHealthSafetyCertificate.dateOfCompletion,
                    file: {
                        fileName: member.basicHealthSafetyCertificate.file.fileName,
                        type: member.basicHealthSafetyCertificate.file.type,
                        key: member.basicHealthSafetyCertificate.file.key,
                        size: Number(member.basicHealthSafetyCertificate.file.size),
                    },
                } : null,
                isChecked,
            };
        }
        else {
            return {
                name: member.name,
                username: member.account.username,
                contact: null,
                email: null,
                district: {
                    englishName: member.region ? member.region.districtEnglishName : null,
                    koreanName: member.region ? member.region.districtKoreanName : null,
                },
                city: {
                    englishName: member.region ? member.region.cityEnglishName : null,
                    koreanName: member.region ? member.region.cityKoreanName : null,
                },
                desiredSalary: member.desiredSalary,
                totalExperienceYears: member.totalExperienceYears,
                totalExperienceMonths: member.totalExperienceMonths,
                careers: member.careers
                    ? member.careers.map(() => {
                        return {
                            startDate: null,
                            endDate: null,
                            companyName: null,
                            siteName: null,
                            occupation: null,
                        };
                    })
                    : [],
                licenses: member.licenses
                    ? member.licenses.map(() => {
                        return {
                            codeName: null,
                            licenseNumber: null,
                        };
                    })
                    : [],
                occupations: member.licenses.map(item => item.code.name),
                basicHealthSafetyCertificate: member.basicHealthSafetyCertificate ? {
                    registrationNumber: null,
                    dateOfCompletion: null,
                    file: {
                        fileName: null,
                        type: null,
                        key: null,
                        size: null,
                    },
                } : null,
                isChecked,
            }
        }
    }

    async countWorkers(accountId: number): Promise<MemberCompanyCountWorkersResponse> {
        const workers = await this.prismaService.member.count({
            where: {
                applications: {
                    some: {
                        post: {
                            company: {
                                accountId: accountId,
                            },
                        },
                        contract: {
                            startDate: {
                                lte: new Date(),
                            },
                            endDate: {
                                gte: new Date(),
                            },
                        },
                    },
                },
            },
        });
        return { countWorkers: workers };
    }

    async checkMember(accountId: number, id: number, body: MemberCompanyCheckMemberRequest): Promise<void> {
        const member = await this.prismaService.member.count({
            where: {
                isActive: true,
                id,
            },
        });
        if (!member) throw new NotFoundException(Error.MEMBER_NOT_FOUND);

        const memberInformationRequest = await this.prismaService.memberInformationRequest.count({
            where: {
                memberId: id,
                company: {
                    accountId: accountId,
                },

            },
        });

        if (memberInformationRequest) throw new NotFoundException(Error.MEMBER_ALREADY_CHECKED);

        const productPaymentHistory = await this.prismaService.productPaymentHistory.findFirst({
            where: {
                id: body.productPaymentHistoryId,
                product: {
                    productType: ProductType.WORKER_VERIFICATION,
                },
                status: PaymentStatus.COMPLETE,
                remainingTimes: { gt: 0 },
                expirationDate: { gt: new Date() },
                OR: [{ refund: null }, { refund: { NOT: { status: RefundStatus.APPROVED } } }],
                company: {
                    accountId,
                },
            },
            select: {
                id: true,
                remainingTimes: true,
                expirationDate: true,
            },
        });

        if (!productPaymentHistory) {
            throw new NotFoundException(Error.PRODUCT_NOT_FOUND);
        }

        await this.prismaService.$transaction(async (tx) => {
            await tx.memberInformationRequest.create({
                data: {
                    member: {
                        connect: {
                            id,
                        },
                    },
                    company: {
                        connect: {
                            accountId,
                        },
                    },
                    usageHistory: {
                        create: {
                            productPaymentHistoryId: productPaymentHistory.id,
                            expirationDate: productPaymentHistory.expirationDate,
                            remainNumbers: productPaymentHistory.remainingTimes - 1,
                        }
                    },
                },
            });

            await tx.productPaymentHistory.update({
                where: {
                    id: productPaymentHistory.id,
                },
                data: {
                    remainingTimes: productPaymentHistory.remainingTimes - 1,
                },
            });
        })
    }
}
