import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RegionService } from 'domain/region/region.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteMemberGetListRequest } from './request/site-member-get-list.request';
import { SiteMemberGetDetailResponse } from './response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from './response/site-member-get-list.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';

@Injectable()
export class SiteMemberService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly regionService: RegionService,
    ) {}
    async checkExist(id: number) {
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

    async updateInterest(accountId: number, id: number): Promise<SiteMemberUpdateInterestResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        await this.checkExist(id);

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

    async getList(accountId: number | undefined, query: SiteMemberGetListRequest): Promise<SiteMemberGetListResponse> {
        const { districtsList, citiesList } = await this.regionService.parseFromRegionList(query.regionList);
        const queryFilter: Prisma.SiteWhereInput = {
            ...(query.keyword && { name: { contains: query.keyword, mode: 'insensitive' } }),
            ...(query.regionList && {
                OR: [
                    districtsList.length
                        ? {
                              district: { id: { in: districtsList } },
                          }
                        : {},
                    citiesList.length
                        ? {
                              district: { cityId: { in: citiesList } },
                          }
                        : {},
                ],
            }),
            isActive: true,
        };
        const sites = (
            await this.prismaService.site.findMany({
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(query),
                select: {
                    id: true,
                    name: true,
                    company: {
                        select: {
                            logo: {
                                select: {
                                    file: {
                                        select: {
                                            fileName: true,
                                            key: true,
                                            size: true,
                                            type: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    district: {
                        select: {
                            koreanName: true,
                            englishName: true,
                            city: {
                                select: {
                                    koreanName: true,
                                    englishName: true,
                                },
                            },
                        },
                    },
                    status: true,
                    post: {
                        where: {
                            isActive: true,
                            isHidden: false,
                        },
                        select: {
                            id: true,
                            name: true,
                            isPulledUp: true,
                            occupation: true,
                            endDate: true,
                        },
                    },
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
                    longitude: true,
                    latitude: true,
                    startDate: true,
                    endDate: true,
                },
            })
        ).map((item) => {
            return {
                id: item.id,
                name: item.name,
                dictrict: {
                    englishName: item.district.englishName,
                    koreanName: item.district.koreanName,
                },
                city: {
                    englishName: item.district.city.englishName,
                    koreanName: item.district.city.koreanName,
                },
                file: item.company.logo
                    ? {
                          fileName: item.company.logo.file.fileName,
                          size: Number(item.company.logo.file.size),
                          type: item.company.logo.file.type,
                          key: item.company.logo.file.key,
                      }
                    : null,
                posts: query.numberOfPost
                    ? item.post
                          .map((post) => {
                              return {
                                  id: post.id,
                                  name: post.name,
                                  isPulledUp: post.isPulledUp,
                                  endDate: post.endDate,
                                  occupationName: post.occupation?.codeName || null,
                              };
                          })
                          .slice(0, query.numberOfPost)
                    : item.post.map((post) => {
                          return {
                              id: post.id,
                              name: post.name,
                              isPulledUp: post.isPulledUp,
                              endDate: post.endDate,
                              occupationName: post.occupation?.codeName || null,
                          };
                      }),
                countPost: item.post.length,
                isInterested: accountId && item.interestMember.length > 0 ? true : false,
                status: item.status,
                longitude: item.longitude,
                latitude: item.latitude,
                startDate: item.startDate,
                endDate: item.endDate,
            };
        });
        const siteListCount = await this.prismaService.site.count({
            where: queryFilter,
        });
        return new PaginationResponse(sites, new PageInfo(siteListCount));
    }

    async getDetail(accountId: number, id: number): Promise<SiteMemberGetDetailResponse> {
        await this.checkExist(id);
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
        });
        if (!siteRecord) {
            throw new NotFoundException('The site id is not found');
        }

        const siteInfor = {
            site: {
                id: siteRecord.id,
                name: siteRecord.name,
                address: siteRecord.address,
                isInterested: siteRecord.interestMember.length > 0 && accountId ? true : false,
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
