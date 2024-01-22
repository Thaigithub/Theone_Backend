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
                isActive: true,
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
                isActive: true,
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
                size: Number(item.file.size),
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
                isActive: true,
            },
        });
        if (!specialLicense) throw new BadRequestException('Special License not found');
        const code = await this.prismaService.code.findUnique({
            where: {
                id: request.codeId,
                codeType: CodeType.SPECIAL,
            },
            select: {
                codeType: true,
            },
        });
        if (!code) throw new NotFoundException('CodeId not found');
        if (code.codeType !== CodeType.SPECIAL) throw new BadRequestException('Wrong code for special license');
        const file = await this.prismaService.specialLicense.update({
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

    async getDetail(accountId: number, id: number): Promise<SpecialLicenseMemberGetDetailResponse> {
        const result = await this.prismaService.specialLicense.findUniqueOrThrow({
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
            codeName: result.code.codeName,
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
        const record = await this.prismaService.specialLicense.findUnique({
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
            throw new NotFoundException('The special license does not exist');
        }
        await this.prismaService.specialLicense.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
