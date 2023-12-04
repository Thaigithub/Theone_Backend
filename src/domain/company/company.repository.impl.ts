import { Injectable } from '@nestjs/common';
import { $Enums, Company, Prisma } from '@prisma/client';
import { CompanyByEmail, CompanyRepository } from 'domain/company/company.repository';
import { CompanyDownloadRequest, CompanySearchRequest } from 'domain/company/request/admin-company.request';
import { CompanyDetailsResponse, CompanySearchResponse } from 'domain/company/response/company.response';
import { PrismaModel } from 'helpers/entity/prisma.model';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';
import { PrismaService } from '../../helpers/entity/prisma.service';
@Injectable()
export class CompanyRepositoryImpl extends BaseRepositoryImpl<Company> implements CompanyRepository {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService, PrismaModel.ACCOUNT);
    }
    async findByEmail(email: string): Promise<CompanyByEmail> {
        const company = await this.prismaService.company.findUnique({
            where: {
                email,
                isActive: true,
            },
            select: {
                account: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
        });
        return {
            id: company.account.id,
            type: company.account.type,
        };
    }
    async findOne(id: number): Promise<CompanyDetailsResponse> {
        return await this.prismaService.company.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                account: true,
            },
        });
    }
    async findRequest(request: CompanySearchRequest): Promise<CompanySearchResponse> {
        return new CompanySearchResponse(
            await this.prismaService.company.findMany({
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
            }),
        );
    }
    async countRequest(request: CompanySearchRequest): Promise<number> {
        return await this.prismaService.company.count({
            where: this.queryFormat(request),
        });
    }
    queryFormat(request: CompanySearchRequest): Prisma.CompanyWhereInput {
        return {
            account: {
                username: {
                    contains: request.id,
                },
                status: request.status,
            },
            phone: request.phone,
            name: request.name,
        } as Prisma.CompanyWhereInput;
    }
    async updateStatus(companyId: number, status: $Enums.AccountStatus): Promise<void> {
        await this.prismaService.account.update({
            where: {
                id: companyId,
                isActive: true,
            },
            data: { status: status },
        });
    }
    async findByIds(request: CompanyDownloadRequest): Promise<CompanyDetailsResponse[]> {
        return await this.prismaService.company.findMany({
            where: {
                id: {
                    in: request.companyIds,
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
    }
}
