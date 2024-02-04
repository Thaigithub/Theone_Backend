import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { AccountCompanySignupRequest } from './request/account-company-signup.request';
import { AccountCompanyUpdateRequest } from './request/account-company-update.request';
import { AccountCompanyCheckExistedResponse } from './response/account-company-check-existed.response';
import { AccountCompanyGetDetailResponse } from './response/account-company-get-detail.response';
@Injectable()
export class AccountCompanyService {
    constructor(private prismaService: PrismaService) {}

    async checkBusinessRegNum(businessRegNumber: string): Promise<AccountCompanyCheckExistedResponse> {
        const count = await this.prismaService.company.count({
            where: {
                businessRegNumber: businessRegNumber,
            },
        });
        if (count === 0) return { isExist: false };
        return { isExist: true };
    }

    async checkUsername(username: string): Promise<AccountCompanyCheckExistedResponse> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
            },
        });
        if (accountNum === 0) return { isExist: false };
        return { isExist: true };
    }

    async signup(request: AccountCompanySignupRequest): Promise<void> {
        const userIdCount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (userIdCount !== 0) throw new BadRequestException(Error.USERNAME_EXISTED);
        const businessRegNumCount = await this.prismaService.company.count({
            where: {
                businessRegNumber: request.businessRegNum,
            },
        });
        if (businessRegNumCount !== 0) throw new BadRequestException(Error.BUSSINESS_REGISTRATION_NUMBER_EXISTED);
        const corporateRegNumCount = await this.prismaService.company.count({
            where: {
                corporateRegNumber: request.corporateRegNum,
            },
        });
        if (corporateRegNumCount !== 0) throw new BadRequestException(Error.CORPORATE_REGISTRATION_NUMBER_EXISTED);
        const email = await this.prismaService.company.count({
            where: {
                email: request.email,
            },
        });
        if (email !== 0) throw new BadRequestException(Error.EMAIL_EXISTED);
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
                                fileName: request.logo.fileName,
                                type: request.logo.type,
                                size: request.logo.size,
                                key: request.logo.key,
                            },
                        },
                        contactCard: {
                            create: {
                                fileName: request.contactCard.fileName,
                                type: request.contactCard.type,
                                size: request.contactCard.size,
                                key: request.contactCard.key,
                            },
                        },
                    },
                },
            },
        });
    }

    async getDetail(accountId: number): Promise<AccountCompanyGetDetailResponse> {
        const company = await this.prismaService.company.findUnique({
            where: {
                accountId,
                isActive: true,
            },
            include: {
                account: true,
                attachments: {
                    select: {
                        file: true,
                    },
                },
                logo: true,
                contactCard: true,
            },
        });
        if (!company) throw new NotFoundException(Error.COMPANY_NOT_FOUND);

        return {
            id: company.account.username,
            email: company.email,
            contactName: company.contactName,
            phone: company.phone,
            contactPhone: company.contactPhone,
            name: company.name,
            estDate: company.estDate,
            presentativeName: company.presentativeName,
            address: company.address,
            type: company.type,
            businessRegNumber: company.businessRegNumber,
            corporateRegNumber: company.corporateRegNumber,
            attachments: company.attachments.map((item) => {
                return {
                    fileName: item.file.fileName,
                    type: item.file.type,
                    key: item.file.key,
                    size: Number(item.file.size),
                };
            }),
            logo: company.logo
                ? {
                      type: company.logo.type,
                      key: company.logo.key,
                      fileName: company.logo.fileName,
                      size: company.logo.size ? Number(company.logo.size) : null,
                  }
                : null,
            contactCard: company.contactCard
                ? {
                      type: company.contactCard.type,
                      key: company.contactCard.key,
                      fileName: company.contactCard.fileName,
                      size: company.contactCard.size ? Number(company.contactCard.size) : null,
                  }
                : null,
        };
    }

    async update(accountId: number, body: AccountCompanyUpdateRequest): Promise<void> {
        const companyEmailCount = await this.prismaService.company.count({
            where: {
                email: body.email,
                accountId: {
                    not: accountId,
                },
            },
        });
        if (companyEmailCount !== 0) throw new BadRequestException(Error.EMAIL_EXISTED);

        const userCount = await this.prismaService.account.count({
            where: {
                username: body.username,
                id: {
                    not: accountId,
                },
            },
        });
        if (userCount !== 0) throw new BadRequestException(Error.USERNAME_EXISTED);
        await this.prismaService.$transaction(async (tx) => {
            const listFile = (
                await tx.file.findMany({
                    where: {
                        attachment: {
                            company: {
                                accountId,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                })
            ).map((item) => item.id);
            await tx.attachment.deleteMany({
                where: {
                    company: {
                        accountId,
                    },
                },
            });
            await tx.file.deleteMany({
                where: {
                    id: {
                        in: listFile,
                    },
                },
            });
        });
        const files = await Promise.all(
            body.attachments.map(async (item) => {
                return (
                    await this.prismaService.file.create({
                        data: item,
                        select: {
                            id: true,
                        },
                    })
                ).id;
            }),
        );
        await this.prismaService.account.update({
            where: {
                id: accountId,
            },
            data: {
                username: body.username,
                company: {
                    update: {
                        name: body.name,
                        address: body.address,
                        estDate: new Date(body.estDate),
                        businessRegNumber: body.businessRegNum,
                        corporateRegNumber: body.corporateRegNum,
                        type: body.type,
                        email: body.email,
                        phone: body.phone,
                        contactPhone: body.contactPhone,
                        contactName: body.contactName,
                        presentativeName: body.presentativeName,
                        attachments: {
                            createMany: {
                                data: files.map((item) => {
                                    return {
                                        fileId: item,
                                    };
                                }),
                            },
                        },
                        logo: {
                            update: {
                                fileName: body.logo.fileName,
                                type: body.logo.type,
                                size: body.logo.size,
                                key: body.logo.key,
                            },
                        },
                        contactCard: {
                            update: {
                                fileName: body.logo.fileName,
                                type: body.logo.type,
                                size: body.logo.size,
                                key: body.logo.key,
                            },
                        },
                    },
                },
            },
        });
    }
}
