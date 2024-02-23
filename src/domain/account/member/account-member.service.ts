import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, MemberLevel, OtpType, SignupMethodType } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'app.config';
import { compare, hash } from 'bcrypt';
import { OtpService } from 'domain/otp/otp.service';
import { OtpStatus } from 'domain/otp/response/otp-verify.response';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { AccountMemberUpdatePasswordRequestStatus } from './enum/account-member-update-password-request-status.enum';
import { AccountMemberSendOtpVerifyPhoneRequest } from './request/account-member-send-otp-verify-phone.request';
import { AccountMemberSignupSnsRequest } from './request/account-member-signup-sns.request';
import { AccountMemberSignupRequest } from './request/account-member-signup.request';
import { AccountMemberUpdatePasswordRequest } from './request/account-member-update-password.request';
import { AccountMemberUpdateRequest } from './request/account-member-update.request';
import { AccountMemberUpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { AccountMemberUpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { AccountMemberUpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { AccountMemberUpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberVerifyOtpVerifyPhoneRequest } from './request/account-member-verify-otp.request';
import { AccountMemberCheckExistedResponse } from './response/account-member-check-existed.response';
import { AccountMemberGetDetailBankResponse } from './response/account-member-get-detail-bank.response';
import { AccountMemberGetDetailLevelResponse } from './response/account-member-get-detail-level.response';
import { AccountMemberGetDetailResponse } from './response/account-member-get-detail.response';
import { AccountMemberSendOtpVerifyPhoneResponse } from './response/account-member-send-otp-verify-phone.response';
import { AccountMemberUpdatePasswordResponse } from './response/account-member-update-password.response';
import { AccountMemberVerifyOtpVerifyPhoneResponse } from './response/account-member-verify-otp.response';
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
    ): Promise<AccountMemberSendOtpVerifyPhoneResponse> {
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
            if (!isValidPhone) return { otpId: null };
        }
        return await this.otpService.sendOtp({
            email: null,
            phoneNumber: body.phone,
            type: OtpType.PHONE,
            ip: ip,
            data: body.phone,
        });
    }

    async signup(request: AccountMemberSignupRequest): Promise<void> {
        if (request.recommenderId !== undefined) {
            const numRecommender = await this.prismaService.account.count({
                where: {
                    username: request.recommenderId,
                },
            });
            if (numRecommender !== 1) throw new NotFoundException(Error.RECOMMENDER_USERNAME_NOT_EXISTED);
        }
        const numAccount = await this.prismaService.account.count({
            where: {
                username: request.username,
            },
        });
        if (numAccount !== 0) throw new BadRequestException(Error.USERNAME_EXISTED);
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
                        preference: {
                            create: {},
                        },
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
            if (numRecommender !== 1) throw new NotFoundException(Error.RECOMMENDER_USERNAME_NOT_EXISTED);
        }
        const numAccount = await this.prismaService.account.count({
            where: {
                member: {
                    email: payload.email,
                },
            },
        });
        if (numAccount !== 0) throw new BadRequestException(Error.EMAIL_EXISTED);
        if (request.signupMethod === SignupMethodType.GENERAL) throw new BadRequestException(Error.WRONG_SIGNUP_METHOD);
        await this.prismaService.account.create({
            data: {
                username: payload.email,
                password: await hash(payload.email, 10),
                type: AccountType.MEMBER,
                status: AccountStatus.APPROVED,
                member: {
                    create: {
                        email: payload.email,
                        name: payload.name,
                        level: MemberLevel.THIRD,
                        signupMethod: request.signupMethod,
                        preference: {
                            create: {},
                        },
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
                region: true,
                account: true,
                bankAccount: true,
                foreignWorker: {
                    include: {
                        file: true,
                    },
                },
                disability: {
                    include: {
                        file: true,
                    },
                },
                basicHealthSafetyCertificate: {
                    include: {
                        file: true,
                    },
                },
                teams: {
                    include: {
                        team: true,
                    },
                },
            },
        });
        const { foreignWorker, disability, basicHealthSafetyCertificate, region, ...rest } = member;
        return {
            ...rest,
            districtId: region?.id || null,
            cityId: region?.cityId || null,
            foreignWorker: {
                englishName: foreignWorker ? foreignWorker.englishName : null,
                registrationNumber: foreignWorker ? foreignWorker.registrationNumber : null,
                residenceStatus: foreignWorker ? foreignWorker.residenceStatus : null,
                file: {
                    fileName: foreignWorker ? foreignWorker.file.fileName : null,
                    type: foreignWorker ? foreignWorker.file.type : null,
                    key: foreignWorker ? foreignWorker.file.key : null,
                    size: foreignWorker ? Number(foreignWorker.file.size) : null,
                },
            },
            disability: {
                fileName: disability ? disability.file.fileName : null,
                type: disability ? disability.file.type : null,
                key: disability ? disability.file.key : null,
                size: disability ? Number(disability.file.size) : null,
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
        if (body.username) {
            const usernameExist = await this.prismaService.account.findUnique({
                where: {
                    username: body.username,
                    NOT: {
                        id: accountId,
                    },
                },
            });
            if (usernameExist) throw new BadRequestException(Error.USERNAME_EXISTED);
            await this.prismaService.account.update({
                data: {
                    username: body.username,
                },
                where: {
                    id: accountId,
                },
            });
        }

        if (body.districtId) {
            const isEntireCityId = await this.prismaService.region.findUnique({
                where: {
                    isActive: true,
                    id: body.districtId,
                    cityEnglishName: 'All',
                },
            });
            if (isEntireCityId) throw new BadRequestException(Error.ENTIRE_CITY_CANNOT_BE_USED);
        }

        await this.prismaService.member.update({
            data: {
                desiredSalary: body.desiredSalary,
                regionId: body.districtId,
            },
            where: {
                accountId,
            },
        });
    }

    async updatePassword(
        ip: string,
        accountId: number,
        body: AccountMemberUpdatePasswordRequest,
    ): Promise<AccountMemberUpdatePasswordResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                isActive: true,
                id: accountId,
            },
        });
        if (!account) throw new NotFoundException(Error.ACCOUNT_NOT_FOUND);

        const passwordMatch = await compare(body.currentPassword, account.password);
        if (!passwordMatch) return { status: AccountMemberUpdatePasswordRequestStatus.PASSWORD_NOT_MATCH };

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
                return { status: AccountMemberUpdatePasswordRequestStatus.SUCCESS };
            case OtpStatus.NOT_FOUND:
                return { status: AccountMemberUpdatePasswordRequestStatus.OTP_NOT_FOUND };
            case OtpStatus.OUT_OF_TIME:
                return { status: AccountMemberUpdatePasswordRequestStatus.OTP_OUT_OF_TIME };
            case OtpStatus.WRONG_CODE:
                return { status: AccountMemberUpdatePasswordRequestStatus.OTP_WRONG_CODE };
        }
    }

    async upsertBankAccount(id: number, request: AccountMemberUpsertBankAccountRequest): Promise<void> {
        const bankNameExist = await this.prismaService.bank.count({
            where: {
                isActive: true,
                name: request.bankName,
            },
        });
        if (!bankNameExist) throw new BadRequestException(Error.BANK_NOT_FOUND);

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

    async getBankAccount(accountId: number): Promise<AccountMemberGetDetailBankResponse> {
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

    async getLevel(accountId: number): Promise<AccountMemberGetDetailLevelResponse> {
        return await this.prismaService.member.findUnique({
            where: {
                accountId,
                isActive: true,
            },
            select: {
                level: true,
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
                            residenceStatus: request.residenceStatus,
                            registrationNumber: request.registrationNumber,
                            file: {
                                update: request.file,
                            },
                        },
                        create: {
                            englishName: request.englishName,
                            residenceStatus: request.residenceStatus,
                            registrationNumber: request.registrationNumber,
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
        await this.prismaService.$transaction(async (tx) => {
            const file = await tx.file.create({
                data: request,
            });
            await tx.member.update({
                where: { accountId: id },
                data: {
                    disability: {
                        upsert: {
                            update: {
                                fileId: file.id,
                            },
                            create: {
                                fileId: file.id,
                            },
                        },
                    },
                },
            });
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

            await tx.teamInvitation.updateMany({
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
