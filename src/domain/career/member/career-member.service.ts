import { Injectable } from '@nestjs/common';
import { CareerType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { CareerResponse } from './response/career-member.response';
import { CreateCareerRequest, GetCareersListRequest } from './request/career-member.request';

@Injectable()
export class CareerMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    private parseConditionsFromQuery(query: GetCareersListRequest, request: any) {
        return {
            isActive: true,
            type: query.type,
            member: {
                accountId: request.user.accountId,
            },
        };
    }

    async getList(query: GetCareersListRequest, request: any): Promise<CareerResponse[]> {
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
            where: this.parseConditionsFromQuery(query, request),
        });
    }

    async getTotal(query: GetCareersListRequest, request: any): Promise<number> {
        return await this.prismaService.career.count({
            where: this.parseConditionsFromQuery(query, request),
        });
    }

    async createCareer(body: CreateCareerRequest, memberId: number): Promise<void> {
        await this.prismaService.career.create({
            data: {
                ...body,
                memberId,
                type: CareerType.GENERAL,
            },
        });
    }

    async deleteCareer(careerId: number, memberId: number): Promise<void> {
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
