import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteMemberGetListRequest } from './request/site-member-get-list.request';
import { SiteMemberGetDetailResponse } from './response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from './response/site-member-get-list.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';

@Injectable()
export class SiteMemberService {
    constructor(private prismaService: PrismaService) {}
    async checkExistSite(id: number) {
        const siteRecord = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });
        if (!siteRecord) {
            throw new NotFoundException('The Site Id is not found');
        }
        return siteRecord;
    }
    async updateInterestSite(accountId: number, id: number): Promise<SiteMemberUpdateInterestResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        await this.checkExistSite(id);

        //Check exist member - site
        //If exist, remove that record
        //Else, add that record
        const application = await this.prismaService.interest.findUnique({
            where: {
                memberId_siteId: {
                    memberId: account.member.id,
                    siteId: id,
                },
            },
        });

        if (application) {
            await this.prismaService.interest.delete({
                where: {
                    memberId_siteId: {
                        memberId: account.member.id,
                        siteId: id,
                    },
                },
            });

            return { isInterested: false };
        } else {
            await this.prismaService.interest.create({
                data: {
                    member: { connect: { id: account.member.id } },
                    site: { connect: { id: id } },
                },
            });

            return { isInterested: true };
        }
    }
    async getSiteList(accountId: number, query: SiteMemberGetListRequest): Promise<SiteMemberGetListResponse> {
        const entireCity = await (async () => {
            if (!query.districtId) {
                return null;
            }
            return await this.prismaService.district.findUnique({
                where: {
                    id: query.districtId,
                    englishName: 'All',
                },
            });
        })();

        const queryFilter: Prisma.SiteWhereInput = {
            ...(query.name && { name: { contains: query.name, mode: 'insensitive' } }),
            ...(query.districtId &&
                entireCity && {
                    district: {
                        city: {
                            id: entireCity.id,
                        },
                    },
                }),
            ...(query.districtId &&
                !entireCity && {
                    district: {
                        id: query.districtId,
                    },
                }),
            isActive: true,
        };
        const sites = await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                numberOfWorkers: true,
                interestMember: {
                    where: {
                        member: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                    select: {
                        id: true,
                    },
                    take: 1,
                },
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
        });
        const siteList = sites.map((item) => {
            return {
                id: item.id,
                name: item.name,
                startDate: item.startDate,
                endDate: item.endDate,
                numberOfWorkers: item.numberOfWorkers,
                interestId: item.interestMember.length > 0 ? item.interestMember[0].id : null,
            };
        });
        const siteListCount = await this.prismaService.site.count({
            where: queryFilter,
        });
        return new PaginationResponse(siteList, new PageInfo(siteListCount));
    }
    async getSiteDetail(accountId: number, id: number): Promise<SiteMemberGetDetailResponse> {
        await this.checkExistSite(id);
        const siteRecord = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                address: true,
                startDate: true,
                endDate: true,
                personInCharge: true,
                personInChargeContact: true,
                contact: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        logo: {
                            select: {
                                file: {
                                    select: {
                                        fileName: true,
                                        key: true,
                                        type: true,
                                        size: true,
                                    },
                                },
                            },
                        },
                        contactName: true,
                        presentativeName: true,
                        email: true,
                        contactPhone: true,
                    },
                },
            },
        });
        const member = await this.prismaService.member.findUnique({
            where: { accountId: accountId },
            include: { interestSites: true },
        });

        const siteInfor = {
            site: {
                id: siteRecord.id,
                name: siteRecord.name,
                address: siteRecord.address,
                isInterest: member ? member.interestSites.some((interest) => interest.siteId === id) : false,
                startDate: siteRecord.startDate,
                endDate: siteRecord.endDate,
                personInCharge: siteRecord.personInCharge,
                personInChargeContact: siteRecord.personInChargeContact,
                contact: siteRecord.contact,
            },
            company: {
                id: siteRecord.company.id,
                name: siteRecord.company.name,
                address: siteRecord.company.address,
                logoFile: siteRecord.company.logo
                    ? {
                          fileName: siteRecord.company.logo.file.fileName,
                          key: siteRecord.company.logo.file.key,
                          type: siteRecord.company.logo.file.type,
                          size: Number(siteRecord.company.logo.file.size),
                      }
                    : null,

                contactName: siteRecord.company.contactName,
                presentativeName: siteRecord.company.presentativeName,
                email: siteRecord.company.email,
                contactPhone: siteRecord.company.contactPhone,
            },
        };
        return siteInfor;
    }
}
