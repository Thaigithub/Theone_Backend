import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, CodeType } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { SpecialLicenseMemberGetListRequest } from './request/special-license-member-get-list.request';
import { SpecialLicenseMemberUpsertRequest } from './request/special-license-member-upsert.request';
import { SpecialLicenseMemberGetDetailResponse } from './response/special-license-member-get-detail.response';
import { SpecialLicenseMemberGetListResponse } from './response/special-license-member-get-list.response';

@Injectable()
export class SpecialLicenseService {
    constructor(private readonly prismaService: PrismaService) {}
    async create(accountId: number, request: SpecialLicenseMemberUpsertRequest): Promise<void> {
        const count = await this.prismaService.specialLicense.count({
            where: {
                codeId: request.codeId,
            },
        });
        if (count !== 0) throw new ConflictException('Special License has been registered');
        const code = await this.prismaService.code.findUnique({
            where: {
                id: request.codeId,
            },
            select: {
                codeType: true,
            },
        });
        if (!code) throw new NotFoundException('CodeId not found');
        if (code.codeType !== CodeType.SPECIAL) throw new BadRequestException('Wrong code for special license');
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
                specialLicense: {
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
    async getList(accountId: number, request: SpecialLicenseMemberGetListRequest): Promise<SpecialLicenseMemberGetListResponse> {
        const member = await this.prismaService.account.findUnique({
            where: { id: accountId },
            select: { member: { select: { id: true } } },
        });
        const search = {
            where: {
                memberId: member.member.id,
            },
            ...QueryPagingHelper.queryPaging(request),
            select: {
                status: true,
                id: true,
                code: {
                    select: {
                        codeName: true,
                    },
                },
                acquisitionDate: true,
                licenseNumber: true,
                file: true,
            },
        };
        const result = (await this.prismaService.specialLicense.findMany(search)).map((item) => ({
            id: item.id,
            codeName: item.code.codeName,
            status: item.status,
            acquisitionDate: item.acquisitionDate,
            licenseNumber: item.licenseNumber,
            file: {
                fileName: item.file.fileName,
                key: item.file.key,
                type: item.file.type,
            },
        }));
        const total = await this.prismaService.specialLicense.count({ where: search.where });
        return new PaginationResponse(result, new PageInfo(total));
    }

    async update(accountId: number, id: number, request: SpecialLicenseMemberUpsertRequest): Promise<void> {
        const member = await this.prismaService.account.findUnique({
            where: { id: accountId },
            select: { member: { select: { id: true } } },
        });
        const specialLicense = this.prismaService.specialLicense.findFirst({
            where: {
                id,
                memberId: member.member.id,
            },
        });
        if (!specialLicense) throw new BadRequestException('Special License not found');
        const code = await this.prismaService.code.findUnique({
            where: {
                id: request.codeId,
            },
            select: {
                codeType: true,
            },
        });
        if (!code) throw new NotFoundException('CodeId not found');
        if (code.codeType !== CodeType.SPECIAL) throw new BadRequestException('Wrong code for special license');
        await this.prismaService.file.update({
            where: {
                id,
            },
            data: {
                fileName: request.file.fileName,
                size: request.file.size,
                type: request.file.type,
                key: request.file.key,
                specialLicense: {
                    create: {
                        status: CertificateStatus.REQUESTING,
                        licenseNumber: request.licenseNumber,
                        acquisitionDate: new Date(request.acquisitionDate),
                        memberId: member.member.id,
                    },
                },
            },
        });
    }

    async getDetail(accountId: number, id: number): Promise<SpecialLicenseMemberGetDetailResponse> {
        const result = await this.prismaService.specialLicense.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                file: true,
                code: true,
            },
        });
        return {
            id: result.id,
            codeName: result.code.codeName,
            status: result.status,
            acquisitionDate: result.acquisitionDate,
            licenseNumber: result.licenseNumber,
            file: {
                fileName: result.file.fileName,
                key: result.file.key,
                type: result.file.type,
            },
        };
    }
}
