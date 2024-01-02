import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CareerType, CarrerCertificationApplicationStatus, CodeType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { GovernmentService } from '../../../services/government/government.service';
import { getTimeDifferenceInMonths, getTimeDifferenceInYears } from '../../../utils/time-calculator';
import { CareerMemberCreateRequest } from './request/career-member-create.request';
import { CareerMemberGetListRequest } from './request/career-member-get-list.request';
import { CareerMemberUpdateRequest } from './request/career-member-update.request';
import { CareerResponse } from './response/career-member-get-list.response';

@Injectable()
export class CareerMemberService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly governmentService: GovernmentService,
    ) {}

    private parseConditionsFromQuery(query: CareerMemberGetListRequest, memberId: number) {
        return {
            isActive: true,
            type: query.type,
            memberId,
        };
    }

    async getList(query: CareerMemberGetListRequest, accountId: number): Promise<CareerResponse[]> {
        const memberId = await this.getMemberId(accountId);
        return this.prismaService.career.findMany({
            select: {
                id: true,
                type: true,
                companyName: true,
                siteName: true,
                startDate: true,
                endDate: true,
                occupation: true,
                isExperienced: true,
            },
            where: this.parseConditionsFromQuery(query, memberId),
            orderBy: {
                startDate: 'desc',
            },
            ...QueryPagingHelper.queryPaging(query),
        });
    }

    async getDetail(id: number, accountId: number): Promise<CareerResponse> {
        const memberId = await this.getMemberId(accountId);
        const response = await this.prismaService.career.findUnique({
            select: {
                id: true,
                type: true,
                companyName: true,
                siteName: true,
                startDate: true,
                endDate: true,
                occupation: true,
                isExperienced: true,
            },
            where: {
                isActive: true,
                id,
                memberId,
            },
        });

        if (!response) throw new NotFoundException('Career does not exist');
        return response;
    }

    async getTotal(query: CareerMemberGetListRequest, accountId: number): Promise<number> {
        const memberId = await this.getMemberId(accountId);
        return await this.prismaService.career.count({
            where: this.parseConditionsFromQuery(query, memberId),
        });
    }

    async createCareer(body: CareerMemberCreateRequest, accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);

        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                codeType: CodeType.GENERAL,
                isActive: true,
            },
        });

        if (!occupation) throw new BadRequestException('Occupation (Code Id) does not exist');

        await this.prismaService.career.create({
            data: {
                ...body,
                memberId,
                experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                type: CareerType.GENERAL,
                occupationId: occupation.id,
            },
        });
    }

    async updateCareer(id: number, body: CareerMemberUpdateRequest, accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        const career = await this.prismaService.career.findUnique({
            where: {
                id,
                isActive: true,
                memberId,
            },
        });

        if (!career) throw new NotFoundException('Career does not exist');

        const occupation = await this.prismaService.code.findUnique({
            where: {
                id: body.occupationId,
                codeType: CodeType.GENERAL,
                isActive: true,
            },
        });

        await this.prismaService.career.update({
            data: {
                ...body,
                experiencedYears: getTimeDifferenceInYears(new Date(body.startDate), new Date(body.endDate)),
                experiencedMonths: getTimeDifferenceInMonths(new Date(body.startDate), new Date(body.endDate)),
                occupationId: occupation.id,
            },
            where: {
                id,
            },
        });
    }

    async deleteCareer(id: number, accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);

        const careerExist = await this.prismaService.career.count({
            where: {
                isActive: true,
                id,
                memberId,
            },
        });
        if (!careerExist) throw new NotFoundException('Career does not exist');

        await this.prismaService.career.update({
            where: {
                isActive: true,
                id,
                memberId,
            },
            data: {
                isActive: false,
            },
        });
    }

    async applyCertificate(accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        if (!memberId) throw new NotFoundException('Member not found');
        await this.prismaService.careerCertificationApplication.upsert({
            where: {
                memberId: memberId,
            },
            create: {
                memberId,
            },
            update: {
                status: CarrerCertificationApplicationStatus.REQUESTING,
            },
        });
    }

    async getCertExperienceByHealthInsurance(accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        if (!memberId) throw new NotFoundException('Member not found');

        const application = await this.prismaService.careerCertificationApplication.findUnique({
            where: {
                memberId,
            },
        });
        if (!application || application.status != CarrerCertificationApplicationStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');

        await this.governmentService.saveCertificationExperienceHealthInsurance(memberId);
    }

    async getCertExperienceByEmploymentInsurance(accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        if (!memberId) throw new NotFoundException('Member not found');

        const application = await this.prismaService.careerCertificationApplication.findUnique({
            where: {
                memberId,
            },
        });
        if (!application || application.status != CarrerCertificationApplicationStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');

        await this.governmentService.saveCertificationExperienceEmploymentInsurance(memberId);
    }

    async getCertExperienceByTheOneSite(accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        if (!memberId) throw new NotFoundException('Member not found');

        const application = await this.prismaService.careerCertificationApplication.findUnique({
            where: {
                memberId,
            },
        });
        if (!application || application.status != CarrerCertificationApplicationStatus.APPROVED)
            throw new ForbiddenException('Application not exist or not approved');

        await this.governmentService.saveCertificationTheOneSite(memberId);
    }

    private async getMemberId(accountId: number): Promise<number> {
        const member = await this.prismaService.member.findUnique({
            select: {
                id: true,
            },
            where: {
                accountId,
            },
        });
        return member.id;
    }
}
