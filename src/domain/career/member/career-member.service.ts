import { Injectable } from '@nestjs/common';
import { CareerType } from '@prisma/client';
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
        await this.prismaService.career.create({
            data: {
                ...body,
                memberId,
                type: CareerType.GENERAL,
            },
        });
    }

    async deleteCareer(careerId: number, accountId: number): Promise<void> {
        const memberId = await this.getMemberId(accountId);
        await this.prismaService.career.update({
            where: {
                id: careerId,
                memberId,
            },
            data: {
                isActive: false,
            },
        });
    }
}
