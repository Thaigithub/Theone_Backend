import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostApplicationStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { ContractType } from './enum/contract-company-type-contract.enum';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListForSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-for-site.response';

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
            skip: request.pageNumber && request.pageSize && (parseInt(request.pageNumber) - 1) * parseInt(request.pageSize),
            take: request.pageSize && parseInt(request.pageSize),
        };
        const contracts = (await this.prismaService.contract.findMany(query)).map((item) => {
            return {
                type: item.application.member ? ContractType.INDIVIDUAL : ContractType.TEAM,
                name: item.application.member ? item.application.member.name : item.application.team.name,
                id: item.application.member ? item.application.member.id : item.application.team.id,
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
                        site: true,
                    },
                },
            },
        });
        if (!application) throw new NotFoundException('Application not found or not ready');
        if (!application.post.site) throw new BadRequestException('This post has no site to create contract');
        await this.prismaService.file.create({
            data: {
                key: body.fileKey,
                fileName: body.fileName,
                size: body.fileSize,
                type: body.fileType,
                contract: {
                    create: {
                        applicationId: body.applicationId,
                        contractNumber: body.contractNumber,
                        startDate: body.startDate,
                        endDate: body.endDate,
                        paymentForm: body.paymentForm,
                        amount: body.amount,
                        department: body.department,
                    },
                },
            },
        });
    }
    async getDetail(contractId, accountId): Promise<ContractCompanyGetDetailResponse> {
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
            paymentForm: contract.paymentForm,
            amount: contract.amount,
            file: contract.file,
            department: contract.department,
        };
    }
}
