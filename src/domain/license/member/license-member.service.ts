/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LicenseMemberGetListRequest } from './request/license-member-get-list.request';
import { LicenseMemberUpsertRequest } from './request/license-member-upsert.request';
import { LicenseMemberGetDetailResponse } from './response/license-member-get-detail.response';
import { LicenseMemberGetListResponse } from './response/license-member-get-list.response';

@Injectable()
export class LicenseService {
    constructor(private prismaService: PrismaService) {}

    async create(accountId: number, request: LicenseMemberUpsertRequest): Promise<void> {
        const count = await this.prismaService.license.count({
            where: {
                codeId: request.codeId,
                isActive: true,
            },
        });
        if (count !== 0) throw new BadRequestException(Error.LICENSE_EXISTED);
        const code = await this.prismaService.code.findUnique({
            where: {
                id: request.codeId,
            },
        });
        if (!code) throw new NotFoundException(Error.OCCUPATION_NOT_FOUND);
        const member = await this.prismaService.account.findUnique({
            where: { id: accountId },
            select: { member: { select: { id: true } } },
        });
        await this.prismaService.file.create({
            data: {
                fileName: request.file.fileName,
                size: request.file.size,
                type: request.file.type,
                key: request.file.key,
                license: {
                    create: {
                        status: CertificateStatus.REQUESTING,
                        licenseNumber: request.licenseNumber,
                        acquisitionDate: new Date(request.acquisitionDate),
                        memberId: member.member.id,
                        codeId: request.codeId,
                    },
                },
            },
        });
    }

    async getList(accountId: number, request: LicenseMemberGetListRequest): Promise<LicenseMemberGetListResponse> {
        const queryFilter: Prisma.LicenseWhereInput = {
            member: {
                isActive: true,
                accountId: accountId,
            },
            isActive: true,
        };
        const result = (
            await this.prismaService.license.findMany({
                where: queryFilter,
                ...QueryPagingHelper.queryPaging(request),
                select: {
                    status: true,
                    id: true,
                    code: {
                        select: {
                            name: true,
                        },
                    },
                    acquisitionDate: true,
                    licenseNumber: true,
                    file: true,
                },
            })
        ).map((item) => ({
            id: item.id,
            codeName: item.code.name,
            status: item.status,
            acquisitionDate: item.acquisitionDate,
            licenseNumber: item.licenseNumber,
            file: {
                fileName: item.file.fileName,
                key: item.file.key,
                type: item.file.type,
                size: Number(item.file.size),
            },
        }));
        const total = await this.prismaService.license.count({ where: queryFilter });
        return new PaginationResponse(result, new PageInfo(total));
    }

    async update(accountId: number, id: number, request: LicenseMemberUpsertRequest): Promise<void> {
        const member = await this.prismaService.account.findUnique({
            where: { id: accountId },
            select: { member: { select: { id: true } } },
        });
        const license = this.prismaService.license.findFirst({
            where: {
                id,
                memberId: member.member.id,
                isActive: true,
            },
        });
        if (!license) throw new BadRequestException(Error.LICENSE_NOT_FOUND);
        const code = await this.prismaService.code.findUnique({
            where: {
                id: request.codeId,
            },
        });
        if (!code) throw new NotFoundException(Error.OCCUPATION_NOT_FOUND);
        const file = await this.prismaService.license.update({
            where: {
                id,
                isActive: true,
            },
            data: {
                status: CertificateStatus.REQUESTING,
                licenseNumber: request.licenseNumber,
                acquisitionDate: new Date(request.acquisitionDate),
                memberId: member.member.id,
                codeId: request.codeId,
            },
            select: {
                fileId: true,
            },
        });
        await this.prismaService.file.update({
            where: {
                id: file.fileId,
            },
            data: {
                fileName: request.file.fileName,
                size: request.file.size,
                type: request.file.type,
                key: request.file.key,
            },
        });
    }

    async getDetail(accountId: number, id: number): Promise<LicenseMemberGetDetailResponse> {
        const result = await this.prismaService.license.findUniqueOrThrow({
            where: {
                id,
                isActive: true,
            },
            include: {
                file: true,
                code: true,
            },
        });
        return {
            id: result.id,
            codeName: result.code.name,
            codeId: result.code.id,
            status: result.status,
            acquisitionDate: result.acquisitionDate,
            licenseNumber: result.licenseNumber,
            file: {
                fileName: result.file.fileName,
                key: result.file.key,
                type: result.file.type,
                size: Number(result.file.size),
            },
        };
    }

    async delete(accountId: number, id: number): Promise<void> {
        const record = await this.prismaService.license.findUnique({
            where: {
                id: id,
                isActive: true,
                member: {
                    isActive: true,
                    accountId: accountId,
                },
            },
        });
        if (!record) {
            throw new NotFoundException(Error.LICENSE_NOT_FOUND);
        }
        await this.prismaService.license.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
