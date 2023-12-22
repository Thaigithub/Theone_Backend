import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteMemberGetListRequest } from './request/site-member-get-list.request';
import { SiteMemberGetListResponse } from './response/site-member-get-list.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';

@Injectable()
export class SiteMemberService {
    constructor(private prismaService: PrismaService) {}

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

        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });

        if (!site) {
            throw new BadRequestException('Site does not exist');
        }

        //Check exist member - site
        //If exist, remove that record
        //Else, add that record
        const application = await this.prismaService.interest.findUnique({
            where: {
                memberId_siteId: {
                    memberId: account.member.id,
                    siteId: site.id,
                },
            },
        });

        if (application) {
            await this.prismaService.interest.delete({
                where: {
                    memberId_siteId: {
                        memberId: account.member.id,
                        siteId: site.id,
                    },
                },
            });

            return { isInterested: false };
        } else {
            await this.prismaService.interest.create({
                data: {
                    member: { connect: { id: account.member.id } },
                    site: { connect: { id: site.id } },
                },
            });

            return { isInterested: true };
        }
    }
    async getSiteList(query: SiteMemberGetListRequest): Promise<SiteMemberGetListResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            ...(query.name && { name: { contains: query.name, mode: 'insensitive' } }),
            addressCity: query.addressCity,
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
            const fileName = site.company.logo?.file.fileName;
            const key = site.company.logo?.file.key;
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
                fileNameLogo: fileName ? fileName : null,
                fileKeyLogo: key ? key : null,
            };
        });
        return new PaginationResponse(siteList, new PageInfo(siteListCount));
    }
}
