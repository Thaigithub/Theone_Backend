import { Injectable, NotFoundException } from '@nestjs/common';
import { CareerType, CodeType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { CareerMemberCreateRequest } from './request/career-member-create.request';
import { CareerMemberGetListRequest } from './request/career-member-get-list-request';
import { CareerResponse } from './response/career-member-get-list.response';

@Injectable()
export class CareerMemberService {
    constructor(private readonly prismaService: PrismaService) {}

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

    private parseConditionsFromQuery(query: CareerMemberGetListRequest, memberId: number) {
        return {
            isActive: true,
            type: query.type,
            memberId,
        };
    }

    async getList(query: CareerMemberGetListRequest, accountId: number): Promise<CareerResponse[]> {
        const memberId = await this.getMemberId(accountId);
        return await this.prismaService.career.findMany({
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

            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            skip: query.pageNumber && query.pageSize && (query.pageNumber - 1) * query.pageSize,
            take: query.pageNumber && query.pageSize && query.pageSize,
        });
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
                codeType: CodeType.JOB,
            },
        });

        await this.prismaService.career.create({
            data: {
                ...body,
                memberId,
                type: CareerType.GENERAL,
                occupationId: occupation.id,
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
        if (!careerExist) throw new NotFoundException('Evaluation does not exist');

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
}
