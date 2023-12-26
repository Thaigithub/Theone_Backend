import { ConflictException, Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { AccountCompanySignupRequest } from './request/account-company-signup.request';
import { CompanyCompanyGetDetail } from './response/account-company-get-detail.response';
@Injectable()
export class AccountCompanyService {
    constructor(private prismaService: PrismaService) {}
    async checkBusinessRegNum(businessRegNumber: string): Promise<boolean> {
        const count = await this.prismaService.company.count({
            where: {
                businessRegNumber: businessRegNumber,
            },
        });
        if (count === 0) return true;
        return false;
    }
    async accountCompanyCheck(username: string): Promise<boolean> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
            },
        });
        if (accountNum === 0) return true;
        return false;
    }
    async signup(request: AccountCompanySignupRequest): Promise<void> {
        const userIdcount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (userIdcount !== 0) throw new ConflictException('UserId has been used');
        const bussinessRegNumcount = await this.prismaService.company.count({
            where: {
                businessRegNumber: request.businessRegNum,
            },
        });
        if (bussinessRegNumcount !== 0) throw new ConflictException('Business registration number has been used');
        const corporateRegNumcount = await this.prismaService.company.count({
            where: {
                corporateRegNumber: request.corporateRegNum,
            },
        });
        if (corporateRegNumcount !== 0) throw new ConflictException('Corporate registration number has been used');
        const email = await this.prismaService.company.count({
            where: {
                email: request.email,
            },
        });
        if (email !== 0) throw new ConflictException('Email has been used');
        await this.prismaService.account.create({
            data: {
                username: request.username,
                password: await hash(request.password, 10),
                type: AccountType.COMPANY,
                status: AccountStatus.APPROVED,
                company: {
                    create: {
                        name: request.name,
                        address: request.address,
                        longitude: request.longitude,
                        latitude: request.latitude,
                        estDate: new Date(request.estDate),
                        businessRegNumber: request.businessRegNum,
                        corporateRegNumber: request.corporateRegNum,
                        type: request.type,
                        email: request.email,
                        phone: request.phone,
                        presentativeName: request.presentativeName,
                        contactPhone: request.contactPhone,
                        contactName: request.contactName,
                        logo: {
                            create: {
                                file: {
                                    create: {
                                        fileName: request.logo.name,
                                        type: request.logo.type,
                                        size: request.logo.size,
                                        key: request.logo.key,
                                    },
                                },
                            },
                        },
                        contactCard: {
                            create: {
                                file: {
                                    create: {
                                        fileName: request.logo.name,
                                        type: request.logo.type,
                                        size: request.logo.size,
                                        key: request.logo.key,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async getDetail(accountId: number): Promise<CompanyCompanyGetDetail> {
        const company = await this.prismaService.company.findUnique({
            where: {
                accountId,
            },
            select: {
                name: true,
                logo: {
                    select: {
                        file: {
                            select: {
                                fileName: true,
                                key: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            name: company.name,
            logo: {
                fileName: company.logo.file.fileName,
                type: company.logo.file.type,
                key: company.logo.file.key,
            },
        };
    }
}
