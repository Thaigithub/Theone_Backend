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
    async getSiteList(query: SiteMemberGetListRequest): Promise<SiteMemberGetListResponse> {
        const entireCity = await this.prismaService.district.findUnique({
            where: {
                id: query.districtId,
                englishName: 'All',
            },
        });

        const queryFilter: Prisma.SiteWhereInput = {
            ...(query.name && { name: { contains: query.name, mode: 'insensitive' } }),
            district: {
                id: !entireCity ? query.districtId : undefined,
                city: {
                    id: entireCity && entireCity.cityId,
                },
            },
            isActive: true,
        };
        const sites = await this.prismaService.site.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                startDate: true,
                endDate: true,
                personInCharge: true,
                personInChargeContact: true,
                contact: true,
                post: {
                    where: {
                        isActive: true,
                        isHidden: false,
                    },
                },
                company: {
                    select: {
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
                    },
                },
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
        });
        const siteListCount = await this.prismaService.site.count({
            where: queryFilter,
        });
        const siteList = sites.map((site) => {
            const countPost = site.post.length;
            const file = site.company.logo?.file;
            return {
                id: site.id,
                name: site.name,
                address: site.address,
                startDate: site.startDate,
                endDate: site.endDate,
                personInCharge: site.personInCharge,
                personInChargeContact: site.personInChargeContact,
                contact: site.contact,
                countPost: countPost,
                logoFileName: file?.fileName ? file.fileName : null,
                logoFileKey: file?.key ? file.key : null,
                logoFileType: file ? file.type : null,
                logoFileSize: file ? file.size : null,
            };
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
                logoFileName: siteRecord.company.logo ? siteRecord.company.logo.file.fileName : null,
                logoFileKey: siteRecord.company.logo ? siteRecord.company.logo.file.key : null,
                logoFileType: siteRecord.company.logo ? siteRecord.company.logo.file.type : null,
                logoFileSize: siteRecord.company.logo ? siteRecord.company.logo.file.size : null,
                contactName: siteRecord.company.contactName,
                presentativeName: siteRecord.company.presentativeName,
                email: siteRecord.company.email,
                contactPhone: siteRecord.company.contactPhone,
            },
        };
        return siteInfor;
    }
}
