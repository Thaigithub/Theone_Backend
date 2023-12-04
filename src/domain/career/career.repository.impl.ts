import { Injectable } from '@nestjs/common';
import { CareerType } from '@prisma/client';
import { Career } from 'domain/career/career.entity';
import { CareerRepository } from 'domain/career/career.repository';
import { CreateCareerRequest, GetCareerListRequest } from 'domain/career/request/career.request';
import { CareerResponse } from 'domain/career/response/career.response';
import { PrismaModel } from 'helpers/entity/prisma.model';
import { PrismaService } from 'helpers/entity/prisma.service';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';

@Injectable()
export class CareerRepositoryImpl extends BaseRepositoryImpl<Career> implements CareerRepository {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService, PrismaModel.CAREER);
    }

    private parseConditionsFromQuery(query: GetCareerListRequest, request: any) {
        return {
            type: query.type,
            member: {
                accountId: request.user.accountId,
            },
        };
    }

    async findByQuery(query: GetCareerListRequest, request: any): Promise<CareerResponse[]> {
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

    async countByQuery(query: GetCareerListRequest, request: any): Promise<number> {
        return await this.prismaService.career.count({
            where: this.parseConditionsFromQuery(query, request),
        });
    }

    async createOne(body: CreateCareerRequest, memberId: number): Promise<void> {
        await this.prismaService.career.create({
            data: {
                ...body,
                memberId,
                type: CareerType.GENERAL,
            },
        });
    }

    async deleteOne(careerId: number, memberId: number): Promise<void> {
        await this.prismaService.career.delete({
            where: {
                id: careerId,
                memberId,
            },
        });
    }
}
