import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, CodeType, MemberLevel, SignupMethodType } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'app.config';
import { hash } from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'services/prisma/prisma.service';
import { MemberAccountSignupRequest } from './request/account-member-signup.request';
import { MemberAccountSignupSnsRequest } from './request/account-member-signup.request-sns';
import { UpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { UpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { UpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { UpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberCheckUsernameExistenceResponse } from './response/account-member-check-exist-accountId.response';
import { MemberDetailResponse } from './response/account-member-get-detail.response';
import { AccountMemberGetDetailMyHomeReponse } from './response/account-member-get-detail-myhome.response';
import { AccountMemberUpdateInfoMyHomeRequest } from './request/account-member-update-info-myhome.request';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

@Injectable()
export class AccountMemberService {
    constructor(private prismaService: PrismaService) {}

    private async checkMemberExist(accountId: number): Promise<void> {
        const memberExist = await this.prismaService.member.count({
            where: {
                isActive: true,
                accountId,
            },
        });
        if (!memberExist) throw new NotFoundException('Member does not exist');
    }

    async signup(request: MemberAccountSignupRequest): Promise<void> {
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

    async accountMemberCheck(username: string): Promise<AccountMemberCheckUsernameExistenceResponse> {
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

    async accountRecommenderCheck(username: string): Promise<AccountMemberCheckUsernameExistenceResponse> {
        const accountNum = await this.prismaService.account.count({
            where: {
                username: username,
                type: AccountType.MEMBER,
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

    async signupSns(request: MemberAccountSignupSnsRequest): Promise<void> {
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

    async getDetail(id: number): Promise<MemberDetailResponse> {
        const memberExist = await this.prismaService.member.count({
            where: {
                id,
            },
        });

        if (!memberExist) throw new NotFoundException('Member does not exist');

        return await this.prismaService.member.findUnique({
            where: {
                isActive: true,
                id,
            },
            select: {
                name: true,
                contact: true,
                email: true,
                desiredOccupation: {
                    select: {
                        codeName: true,
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
    }

    async getDetailMyHome(accountId: number): Promise<AccountMemberGetDetailMyHomeReponse> {
        const member = await this.prismaService.member.findUnique({
            include: {
                account: true,
            },
            where: {
                accountId,
            },
        });

        if (!member) throw new NotFoundException('Member does not exist');

        return {
            name: member.name,
            username: member.account.username,
            email: member.email,
            contact: member.contact,
            level: member.level,
            registrationMethod: member.signupMethod,
            registrationDate: member.createdAt,
            totalExperienceYears: member.totalExperienceYears,
            totalExperienceMonths: member.totalExperienceMonths,
        };
    }

    async updateInfoMyHome(accountId: number, body: AccountMemberUpdateInfoMyHomeRequest): Promise<void> {
        await this.checkMemberExist(accountId);

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

    async upsertBankAccount(id: number, request: UpsertBankAccountRequest): Promise<void> {
        await this.checkMemberExist(id);

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

    async upsertHSTCertificate(id: number, request: UpsertHSTCertificateRequest): Promise<void> {
        await this.checkMemberExist(id);

        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                basicHealthSafetyCertificate: {
                    upsert: {
                        update: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            registrationNumber: request.registrationNumber,
                            dateOfCompletion: new Date(request.dateOfCompletion).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertForeignWorker(id: number, request: UpsertForeignWorkerRequest): Promise<void> {
        await this.checkMemberExist(id);

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
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            englishName: request.englishName,
                            serialNumber: request.serialNumber,
                            registrationNumber: request.registrationNumber,
                            dateOfIssue: new Date(request.dateOfIssue).toISOString(),
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async upsertDisability(id: number, request: UpsertDisabilityRequest): Promise<void> {
        await this.checkMemberExist(id);

        await this.prismaService.member.update({
            where: { accountId: id },
            data: {
                disability: {
                    upsert: {
                        update: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                update: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                        create: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledType,
                            file: {
                                create: {
                                    type: request.fileType,
                                    key: request.fileKey,
                                    size: request.fileSize,
                                    fileName: request.fileName,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async cancelMembership(accountId: number): Promise<void> {
        await this.checkMemberExist(accountId);

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
