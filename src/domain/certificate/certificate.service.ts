import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus } from '@prisma/client';
import {
    GetMemberCertificateRequest,
    UpSertMemberCertificateRequest,
} from 'domain/certificate/member/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certificate/member/response/member-certificate.response';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

@Injectable()
export class CertificateService {
    constructor(private readonly prismaService: PrismaService) {}
    async deleteCertificate(id: number): Promise<void> {
        const existingCertificate = await this.prismaService.certificate.findUnique({
            where: {
                id,
            },
        });

        if (!existingCertificate) {
            throw new Error(`Certificate with ID ${id} does not exist.`);
        }
        await this.prismaService.certificate.delete({
            where: {
                id,
            },
        });
    }
    async saveCertificate(accountId: number, request: UpSertMemberCertificateRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
            },
        });
        if (!member.id) {
            throw new NotFoundException('Member not found');
        }
        const newFile = await this.prismaService.file.create({
            data: {
                type: request.fileType,
                key: request.fileKey,
                size: request.fileSize,
                fileName: request.fileName,
            },
        });
        await this.prismaService.certificate.create({
            data: {
                name: request.name,
                acquisitionDate: new Date(request.acquisitionDate),
                certificateNumber: request.certificateNumber,
                memberId: member.id,
                fileId: newFile.id,
                status: CertificateStatus.REQUESTING,
            },
        });
    }
    async getCertificateDetails(id: number): Promise<GetMemberCertificateResponse> {
        const result = await this.prismaService.certificate.findUniqueOrThrow({
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
            certificateNumber: result.certificateNumber,
            file: {
                fileName: result.file.fileName,
                key: result.file.key,
                size: result.file.size ? Number(result.file.size) : null,
                type: result.file.type,
            },
        };
    }
    async getPaginatedCertificates(
        request: GetMemberCertificateRequest,
        hasOrder = true,
    ): Promise<PaginationResponse<GetMemberCertificateResponse>> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: request.accountId,
            },
        });
        if (!member) {
            throw new NotFoundException('Member not found');
        }
        const result = await this.prismaService.certificate.findMany({
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
                    certificateNumber: item.certificateNumber,
                    acquisitionDate: item.acquisitionDate,
                    file: {
                        fileName: item.file.fileName,
                        key: item.file.key,
                        type: item.file.type,
                        size: Number(item.file.size),
                    },
                }) as GetMemberCertificateResponse,
        );
        const condition: any = {
            where: {
                memberId: member.id,
            },
        };
        const total = await this.prismaService.certificate.count(condition);
        return {
            data: mappedResult,
            pageInfo: {
                total: total,
            },
        };
    }
}
