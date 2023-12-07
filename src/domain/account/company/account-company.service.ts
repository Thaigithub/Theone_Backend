import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { CompanyAccountSignupRequest } from './request/account-company-signup.request';
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
    async signup(request: CompanyAccountSignupRequest): Promise<void> {
        const userIdcount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (userIdcount !== 0) throw new BadRequestException('UserId has been used');
        const bussinessRegNumcount = await this.prismaService.company.count({
            where: {
                businessRegNumber: request.businessRegNum,
            },
        });
        if (bussinessRegNumcount !== 0) throw new BadRequestException('UserId has been used');
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
}
