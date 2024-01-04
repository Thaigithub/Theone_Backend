import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, CodeType, MemberLevel, SignupMethodType } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'app.config';
import { hash } from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'services/prisma/prisma.service';
import { AccountMemberSignupSnsRequest } from './request/account-member-signup-sns.request';
import { AccountMemberSignupRequest } from './request/account-member-signup.request';
import { AccountMemberUpdateRequest } from './request/account-member-update.request';
import { AccountMemberUpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { AccountMemberUpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { AccountMemberUpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { AccountMemberUpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberCheckExistedResponse } from './response/account-member-check-exist-accountId.response';
import { AccountMemberGetBankDetailResponse } from './response/account-member-get-bank-detail.response';
import { AccountMemberGetDetailResponse } from './response/account-member-get-detail.response';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

@Injectable()
export class AccountMemberService {
    constructor(private prismaService: PrismaService) {}
    async signup(request: AccountMemberSignupRequest): Promise<void> {
        if (request.recommenderId !== undefined) {
            const numRecommender = await this.prismaService.account.count({
                where: {
                    username: request.recommenderId,
                },
            });
            if (numRecommender !== 1) throw new NotFoundException('Recommender userId not found');
        }
        const numAccount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (numAccount !== 0) throw new ConflictException('UserId has been used');
        await this.prismaService.account.create({
            data: {
                username: request.username,
                password: await hash(request.password, 10),
                type: AccountType.MEMBER,
                status: AccountStatus.APPROVED,
                member: {
                    create: {
                        name: request.name,
                        level: MemberLevel.THIRD,
                        signupMethod: SignupMethodType.GENERAL,
                    },
                },
            },
        });
    }

    async usernameCheck(username: string): Promise<AccountMemberCheckExistedResponse> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
            },
        });
        if (accountNum === 0)
            return {
                isExist: false,
            };
        return {
            isExist: true,
        };
    }

    async signupSns(request: AccountMemberSignupSnsRequest): Promise<void> {
        const payload = (
            await googleClient.verifyIdToken({
                idToken: request.idToken,
                audience: GOOGLE_CLIENT_ID,
            })
        ).getPayload();

        if (request.recommenderId !== undefined) {
            const numRecommender = await this.prismaService.account.count({
                where: {
                    username: request.recommenderId,
                },
            });
            if (numRecommender !== 1) throw new NotFoundException('Recommender userId not found');
        }
        const numAccount = await this.prismaService.account.count({
            where: {
                member: {
                    email: payload.email,
                },
            },
        });
        if (numAccount !== 0) throw new ConflictException('Email has been used');
        if (request.signupMethod === SignupMethodType.GENERAL) throw new BadRequestException('Wrong signupMethod');
        await this.prismaService.account.create({
            data: {
                username: await hash(payload.email, 10),
                password: await hash(payload.email, 10),
                type: AccountType.MEMBER,
                status: AccountStatus.APPROVED,
                member: {
                    create: {
                        email: payload.email,
                        name: payload.name,
                        level: MemberLevel.THIRD,
                        signupMethod: request.signupMethod,
                    },
                },
            },
        });
    }

    async findIdByAccountId(id: number): Promise<number> {
        const result = await this.prismaService.member.findUnique({
            where: {
                accountId: id,
            },
            select: {
                id: true,
            },
        });
        return result.id;
    }

    async getDetail(id: number): Promise<AccountMemberGetDetailResponse> {
        const member = await this.prismaService.member.findUnique({
            where: {
                isActive: true,
                id,
            },
            select: {
                totalExperienceMonths: true,
                totalExperienceYears: true,
                name: true,
                contact: true,
                email: true,
                desiredOccupation: {
                    select: {
                        codeName: true,
                        id: true,
                    },
                },
                level: true,
                signupMethod: true,
                createdAt: true,
                withdrawnDate: true,
                account: {
                    select: {
                        username: true,
                        status: true,
                    },
                },
                bankAccount: {
                    select: {
                        accountHolder: true,
                        accountNumber: true,
                        bankName: true,
                        createdAt: true,
                    },
                },
                foreignWorker: {
                    select: {
                        englishName: true,
                        registrationNumber: true,
                        serialNumber: true,
                        dateOfIssue: true,
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                size: true,
                                type: true,
                            },
                        },
                    },
                },
                disability: {
                    select: {
                        disableType: true,
                        disableLevel: true,
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                size: true,
                                type: true,
                            },
                        },
                    },
                },
                basicHealthSafetyCertificate: {
                    select: {
                        registrationNumber: true,
                        dateOfCompletion: true,
                        file: {
                            select: {
                                key: true,
                                fileName: true,
                                size: true,
                                type: true,
                            },
                        },
                    },
                },
                teams: {
                    select: {
                        team: {
                            select: {
                                name: true,
                                code: {
                                    select: {
                                        id: true,
                                        codeName: true,
                                        code: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const { foreignWorker, disability, basicHealthSafetyCertificate, ...rest } = member;
        return {
            ...rest,
            foreignWorker: {
                englishName: foreignWorker.englishName,
                registrationNumber: foreignWorker.registrationNumber,
                serialNumber: foreignWorker.serialNumber,
                dateOfIssue: foreignWorker.dateOfIssue,
                file: {
                    fileName: foreignWorker.file.fileName,
                    type: foreignWorker.file.type,
                    key: foreignWorker.file.key,
                    size: Number(foreignWorker.file.size),
                },
            },
            disability: {
                disableType: disability.disableType,
                disableLevel: disability.disableLevel,
                file: {
                    fileName: disability.file.fileName,
                    type: disability.file.type,
                    key: disability.file.key,
                    size: Number(disability.file.size),
                },
            },
            basicHealthSafetyCertificate: {
                registrationNumber: basicHealthSafetyCertificate.registrationNumber,
                dateOfCompletion: basicHealthSafetyCertificate.dateOfCompletion,
                file: {
                    fileName: basicHealthSafetyCertificate.file.fileName,
                    type: basicHealthSafetyCertificate.file.type,
                    key: basicHealthSafetyCertificate.file.key,
                    size: Number(basicHealthSafetyCertificate.file.size),
                },
            },
        };
    }

    async update(accountId: number, body: AccountMemberUpdateRequest): Promise<void> {
        if (body.occupation) {
            const validCode = await this.prismaService.code.findUnique({
                where: {
                    isActive: true,
                    id: body.occupation,
                    codeType: CodeType.GENERAL,
                },
            });

            if (!validCode) throw new BadRequestException('Occupation (Code Number) is invalid');
        }

        await this.prismaService.member.update({
            data: {
                desiredSalary: body.desiredSalary,
                codeId: body.occupation,
            },
            where: {
                accountId,
            },
        });
    }

    async upsertBankAccount(id: number, request: AccountMemberUpsertBankAccountRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                bankAccount: {
                    upsert: {
                        update: {
                            accountHolder: request.accountHolder,
                            accountNumber: request.accountNumber,
                            bankName: request.bankName,
                        },
                        create: {
                            accountHolder: request.accountHolder,
                            accountNumber: request.accountNumber,
                            bankName: request.bankName,
                        },
                    },
                },
            },
        });
    }

    async getBankAccount(accountId: number): Promise<AccountMemberGetBankDetailResponse> {
        return await this.prismaService.bankAccount.findFirst({
            where: {
                member: {
                    accountId: accountId,
                    isActive: true,
                },
                isActive: true,
            },
            select: {
                id: true,
                accountHolder: true,
                bankName: true,
                accountNumber: true,
            },
        });
    }

    async upsertHSTCertificate(id: number, request: AccountMemberUpsertHSTCertificateRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                basicHealthSafetyCertificate: {
                    upsert: {
                        update: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                update: request.file,
                            },
                        },
                        create: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                create: request.file,
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertForeignWorker(id: number, request: AccountMemberUpsertForeignWorkerRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                foreignWorker: {
                    upsert: {
                        update: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                update: request.file,
                            },
                        },
                        create: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                create: request.file,
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertDisability(id: number, request: AccountMemberUpsertDisabilityRequest): Promise<void> {
        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                disability: {
                    upsert: {
                        update: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                update: request.file,
                            },
                        },
                        create: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                create: request.file,
                            },
                        },
                    },
                },
            },
        });
    }

    async cancelMembership(accountId: number): Promise<void> {
        await this.prismaService.member.update({
            data: {
                isActive: false,
            },
            where: {
                accountId,
            },
        });

        await this.prismaService.bankAccount.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.basicHealthSafetyCertificate.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.career.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.certificate.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.disability.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.foreignWorker.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.memberEvaluation.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.membersOnTeams.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });

        await this.prismaService.teamMemberInvitation.updateMany({
            data: {
                isActive: false,
            },
            where: {
                member: {
                    accountId,
                },
            },
        });
    }
}
