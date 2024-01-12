import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, MemberLevel, OtpType, SignupMethodType } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'app.config';
import { compare, hash } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'services/prisma/prisma.service';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberChangePasswordRequest } from './request/account-member-change-password.request';
import { AccountMemberSendOtpVerifyPhoneRequest } from './request/account-member-send-otp-verify-phone.request';
import { AccountMemberSignupSnsRequest } from './request/account-member-signup-sns.request';
import { AccountMemberSignupRequest } from './request/account-member-signup.request';
import { AccountMemberUpdateRequest } from './request/account-member-update.request';
import { AccountMemberUpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { AccountMemberUpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { AccountMemberUpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { AccountMemberUpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberVerifyOtpVerifyPhoneRequest } from './request/account-member-verify-otp.request';
import { AccountMemberCheckExistedResponse } from './response/account-member-check-existed.response';
import { AccountMemberGetBankDetailResponse } from './response/account-member-get-bank-detail.response';
import { AccountMemberGetDetailResponse } from './response/account-member-get-detail.response';
import { AccountMemberSendOtpVerifyPhoneResponse } from './response/account-member-send-otp-verify-phone.response';
import { AccountMemberVerifyOtpVerifyPhoneResponse } from './response/account-member-verify-otp.response';
import { OtpStatus } from 'domain/otp/response/otp-verify.response';
import { ChangePasswordStatus } from './dto/account-member-change-password-status.enum';
import { AccountMemberChangePasswordResponse } from './response/account-member-change-password.response';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

@Injectable()
export class AccountMemberService {
    constructor(
        private prismaService: PrismaService,
        private otpService: OtpService,
    ) {}

    async verifyOtpVerifyPhone(
        ip: string,
        accountId: number,
        body: AccountMemberVerifyOtpVerifyPhoneRequest,
    ): Promise<AccountMemberVerifyOtpVerifyPhoneResponse> {
        const verify = await this.otpService.checkValidOtp(body, ip);
        if (verify.isVerified) {
            await this.prismaService.member.update({
                where: {
                    accountId,
                },
                data: {
                    contact: verify.data,
                    isContactVerfied: true,
                },
            });
            verify.data = null;
            return verify;
        }
        verify.data = null;
        return verify;
    }

    async sendOtpVerifyPhone(
        ip: string,
        accountId: number,
        body: AccountMemberSendOtpVerifyPhoneRequest,
    ): Promise<AccountMemberSendOtpVerifyPhoneResponse | BaseResponse<void>> {
        if (accountId) {
            const isValidPhone = await this.prismaService.account.findUnique({
                where: {
                    isActive: true,
                    id: accountId,
                    type: AccountType.MEMBER,
                    member: {
                        contact: body.phone,
                    },
                },
            });
            if (!isValidPhone) return BaseResponse.error('Incorrect phone number') as BaseResponse<void>;
        }
        return (await this.otpService.sendOtp({
            email: null,
            phoneNumber: body.phone,
            type: OtpType.PHONE,
            ip: ip,
            data: body.phone,
        })) as AccountMemberSendOtpVerifyPhoneResponse;
    }

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

    async getDetail(accountId: number): Promise<AccountMemberGetDetailResponse> {
        const member = await this.prismaService.member.findUnique({
            where: {
                isActive: true,
                accountId,
            },
            include: {
                desiredOccupations: {
                    include: {
                        code: true,
                    },
                },
                account: true,
                bankAccount: true,
                foreignWorker: {
                    include: {
                        file: true,
                    },
                },
                disability: true,
                basicHealthSafetyCertificate: {
                    include: {
                        file: true,
                    },
                },
                teams: {
                    include: {
                        team: {
                            include: {
                                code: true,
                            },
                        },
                    },
                },
            },
        });
        const { desiredOccupations, foreignWorker, disability, basicHealthSafetyCertificate, ...rest } = member;
        return {
            ...rest,
            desiredOccupations: desiredOccupations
                ? desiredOccupations.map((item) => {
                      return {
                          id: item.codeId,
                          codeName: item.code.codeName,
                      };
                  })
                : [],
            foreignWorker: {
                englishName: foreignWorker ? foreignWorker.englishName : null,
                registrationNumber: foreignWorker ? foreignWorker.registrationNumber : null,
                serialNumber: foreignWorker ? foreignWorker.serialNumber : null,
                dateOfIssue: foreignWorker ? foreignWorker.dateOfIssue : null,
                file: {
                    fileName: foreignWorker ? foreignWorker.file.fileName : null,
                    type: foreignWorker ? foreignWorker.file.type : null,
                    key: foreignWorker ? foreignWorker.file.key : null,
                    size: foreignWorker ? Number(foreignWorker.file.size) : null,
                },
            },
            disability: {
                disableType: disability ? disability.disableType : null,
                disableLevel: disability ? disability.disableLevel : null,
            },
            basicHealthSafetyCertificate: {
                registrationNumber: basicHealthSafetyCertificate ? basicHealthSafetyCertificate.registrationNumber : null,
                dateOfCompletion: basicHealthSafetyCertificate ? basicHealthSafetyCertificate.dateOfCompletion : null,
                file: {
                    fileName: basicHealthSafetyCertificate ? basicHealthSafetyCertificate.file.fileName : null,
                    type: basicHealthSafetyCertificate ? basicHealthSafetyCertificate.file.type : null,
                    key: basicHealthSafetyCertificate ? basicHealthSafetyCertificate.file.key : null,
                    size: basicHealthSafetyCertificate ? Number(basicHealthSafetyCertificate.file.size) : null,
                },
            },
        };
    }

    async update(accountId: number, body: AccountMemberUpdateRequest): Promise<void> {
        if (body.desiredOccupations) {
            await Promise.all(
                body.desiredOccupations.map(async (item) => {
                    const codeExist = await this.prismaService.code.findUnique({
                        where: {
                            isActive: true,
                            id: item,
                        },
                    });
                    if (!codeExist) throw new BadRequestException(`Occupation code number: ${item} does not exist`);
                }),
            );

            const memberId = await this.findIdByAccountId(accountId);

            const currentDesiredOccupations = (
                await this.prismaService.membersOnCodes.findMany({
                    where: {
                        isActive: true,
                        memberId,
                    },
                })
            ).map((item) => {
                return item.codeId;
            });

            await Promise.all(
                body.desiredOccupations.map(async (item) => {
                    if (!currentDesiredOccupations.includes(item)) {
                        await this.prismaService.membersOnCodes.create({
                            data: {
                                memberId,
                                codeId: item,
                            },
                        });
                    }
                }),
            );

            await Promise.all(
                currentDesiredOccupations.map(async (item) => {
                    if (!body.desiredOccupations.includes(item)) {
                        await this.prismaService.membersOnCodes.delete({
                            where: {
                                memberId_codeId: {
                                    memberId,
                                    codeId: item,
                                },
                            },
                        });
                    }
                }),
            );
        }

        if (body.username) {
            const usernameExist = await this.prismaService.account.findUnique({
                where: {
                    username: body.username,
                },
            });
            if (usernameExist) throw new ConflictException('Username already existed');
            await this.prismaService.account.update({
                data: {
                    username: body.username,
                },
                where: {
                    id: accountId,
                },
            });
        }

        await this.prismaService.member.update({
            data: {
                name: body.name,
                desiredSalary: body.desiredSalary,
            },
            where: {
                accountId,
            },
        });
    }

    async changePassword(
        ip: string,
        accountId: number,
        body: AccountMemberChangePasswordRequest,
    ): Promise<AccountMemberChangePasswordResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                isActive: true,
                id: accountId,
            },
        });
        if (!account) throw new NotFoundException('Account does not exist');

        const passwordMatch = await compare(body.currentPassword, account.password);
        if (!passwordMatch) return { status: ChangePasswordStatus.PASSWORD_NOT_MATCH };

        const otpVerificationStatus = await this.otpService.checkValidOtp({ otpId: body.otpId, code: body.code }, ip);
        if (otpVerificationStatus.status === OtpStatus.VERIFIED) {
            await this.otpService.usedOtp(body.otpId);
            await this.prismaService.account.update({
                data: {
                    password: await hash(body.newPassword, 10),
                },
                where: {
                    isActive: true,
                    id: accountId,
                },
            });
        }
        switch (otpVerificationStatus.status) {
            case OtpStatus.VERIFIED:
                return { status: ChangePasswordStatus.SUCCESS };
            case OtpStatus.NOT_FOUND:
                return { status: ChangePasswordStatus.OTP_NOT_FOUND };
            case OtpStatus.OUT_OF_TIME:
                return { status: ChangePasswordStatus.OTP_OUT_OF_TIME };
            case OtpStatus.WRONG_CODE:
                return { status: ChangePasswordStatus.OTP_WRONG_CODE };
        }
    }

    async upsertBankAccount(id: number, request: AccountMemberUpsertBankAccountRequest): Promise<void> {
        const bankNameExist = await this.prismaService.bank.count({
            where: {
                isActive: true,
                name: request.bankName,
            },
        });
        if (!bankNameExist) throw new BadRequestException('Bank name does not exist');

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
                            disableType: request.disabledTypeList,
                        },
                        create: {
                            disableLevel: request.disabledLevel,
                            disableType: request.disabledTypeList,
                        },
                    },
                },
            },
        });
    }

    async cancelMembership(accountId: number): Promise<void> {
        await this.prismaService.$transaction(async (tx) => {
            await tx.account.update({
                data: {
                    isActive: false,
                },
                where: {
                    id: accountId,
                },
            });

            await tx.member.update({
                data: {
                    isActive: false,
                },
                where: {
                    accountId,
                },
            });

            await tx.bankAccount.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.basicHealthSafetyCertificate.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.career.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.disability.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.foreignWorker.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.memberEvaluation.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.membersOnTeams.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });

            await tx.teamMemberInvitation.updateMany({
                data: {
                    isActive: false,
                },
                where: {
                    member: {
                        accountId,
                    },
                },
            });
        });
    }
}
