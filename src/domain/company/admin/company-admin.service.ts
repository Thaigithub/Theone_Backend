import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SearchCategory } from './dto/company-admin-search-category.dto.request.dto';
import { AdminCompanyDownloadListRequest, AdminCompanyDownloadRequest } from './request/company-admin-download-list.request';
import { AdminCompanyGetListRequest } from './request/company-admin-get-list.request';
import { AdminCompanyUpdateEmailRequest } from './request/company-admin-update-email.request';
import { AdminCompanyUpdateStatusRequest } from './request/company-admin-update-status.request';
import { AdminCompanyGetDetailsResponse } from './response/company-admin-get-detail.response';
import { AdminCompanyGetListResponse } from './response/company-admin-get-list.response';
@Injectable()
export class AdminCompanyService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
    ) {}
    async getCompanies(request: AdminCompanyGetListRequest): Promise<AdminCompanyGetListResponse> {
        const search = {
            select: {
                id: true,
                name: true,
                account: {
                    select: {
                        username: true,
                        status: true,
                        createdAt: true,
                    },
                },
                address: true,
                businessRegNumber: true,
                corporateRegNumber: true,
                type: true,
                email: true,
                phone: true,
                presentativeName: true,
                contactName: true,
                contactPhone: true,
            },
            ...QueryPagingHelper.queryPaging(request),
        };
        switch (request.searchCategory) {
            case SearchCategory.NAME: {
                search['where'] = {
                    name: { contains: request.searchKeyword },
                    account: {
                        isActive: true,
                    },
                };
                break;
            }
            case SearchCategory.USERNAME: {
                search['where'] = {
                    account: {
                        username: {
                            contains: request.searchKeyword,
                        },
                        isActive: true,
                    },
                };
                break;
            }
            case SearchCategory.PHONE: {
                search['where'] = {
                    phone: {
                        contains: request.searchKeyword,
                    },
                    account: {
                        isActive: true,
                    },
                };
                break;
            }
            default: {
                search['where'] = {
                    account: {
                        isActive: true,
                    },
                };
            }
        }
        search['where']['type'] = request.type;
        const total = await this.prismaService.company.count({ where: search['where'] });
        return new PaginationResponse(
            (await this.prismaService.company.findMany(search)).map((item) => {
                return {
                    id: item.id,
                    regDate: item.account.createdAt,
                    name: item.name,
                    username: item.account.username,
                    type: item.type,
                    contactName: item.contactName,
                    contactPhone: item.contactPhone,
                };
            }),
            new PageInfo(total),
        );
    }

    async getDetails(CompanyId: number): Promise<AdminCompanyGetDetailsResponse> {
        const company = await this.prismaService.company.findUnique({
            where: {
                id: CompanyId,
                account: {
                    isActive: true,
                },
            },
            include: {
                account: true,
                sites: true,
            },
        });
        if (!company) throw new NotFoundException('Company id not found');
        else
            return {
                name: company.name,
                account: {
                    username: company.account.username,
                    status: company.account.status,
                },
                address: company.address,
                businessRegNumber: company.businessRegNumber,
                corporateRegNumber: company.corporateRegNumber,
                type: company.type,
                email: company.email,
                phone: company.phone,
                presentativeName: company.presentativeName,
                contactName: company.contactName,
                contactPhone: company.contactPhone,
                site: company.sites.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                }),
            };
    }
    async changeStatus(CompanyId: number, request: AdminCompanyUpdateStatusRequest): Promise<void> {
        await this.prismaService.company.update({
            where: {
                id: CompanyId,
                account: {
                    isActive: true,
                },
            },
            data: {
                account: {
                    update: {
                        status: request.status,
                    },
                },
            },
        });
    }
    async changeEmail(CompanyId: number, request: AdminCompanyUpdateEmailRequest): Promise<void> {
        await this.prismaService.company.update({
            where: {
                id: CompanyId,
                account: {
                    isActive: true,
                },
            },
            data: {
                email: request.email,
            },
        });
    }
    async download(request: AdminCompanyDownloadListRequest | AdminCompanyDownloadRequest, response: Response): Promise<void> {
        const list = [];
        if (Array.isArray(request)) {
            list.push(...request.map((item) => parseInt(item)));
        } else if (typeof request === 'string') {
            list.push(parseInt(request));
        }
        if (list.length === 0) throw new BadRequestException('Missing teamIds');

        const companies = await this.prismaService.company.findMany({
            where: {
                id: {
                    in: list,
                },
                account: {
                    isActive: true,
                },
            },
            select: {
                name: true,
                account: {
                    select: {
                        username: true,
                        status: true,
                    },
                },
                address: true,
                businessRegNumber: true,
                corporateRegNumber: true,
                type: true,
                email: true,
                phone: true,
                presentativeName: true,
                contactName: true,
                contactPhone: true,
            },
        });
        const fileReshape = companies.map((element) => {
            return {
                name: element.name,
                username: element.account.username,
                status: element.account.status,
                address: element.address,
                businessRegNumber: element.businessRegNumber,
                corporateRegNumber: element.corporateRegNumber,
                type: element.type,
                email: element.email,
                phone: element.phone,
                presentativeName: element.presentativeName,
                contactName: element.contactName,
                contactPhone: element.contactPhone,
            };
        });
        const excelStream = await this.excelService.createExcelFile(fileReshape, 'Company');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=CompanyList.xlsx');
        excelStream.pipe(response);
    }
}
