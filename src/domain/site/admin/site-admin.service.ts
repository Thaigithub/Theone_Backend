import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteStatus } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SiteAdminSearchCategory } from './dto/site-admin-category.dto';
import { SiteAdminGetListRequest } from './request/site-admin-get-list.request';
import { SiteAdminUpdateRequest } from './request/site-admin-update.request';
import { SiteAdminGetDetailResponse } from './response/site-admin-get-detail.response';
import { SiteAdminGetListResponse } from './response/site-admin-get-list.response';

@Injectable()
export class SiteAdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly excelService: ExcelService,
    ) {}

    async getList(query: SiteAdminGetListRequest): Promise<SiteAdminGetListResponse> {
        const queryFilter: Prisma.SiteWhereInput = {
            isActive: true,
            ...(query.contractStatus && { contractStatus: query.contractStatus }),
            ...(query.startDate && { startDate: { gte: new Date(query.startDate).toISOString() } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate).toISOString() } }),
            ...(!query.category && query.searchKeyword
                ? {
                      OR: [
                          { name: { contains: query.searchKeyword, mode: 'insensitive' } },
                          { company: { name: { contains: query.searchKeyword, mode: 'insensitive' } } },
                          { personInCharge: { contains: query.searchKeyword, mode: 'insensitive' } },
                      ],
                  }
                : {}),
            ...(query.category == SiteAdminSearchCategory.SITE_NAME && {
                name: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
            ...(query.category == SiteAdminSearchCategory.COMPANY_NAME && {
                company: { name: { contains: query.searchKeyword, mode: 'insensitive' } },
            }),
            ...(query.category == SiteAdminSearchCategory.REPRESENTATIVE_NAME && {
                personInCharge: { contains: query.searchKeyword, mode: 'insensitive' },
            }),
        };
        const sites = await this.prismaService.site.findMany({
            where: queryFilter,
            select: {
                id: true,
                name: true,
                contact: true,
                personInChargeContact: true,
                contractStatus: true,
                startDate: true,
                endDate: true,
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.site.count({
            where: queryFilter,
        });
        return new PaginationResponse(sites, new PageInfo(count));
    }

    async getDetails(id: number): Promise<SiteAdminGetDetailResponse> {
        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
                company: {
                    isActive: true,
                },
            },
            select: {
                company: {
                    select: {
                        name: true,
                    },
                },
                siteManagementNumber: true,
                name: true,
                address: true,
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
                contact: true,
                personInCharge: true,
                personInChargeContact: true,
                email: true,
                taxInvoiceEmail: true,
                startDate: true,
                endDate: true,
                contractStatus: true,
                status: true,
            },
        });
        if (!site) {
            throw new NotFoundException('The site id is not exist');
        }
        return site;
    }

    async updateStatus(id: number, body: SiteAdminUpdateRequest) {
        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                status: true,
            },
        });
        if (site.status !== body.status) {
            await this.prismaService.$transaction(async (prisma) => {
                await prisma.site.update({
                    where: {
                        id: id,
                        isActive: true,
                    },
                    data: {
                        status: body.status,
                    },
                });
                if (body.status === SiteStatus.SUSPENDED) {
                    if (!body.content) {
                        throw new BadRequestException('The reason for suspend must be filled');
                    }
                    await prisma.siteHistory.create({
                        data: {
                            content: body.content,
                            siteId: id,
                        },
                    });
                }
            });
        }
    }

    async download(query: number[], response: Response): Promise<void> {
        const ids = query.filter((element) => typeof element === 'number' && !isNaN(element));
        const sites = await this.prismaService.site.findMany({
            where: {
                id: { in: ids },
                isActive: true,
            },
            select: {
                name: true,
                contact: true,
                personInChargeContact: true,
                contractStatus: true,
                startDate: true,
                endDate: true,
            },
        });
        const excelStream = await await this.excelService.createExcelFile(sites, null);
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', `attachment; filename=SiteManagement.xlsx`);
        excelStream.pipe(response);
    }
}
