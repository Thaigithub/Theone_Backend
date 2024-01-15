import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostApplicationStatus, Prisma, SettlementStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { ContractType } from './enum/contract-company-type-contract.enum';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListForSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanySettlementGetListRequest } from './request/contract-company-settlement-get-list.request';
import { ContractCompanySettlementUpdateRequest } from './request/contract-company-settlement-update.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyCountContractsResponse } from './response/contract-company-get-count-contract.response';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-for-site.response';
import { ContractCompanySettlementGetListResponse } from './response/contract-company-settlement-get-list.response';
import { ContractCompanySettlementGetMemberDetailResponse } from './response/contract-company-settlement-get-member-detail.response';
import { ContractCompanySettlementGetTeamDetailResponse } from './response/contract-company-settlement-get-team-detail.response';

@Injectable()
export class ContractCompanyService {
    constructor(private prismaService: PrismaService) {}
    async getContractOnSite(
        siteId: number,
        accountId: number,
        request: ContractCompanyGetListForSiteRequest,
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
                type: item.application.member ? ContractType.INDIVIDUAL : ContractType.TEAM,
                name: item.application.member ? item.application.member.name : item.application.team.name,
                applicantId: item.application.member ? item.application.member.id : item.application.team.id,
                contact: item.application.member ? item.application.member.contact : item.application.team.leader.contact,
                teamLeaderName: item.application.member ? null : item.application.team.leader.name,
                startDate: item.startDate,
                endDate: item.endDate,
            };
        });
        const total = await this.prismaService.contract.count({ where: query.where });
        return new PaginationResponse(contracts, new PageInfo(total));
    }

    async createContract(accountId: number, body: ContractCompanyCreateRequest): Promise<void> {
        const application = await this.prismaService.application.findFirst({
            where: {
                id: body.applicationId,
                status: PostApplicationStatus.APPROVE_BY_MEMBER,
                post: {
                    company: {
                        accountId,
                    },
                },
            },
            select: {
                post: {
                    select: {
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
                    },
                },
                member: {
                    select: {
                        id: true,
                    },
                },
                interview: {
                    select: {
                        supportCategory: true,
                    },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found or not ready');
        if (!application.post.site) throw new BadRequestException('This post has no site to create contract');

        let isHeadhuntingRecommendation = false;
        const record = this.prismaService.headhuntingRecommendation.findFirst({
            where: {
                ...(application.member && { memberId: application.member.id }),
                ...(application.team && { teamId: application.team.id }),
                postId: application.post.id,
            },
            select: {
                id: true,
            },
        });
        if (record) {
            isHeadhuntingRecommendation = true;
        }
        await this.prismaService.file.create({
            data: {
                key: body.fileKey,
                fileName: body.fileName,
                size: body.fileSize,
                type: body.fileType,
                contract: {
                    create: {
                        applicationId: body.applicationId,
                        startDate: new Date(body.startDate),
                        endDate: new Date(body.endDate),
                        salaryType: body.salaryType,
                        amount: body.amount,
                        department: body.department,
                        paymentForm: body.paymentForm,
                        settlementStatus: isHeadhuntingRecommendation ? SettlementStatus.UNSETTLED : SettlementStatus.NONE,
                    },
                },
            },
        });
        await this.prismaService.site.update({
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
    }

    async countContracts(accountId: number): Promise<ContractCompanyCountContractsResponse> {
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
        if (!contract) throw new NotFoundException('Contract not found');
        return {
            companyName: contract.application.post.company.name,
            siteName: contract.application.post.site.name,
            postName: contract.application.post.name,
            siteStartDate: contract.application.post.site.startDate,
            siteEndDate: contract.application.post.site.endDate,
            manager: contract.application.post.site.personInCharge,
            phoneNumber: contract.application.post.site.personInChargeContact,
            type: contract.application.member ? ContractType.INDIVIDUAL : ContractType.TEAM,
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

    async getSettlementList(
        accountId: number,
        query: ContractCompanySettlementGetListRequest,
    ): Promise<ContractCompanySettlementGetListResponse> {
        const queryFilter: Prisma.ContractWhereInput = {
            ...(query.settlementStatus && { settlementStatus: query.settlementStatus }),
            ...(!query.settlementStatus && { NOT: { settlementStatus: SettlementStatus.NONE } }),
            ...(query.startDate && { startDate: { gte: new Date(query.startDate) } }),
            ...(query.endDate && { endDate: { lte: new Date(query.endDate) } }),
            application: {
                ...(query.object === ContractType.INDIVIDUAL && {
                    AND: [
                        { NOT: { memberId: null } },
                        {
                            member: {
                                isActive: true,
                                ...(query.searchTerm && { name: { contains: query.searchTerm, mode: 'insensitive' } }),
                            },
                        },
                    ],
                }),
                ...(query.object === ContractType.TEAM && {
                    AND: [
                        { NOT: { teamId: null } },
                        {
                            team: {
                                isActive: true,
                                ...(query.searchTerm && { name: { contains: query.searchTerm, mode: 'insensitive' } }),
                            },
                        },
                    ],
                }),
                post: {
                    company: {
                        isActive: true,
                        accountId: accountId,
                    },
                },
            },
        };
        const contracts = (
            await this.prismaService.contract.findMany({
                where: queryFilter,
                select: {
                    id: true,
                    application: {
                        select: {
                            member: {
                                select: {
                                    name: true,
                                    contact: true,
                                },
                            },
                            team: {
                                select: {
                                    name: true,
                                    leader: {
                                        select: {
                                            name: true,
                                            contact: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    settlementStatus: true,
                    settlementCompleteDate: true,
                },
                ...QueryPagingHelper.queryPaging(query),
            })
        ).map((item) => {
            return {
                id: item.id,
                memberInfor: {
                    name: item.application?.member ? item.application.member.name : null,
                    contact: item.application?.member ? item.application.member.contact : null,
                },
                teamInfor: {
                    teamName: item.application?.team ? item.application.team.name : null,
                    leaderName: item.application?.team ? item.application.team.leader.name : null,
                    contact: item.application?.team ? item.application.team.leader.contact : null,
                },
                settlementStatus: item.settlementStatus,
                settlementCompleteDate: item.settlementCompleteDate,
            };
        });
        const countContract = await this.prismaService.contract.count({
            where: queryFilter,
        });
        return new PaginationResponse(contracts, new PageInfo(countContract));
    }

    async getTeamSettlementDetail(accountId: number, id: number): Promise<ContractCompanySettlementGetTeamDetailResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id: id,
                application: {
                    post: {
                        isActive: true,
                        company: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                    NOT: { team: null },
                },
                NOT: { settlementStatus: SettlementStatus.NONE },
            },
            select: {
                application: {
                    select: {
                        post: {
                            select: {
                                site: {
                                    select: {
                                        name: true,
                                        startDate: true,
                                        endDate: true,
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
                        team: {
                            select: {
                                name: true,
                                leader: {
                                    select: {
                                        name: true,
                                        contact: true,
                                    },
                                },
                            },
                        },
                    },
                },
                startDate: true,
                endDate: true,
                labor: {
                    select: {
                        id: true,
                        salaryHistories: {
                            orderBy: { date: 'desc' },
                            take: 1,
                            select: {
                                base: true,
                                totalDeductible: true,
                                totalPayment: true,
                            },
                        },
                        workDates: {
                            select: {
                                hours: true,
                            },
                        },
                    },
                },
            },
        });
        if (!contract) {
            throw new NotFoundException('The contract id is not found');
        }
        const workLoadInformation = () => {
            const countWorkDays = contract?.labor ? contract.labor.workDates.length : null;
            const averageWorkLoad =
                contract?.labor && countWorkDays > 0
                    ? contract.labor.workDates.reduce((total, current) => {
                          return total + current.hours;
                      }, 0) / countWorkDays
                    : null;
            return {
                workDays: countWorkDays,
                workLoad: averageWorkLoad,
                laborId: contract.labor ? contract.labor.id : null,
            };
        };
        return {
            siteInfor: {
                siteName: contract.application.post.site.name,
                startDateConstruction: contract.application.post.site.startDate,
                endDateConstruction: contract.application.post.site.endDate,
                startDateContract: contract.startDate,
                endDateContract: contract.endDate,
                isWorking: new Date() <= contract.endDate && new Date() >= contract.startDate,
            },
            wageInfor: contract.labor
                ? {
                      wage: contract.labor?.salaryHistories[0]?.base ? contract.labor.salaryHistories[0].base : null,
                      deductibleAmount: contract.labor?.salaryHistories[0]?.totalDeductible
                          ? contract.labor.salaryHistories[0].totalDeductible
                          : null,
                      actualSalary: contract.labor?.salaryHistories[0]?.totalPayment
                          ? contract.labor.salaryHistories[0].totalPayment
                          : null,
                  }
                : null,
            workLoadInfor: workLoadInformation(),
            teamInfor: {
                leaderName: contract.application.team.leader.name,
                teamName: contract.application.team.name,
                contact: contract.application.team.leader.contact,
            },
        };
    }

    async getMemberSettlementDetail(accountId: number, id: number): Promise<ContractCompanySettlementGetMemberDetailResponse> {
        const contract = await this.prismaService.contract.findUnique({
            where: {
                id: id,
                application: {
                    post: {
                        isActive: true,
                        company: {
                            accountId: accountId,
                            isActive: true,
                        },
                    },
                    NOT: { member: null },
                },
                NOT: { settlementStatus: SettlementStatus.NONE },
            },
            select: {
                application: {
                    select: {
                        post: {
                            select: {
                                site: {
                                    select: {
                                        name: true,
                                        startDate: true,
                                        endDate: true,
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
                    },
                },
                startDate: true,
                endDate: true,
                labor: {
                    select: {
                        id: true,
                        salaryHistories: {
                            orderBy: { date: 'desc' },
                            take: 1,
                            select: {
                                base: true,
                                totalDeductible: true,
                                totalPayment: true,
                            },
                        },
                        workDates: {
                            select: {
                                hours: true,
                            },
                        },
                    },
                },
            },
        });
        if (!contract) {
            throw new NotFoundException('The contract id is not found');
        }
        const workLoadInformation = () => {
            const countWorkDays = contract?.labor ? contract.labor.workDates.length : null;
            const averageWorkLoad =
                contract?.labor && countWorkDays > 0
                    ? contract.labor.workDates.reduce((total, current) => {
                          return total + current.hours;
                      }, 0) / countWorkDays
                    : null;
            return {
                workDays: countWorkDays,
                workLoad: averageWorkLoad,
                laborId: contract.labor ? contract.labor.id : null,
            };
        };
        return {
            siteInfor: {
                siteName: contract.application.post.site.name,
                startDateConstruction: contract.application.post.site.startDate,
                endDateConstruction: contract.application.post.site.endDate,
                startDateContract: contract.startDate,
                endDateContract: contract.endDate,
                isWorking: new Date() <= contract.endDate && new Date() >= contract.startDate,
            },
            wageInfor: contract.labor
                ? {
                      wage: contract.labor?.salaryHistories[0]?.base ? contract.labor.salaryHistories[0].base : null,
                      deductibleAmount: contract.labor?.salaryHistories[0]?.totalDeductible
                          ? contract.labor.salaryHistories[0].totalDeductible
                          : null,
                      actualSalary: contract.labor?.salaryHistories[0]?.totalPayment
                          ? contract.labor.salaryHistories[0].totalPayment
                          : null,
                  }
                : null,
            workLoadInfor: workLoadInformation(),
            memberInfor: {
                name: contract.application.member.name,
                contact: contract.application.member.contact,
            },
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
        if (!contract) throw new NotFoundException('Contract not found');
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
                file: {
                    update: {
                        key: body.fileKey,
                        fileName: body.fileName,
                        size: body.fileSize,
                        type: body.fileType,
                    },
                },
            },
        });
    }

    async updateSettlementStatus(accountId: number, id: number, body: ContractCompanySettlementUpdateRequest): Promise<void> {
        await this.prismaService.$transaction(async (prisma) => {
            const contract = await prisma.contract.findUnique({
                where: {
                    id: id,
                    application: {
                        post: {
                            isActive: true,
                            company: {
                                accountId: accountId,
                                isActive: true,
                            },
                        },
                    },
                    NOT: { settlementStatus: SettlementStatus.NONE },
                },
                select: {
                    settlementStatus: true,
                },
            });
            if (!contract) {
                throw new NotFoundException('The contract is not found');
            }
            if (body.settlementStatus && body.settlementStatus === SettlementStatus.NONE) {
                throw new BadRequestException(`This contract doesn't use HeadHunting service`);
            }
            if (contract.settlementStatus !== body.settlementStatus) {
                await prisma.contract.update({
                    where: {
                        id: id,
                        application: {
                            post: {
                                isActive: true,
                                company: {
                                    accountId: accountId,
                                    isActive: true,
                                },
                            },
                        },
                    },
                    data: {
                        settlementCompleteDate: new Date(),
                        settlementStatus: body.settlementStatus,
                    },
                });
            }
        });
    }
}
