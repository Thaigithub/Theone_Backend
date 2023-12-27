import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CertificateStatus } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { SpecialLicenseMemberGetRequest } from './request/special-license-member-get.request';
import { SpecialLicenseMemberUpsertRequest } from './request/special-license-member-upsert.request';
import { SpecialLicenseMemberGetResponse } from './response/special-license-member.response';

@Injectable()
export class SpecialLicenseService {
    constructor(private readonly prismaService: PrismaService) {}
    async saveSpecialLicense(accountId: number, request: SpecialLicenseMemberUpsertRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        try {
            await this.prismaService.$transaction(async (prisma) => {
                const file = await prisma.file.create({
                    data: {
                        type: request.fileType,
                        key: request.fileKey,
                        size: request.fileSize,
                        fileName: request.fileName,
                    },
                });

                await prisma.specialLicense.create({
                    data: {
                        name: request.name,
                        acquisitionDate: new Date(request.acquisitionDate),
                        licenseNumber: request.licenseNumber,
                        memberId: member.id,
                        fileId: file.id,
                        status: CertificateStatus.REQUESTING,
                    },
                });
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async getPaginatedSpecialLicenses(
        request: SpecialLicenseMemberGetRequest,
        hasOrder = true,
    ): Promise<PaginationResponse<SpecialLicenseMemberGetResponse>> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: request.accountId,
            },
        });
        if (!member) {
            throw new NotFoundException('Member not found');
        }
        const result = await this.prismaService.specialLicense.findMany({
            where: {
                memberId: member.id,
            },
            orderBy: hasOrder ? { createdAt: 'desc' } : undefined,
            skip: (request.page - 1) * request.size,
            take: request.size,
            include: {
                member: true,
                file: true,
            },
        });
        const mappedResult = result.map(
            (item) =>
                ({
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    acquisitionDate: item.acquisitionDate,
                    licenseNumber: item.licenseNumber,
                    file: {
                        fileName: item.file.fileName,
                        key: item.file.key,
                        type: item.file.type,
                        size: Number(item.file.size),
                    },
                }) as SpecialLicenseMemberGetResponse,
        );
        const condition: any = {
            where: {
                memberId: member.id,
            },
        };
        const total = await this.prismaService.specialLicense.count(condition);
        return {
            data: mappedResult,
            pageInfo: {
                total: total,
            },
        };
    }

    async update(accountId: number, id: number, request: SpecialLicenseMemberUpsertRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
            },
        });
        if (!member) {
            throw new NotFoundException(`Member with accountId ${accountId} not found`);
        }
        const specialLicense = this.prismaService.specialLicense.findFirst({
            where: {
                id,
                memberId: member.id,
            },
        });
        if (!specialLicense) {
            throw new BadRequestException('You do not have permission to update this special license');
        }
        try {
            await this.prismaService.specialLicense.update({
                where: {
                    id,
                },
                data: {
                    name: request.name,
                    acquisitionDate: request.acquisitionDate,
                    licenseNumber: request.licenseNumber,
                    file: {
                        update: {
                            fileName: request.fileName,
                            type: request.fileType,
                            size: request.fileSize,
                        },
                    },
                },
                include: {
                    file: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getSpecialLicenseDetails(id: number): Promise<SpecialLicenseMemberGetResponse> {
        const result = await this.prismaService.specialLicense.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                file: true,
            },
        });
        return {
            id: result.id,
            name: result.name,
            status: result.status,
            acquisitionDate: result.acquisitionDate,
            licenseNumber: result.licenseNumber,
            file: {
                fileName: result.file.fileName,
                key: result.file.key,
                size: result.file.size ? Number(result.file.size) : null,
                type: result.file.type,
            },
        };
    }
}
