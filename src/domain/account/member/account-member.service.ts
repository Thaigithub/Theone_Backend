import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountStatus, AccountType, CareerType, MemberLevel, NotificationType, OtpType, SignupMethodType } from '@prisma/client';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'app.config';
import { compare, hash } from 'bcrypt';
import { NotificationMemberService } from 'domain/notification/member/notification-member.service';
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
        private notificationMemberService: NotificationMemberService,
    ) {}

    async verifyOtpVerifyPhone(
        ip: string,
        accountId: number,
        body: AccountMemberVerifyOtpVerifyPhoneRequest,
    ): Promise<AccountMemberVerifyOtpVerifyPhoneResponse> {
        const verify = await this.otpService.checkValidOtp(body, ip);
        if (verify.isVerified) {
            const member = await this.prismaService.member.update({
                where: {
                    accountId,
                },
                data: {
                    contact: verify.data,
                    isContactVerfied: true,
                },
                select: {
                    id: true,
                },
            });
            verify.data = null;
            await this.upgradeMember(member.id);
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
        if (body.email) {
            const email = await this.prismaService.member.count({
                where: {
                    email: body.email,
                },
            });
            if (email > 0) throw new BadRequestException(Error.EMAIL_EXISTED);
        }

        await this.prismaService.member.update({
            data: {
                desiredSalary: body.desiredSalary,
                regionId: body.districtId,
                email: body.email,
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
        const member = await this.prismaService.member.update({
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
            select: {
                id: true,
            },
        });
        await this.upgradeMember(member.id);
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

    /**
     * Upgrade Member
     * Level 3        -> Level 2         : Verified contact (or foreignwork registration), health safety certificate, register careers.
     *
     * Level 2        -> Level 1 Silver  : Career certification & number of contract >= 0.
     *
     * Level 1 Silver -> Level 1 Golden  : Number of contract >= 50.
     *
     * Level 1 Golden -> Level 1 Platinum: Number of contract > 100.
     *
     * @param id: Id of Member.
     * @return Promise<void>
     */
    async upgradeMember(id: number): Promise<void> {
        const countContract = await this.prismaService.contract.count({
            where: {
                application: {
                    memberId: id,
                    team: {
                        OR: [{ leaderId: id }, { members: { some: { memberId: id } } }],
                    },
                },
            },
        });
        const member = await this.prismaService.member.findUnique({
            where: {
                id: id,
                isActive: true,
            },
            select: {
                level: true,
                isContactVerfied: true,
                foreignWorker: true,
                basicHealthSafetyCertificate: true,
                careers: true,
                careerCertificationRequest: true,
                accountId: true,
            },
        });
        if (member) {
            let upgradeLevel = null;
            if (countContract > 100 && member.level === MemberLevel.GOLD) {
                upgradeLevel = MemberLevel.PLATINUM;
            } else if (countContract >= 50 && member.level === MemberLevel.SILVER) {
                upgradeLevel = MemberLevel.GOLD;
            } else if (countContract >= 0 && member.level === MemberLevel.SECOND) {
                const countCareerCertifications = await this.prismaService.career.count({
                    where: {
                        type: CareerType.CERTIFICATION,
                        isActive: true,
                    },
                });
                if (countCareerCertifications > 0) {
                    upgradeLevel = MemberLevel.SILVER;
                }
            } else if (member.level === MemberLevel.THIRD) {
                if (
                    (member.isContactVerfied || member.foreignWorker) &&
                    member.basicHealthSafetyCertificate &&
                    (member.careerCertificationRequest || member.careers.length > 0)
                ) {
                    upgradeLevel = MemberLevel.SECOND;
                }
            }
            if (upgradeLevel !== null) {
                await this.upgradeLevel(id, upgradeLevel);
            }
        }
    }

    async upgradeLevel(id: number, level: MemberLevel) {
        const member = await this.prismaService.member.update({
            where: {
                id: id,
            },
            data: {
                level: level,
            },
            select: {
                accountId: true,
            },
        });
        switch (level) {
            case MemberLevel.PLATINUM: {
                await this.notificationMemberService.create(
                    member.accountId,
                    '[축하] 인증 회원 (다이아몬드) 레벨 달성!',
                    '축하드립니다! 회원님은 인증 회원 (다이아몬드) 레벨로 성공적으로 업그레이드되셨습니다. 이제부터 최상위 회원 등급의 특전과 혜택을 누리실 수 있습니다.',
                    NotificationType.ACCOUNT,
                    member.accountId,
                );
                break;
            }
            case MemberLevel.GOLD: {
                await this.notificationMemberService.create(
                    member.accountId,
                    '[축하] 인증 회원 (골든) 레벨 달성!',
                    '축하드립니다! 회원님은 인증 회원 (골든) 레벨로 성공적으로 업그레이드되셨습니다. 이제부터 특별한 혜택과 우수한 서비스를 누리실 수 있습니다.',
                    NotificationType.ACCOUNT,
                    member.accountId,
                );
                break;
            }
            case MemberLevel.SILVER: {
                await this.notificationMemberService.create(
                    member.accountId,
                    '[축하] 인증 회원 (실버) 레벨 달성!',
                    '축하드립니다! 회원님은 인증 회원 (실버) 레벨로 성공적으로 업그레이드되셨습니다. 이제부터 다양한 혜택을 누리실 수 있습니다.',
                    NotificationType.ACCOUNT,
                    member.accountId,
                );
                break;
            }
            case MemberLevel.SECOND: {
                await this.notificationMemberService.create(
                    member.accountId,
                    '[축하] 경험 많은 회원 레벨 달성!',
                    '축하드립니다! 회원님은 경험 많은 회원 레벨로 성공적으로 업그레이드되셨습니다. 이제부터 더 많은 기능과 특전을 이용하실 수 있습니다.',
                    NotificationType.ACCOUNT,
                    member.accountId,
                );
                break;
            }
        }
    }
}
