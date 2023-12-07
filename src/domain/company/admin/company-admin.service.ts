import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
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
        const search = await this.prismaService.company.findMany({
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
            where: this.queryFormat(request),
            take: request.pageSize && parseInt(request.pageSize),
            skip: request.pageNumber && (parseInt(request.pageNumber) - 1) * parseInt(request.pageSize),
        });
        const total = await this.prismaService.company.count({
            where: this.queryFormat(request),
        });
        return new PaginationResponse(search, new PageInfo(total));
    }
    queryFormat(request: AdminCompanyGetListRequest): Prisma.CompanyWhereInput {
        return {
            account: {
                username: {
                    contains: request.id,
                },
                status: request.status,
                isActive: true,
            },
            phone: request.phone,
            name: request.name,
        } as Prisma.CompanyWhereInput;
    }
    async getDetails(CompanyId: number): Promise<AdminCompanyGetDetailsResponse> {
        return await this.prismaService.company.findUnique({
            where: {
                id: CompanyId,
                account: {
                    isActive: true,
                },
            },
            include: {
                account: true,
            },
        });
    }
    async changeStatus(CompanyId: number, request: AdminCompanyUpdateStatusRequest): Promise<void> {
        await this.prismaService.account.update({
            where: {
                id: CompanyId,
                isActive: true,
            },
            data: { status: request.status },
        });
    }
    async changeEmail(CompanyId: number, request: AdminCompanyUpdateEmailRequest): Promise<void> {
        await this.prismaService.account.update({
            where: {
                id: CompanyId,
                isActive: true,
            },
            data: {
                company: {
                    update: {
                        email: request.email,
                    },
                },
            },
        });
    }
    async download(request: AdminCompanyDownloadListRequest | AdminCompanyDownloadRequest, response: Response): Promise<void> {
        let list = [];
        if (Array.isArray(request)) {
            list = request.map((item) => parseInt(item));
        } else if (typeof request === 'string') {
            list.push(parseInt(request));
        }
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
