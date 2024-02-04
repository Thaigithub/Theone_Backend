import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { CompanyAdminGetListCategory } from './enum/company-admin-get-list-category.enum';
import { AdminCompanyDownloadRequest, CompanyAdminDownloadListRequest } from './request/company-admin-download-list.request';
import { CompanyAdminGetListRequest } from './request/company-admin-get-list.request';
import { ComapnyAdminGetListProductRequest } from './request/company-admin-product-get-list.request';
import { CompanyAdminUpdateEmailRequest } from './request/company-admin-update-email.request';
import { CompanyAdminUpdateStatusRequest } from './request/company-admin-update-status.request';
import { CompanyAdminGetDetailResponse } from './response/company-admin-get-detail.response';
import { CompanyAdminGetListProductResponse } from './response/company-admin-get-list-product.response';
import { CompanyAdminGetListResponse } from './response/company-admin-get-list.response';
@Injectable()
export class CompanyAdminService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
    ) {}
    async getCompanies(request: CompanyAdminGetListRequest): Promise<CompanyAdminGetListResponse> {
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
            case CompanyAdminGetListCategory.NAME: {
                search['where'] = {
                    name: { contains: request.searchKeyword },
                    account: {
                        isActive: true,
                    },
                };
                break;
            }
            case CompanyAdminGetListCategory.USERNAME: {
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
            case CompanyAdminGetListCategory.PHONE: {
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
    async getDetails(CompanyId: number): Promise<CompanyAdminGetDetailResponse> {
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
        if (!company) throw new NotFoundException(Error.COMPANY_NOT_FOUND);
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
    async changeStatus(CompanyId: number, request: CompanyAdminUpdateStatusRequest): Promise<void> {
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
    async changeEmail(CompanyId: number, request: CompanyAdminUpdateEmailRequest): Promise<void> {
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
    async download(request: CompanyAdminDownloadListRequest | AdminCompanyDownloadRequest, response: Response): Promise<void> {
        const list = [];
        if (Array.isArray(request)) {
            list.push(...request.map((item) => parseInt(item)));
        } else if (typeof request === 'string') {
            list.push(parseInt(request));
        }
        if (list.length === 0) return;

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
    async getListCompany(query: ComapnyAdminGetListProductRequest): Promise<CompanyAdminGetListProductResponse> {
        const queryFilter: Prisma.CompanyWhereInput = {
            isActive: true,
            name: { contains: query.keyword, mode: 'insensitive' },
            productPaymentHistories: {
                some: {},
            },
        };
        const companies = await this.prismaService.company.findMany({
            include: {
                productPaymentHistories: true,
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
        });
        const list = companies.map((item) => {
            return {
                id: item.id,
                companyName: item.name,
                manager: item.presentativeName,
                contact: item.contactPhone,
                totalPaymentAmount: item.productPaymentHistories.reduce((total, item) => {
                    return total + item.cost;
                }, 0),
            };
        });
        const total = await this.prismaService.company.count({
            where: queryFilter,
        });
        return new PaginationResponse(list, new PageInfo(total));
    }
    async getCompanyInformation(companyId: number) {
        const companyExist = await this.prismaService.productPaymentHistory.findFirst({
            where: {
                isActive: true,
                companyId,
            },
        });
        if (!companyExist) throw new NotFoundException(Error.COMPANY_NOT_FOUND);

        const company = await this.prismaService.company.findUnique({
            include: {
                productPaymentHistories: true,
            },
            where: {
                isActive: true,
                id: companyId,
                productPaymentHistories: {
                    some: {},
                },
            },
        });
        return {
            companyName: company.name,
            manager: company.presentativeName,
            contact: company.contactPhone,
            totalPaymentAmount: company.productPaymentHistories.reduce((total, item) => {
                return total + item.cost;
            }, 0),
        };
    }
}
