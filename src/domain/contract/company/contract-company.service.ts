import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostApplicationStatus, RequestObject } from '@prisma/client';
import { AccountMemberService } from 'domain/account/member/account-member.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-site.response';
import { ContractCompanyGetTotalResponse } from './response/contract-company-get-total.response';

@Injectable()
export class ContractCompanyService {
    constructor(
        private prismaService: PrismaService,
        private accountMemberService: AccountMemberService,
    ) {}
    async getListSite(
        siteId: number,
        accountId: number,
        request: ContractCompanyGetListSiteRequest,
    ): Promise<ContractCompanyGetListForSiteResponse> {
        const query = {
            where: {
                application: {
                    post: {
                        site: {
                            id: siteId,
                        },
                        company: {
                            accountId,
                        },
                    },
                    status: PostApplicationStatus.APPROVE_BY_MEMBER,
                },
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                file: true,
                application: {
                    select: {
                        member: {
                            select: {
                                id: true,
                                name: true,
                                contact: true,
                            },
                        },
                        team: {
                            select: {
                                id: true,
                                name: true,
                                leader: {
                                    select: {
                                        contact: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            ...QueryPagingHelper.queryPaging(request),
        };
        const contracts = (await this.prismaService.contract.findMany(query)).map((item) => {
            return {
                id: item.id,
                type: item.application.member ? RequestObject.INDIVIDUAL : RequestObject.TEAM,
                name: item.application.member ? item.application.member.name : item.application.team.name,
                applicantId: item.application.member ? item.application.member.id : item.application.team.id,
                contact: item.application.member ? item.application.member.contact : item.application.team.leader.contact,
                teamLeaderName: item.application.member ? null : item.application.team.leader.name,
                startDate: item.startDate,
                endDate: item.endDate,
                file: {
                    fileName: item.file.fileName,
                    type: item.file.type,
                    key: item.file.key,
                    size: Number(item.file.size),
                },
            };
        });
        const total = await this.prismaService.contract.count({ where: query.where });
        return new PaginationResponse(contracts, new PageInfo(total));
    }

    async create(accountId: number, body: ContractCompanyCreateRequest): Promise<void> {
        const application = await this.prismaService.application.findFirst({
            where: {
                id: body.applicationId,
                status: PostApplicationStatus.APPROVE_BY_MEMBER,
                post: {
                    company: {
                        accountId,
                    },
                },
                isActive: true,
            },
            select: {
                post: {
                    select: {
                        headhunting: {
                            select: {
                                recommendations: {
                                    where: {
                                        applicationId: body.applicationId,
                                    },
                                    select: { id: true },
                                },
                            },
                        },
                        id: true,
                        site: {
                            select: {
                                id: true,
                                numberOfContract: true,
                                numberOfWorkers: true,
                            },
                        },
                    },
                },
                team: {
                    select: {
                        id: true,
                        _count: {
                            select: {
                                members: true,
                            },
                        },
                        leaderId: true,
                        members: {
                            where: {
                                isActive: true,
                            },
                            select: {
                                memberId: true,
                            },
                        },
                    },
                },
                member: {
                    select: {
                        id: true,
                    },
                },
                category: true,
            },
        });
        if (!application) throw new NotFoundException(Error.APPLICATION_NOT_FOUND);
        if (!application.post.site) throw new BadRequestException(Error.POST_HAS_NO_SITE);
        const existContract = await this.prismaService.contract.findUnique({
            where: {
                applicationId: body.applicationId,
            },
            select: {
                id: true,
            },
        });
        if (existContract) {
            throw new BadRequestException(Error.CONTRACT_EXISTED);
        }
        await this.prismaService.$transaction(async (prisma) => {
            if (application.post.headhunting) {
                if (application.post.headhunting.recommendations.length !== 0) {
                    await prisma.headhuntingRecommendation.update({
                        where: {
                            id: application.post.headhunting.recommendations[0].id,
                        },
                        data: {
                            settlement: {
                                create: {},
                            },
                        },
                    });
                }
            }
            await prisma.file.create({
                data: {
                    key: body.file.key,
                    fileName: body.file.fileName,
                    size: body.file.size,
                    type: body.file.type,
                    contract: {
                        create: {
                            applicationId: body.applicationId,
                            startDate: new Date(body.startDate),
                            endDate: new Date(body.endDate),
                            salaryType: body.salaryType,
                            amount: body.amount,
                            manager: body.manager,
                            contact: body.contact,
                            department: body.department,
                            paymentForm: body.paymentForm,
                        },
                    },
                },
            });
            await prisma.site.update({
                where: {
                    id: application.post.site.id,
                },
                data: {
                    numberOfContract: application.post.site.numberOfContract + 1,
                    numberOfWorkers: !application.member
                        ? application.post.site.numberOfWorkers + application.team._count.members
                        : application.post.site.numberOfWorkers + 1,
                },
            });
        });

        if (application.member) {
            await this.accountMemberService.upgradeMember(application.member.id);
        } else if (application.team) {
            await this.accountMemberService.upgradeMember(application.team.leaderId);
            await Promise.all(
                application.team.members.map(async (item) => {
                    await this.accountMemberService.upgradeMember(item.memberId);
                }),
            );
        }
    }

    async count(accountId: number): Promise<ContractCompanyGetTotalResponse> {
        const contracts = await this.prismaService.contract.count({
            where: {
                startDate: {
                    lte: new Date(),
                },
                endDate: {
                    gte: new Date(),
                },
                application: {
                    post: {
                        company: {
                            accountId: accountId,
                        },
                    },
                },
            },
        });
        return { countContracts: contracts };
    }

    async getDetail(contractId: number, accountId: number): Promise<ContractCompanyGetDetailResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id: contractId,
                application: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            },
            select: {
                file: true,
                startDate: true,
                endDate: true,
                paymentForm: true,
                salaryType: true,
                amount: true,
                department: true,
                manager: true,
                contact: true,
                application: {
                    select: {
                        team: {
                            select: {
                                name: true,
                                leader: {
                                    select: {
                                        contact: true,
                                    },
                                },
                            },
                        },
                        member: {
                            select: {
                                name: true,
                                contact: true,
                            },
                        },
                        post: {
                            select: {
                                name: true,
                                company: {
                                    select: {
                                        name: true,
                                    },
                                },
                                site: {
                                    select: {
                                        name: true,
                                        startDate: true,
                                        endDate: true,
                                        personInCharge: true,
                                        personInChargeContact: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!contract) throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
        return {
            companyName: contract.application.post.company.name,
            siteName: contract.application.post.site.name,
            postName: contract.application.post.name,
            siteStartDate: contract.application.post.site.startDate,
            siteEndDate: contract.application.post.site.endDate,
            manager: contract.manager,
            phoneNumber: contract.contact,
            type: contract.application.member ? RequestObject.INDIVIDUAL : RequestObject.TEAM,
            name: contract.application.member ? contract.application.member.name : contract.application.team.name,
            contact: contract.application.member ? contract.application.member.contact : contract.application.team.leader.contact,
            startDate: contract.startDate,
            endDate: contract.endDate,
            salaryType: contract.salaryType,
            amount: contract.amount,
            file: {
                fileName: contract.file.fileName,
                type: contract.file.type,
                key: contract.file.key,
                size: Number(contract.file.size),
            },
            department: contract.department,
            paymentForm: contract.paymentForm,
        };
    }

    async update(contractId: number, accountId: number, body: ContractCompanyUpdateRequest): Promise<void> {
        const contract = await this.prismaService.contract.findFirst({
            where: {
                id: contractId,
                application: {
                    post: {
                        company: {
                            accountId,
                        },
                    },
                },
            },
        });
        if (!contract) throw new NotFoundException(Error.CONTRACT_NOT_FOUND);
        await this.prismaService.contract.update({
            where: {
                id: contractId,
            },
            data: {
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                salaryType: body.salaryType,
                paymentForm: body.paymentForm,
                amount: body.amount,
                manager: body.manager,
                contact: body.contact,
                file: {
                    update: {
                        key: body.file.key,
                        fileName: body.file.fileName,
                        size: body.file.size,
                        type: body.file.type,
                    },
                },
            },
        });
    }
}
