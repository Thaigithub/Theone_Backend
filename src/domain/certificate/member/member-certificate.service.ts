import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus } from '@prisma/client';
import {
    GetMemberCertificateRequest,
    PartialUpdateMemberCertificateRequest,
    UpsertMemberCertificateRequest,
} from 'domain/certificate/member/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certificate/member/response/member-certificate.response';
import { PrismaService } from 'services/prisma/prisma.service';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from '../../../utils/pagination-query';

@Injectable()
export class MemberCertificateService {
    constructor(private readonly prismaService: PrismaService) {}

    async getPaginatedCertificates(
        query: GetMemberCertificateRequest,
        accountId: number,
        hasOrder = true,
    ): Promise<PaginationResponse<GetMemberCertificateResponse>> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
                isActive: true,
            },
        });
        if (!member) throw new NotFoundException('Member not found');

        const certificatesCondition = {
            memberId: member.id,
            isActive: true,
        };
        const certificates = await this.prismaService.certificate.findMany({
            where: certificatesCondition,
            ...QueryPagingHelper.queryPaging(query),
            orderBy: hasOrder ? { createdAt: 'desc' } : undefined,
            include: {
                member: true,
                file: true,
            },
        });
        const mappedResult = certificates.map(
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

        const total = await this.prismaService.certificate.count({
            where: certificatesCondition,
        });
        return {
            data: mappedResult,
            pageInfo: {
                total: total,
            },
        };
    }

    async getCertificateDetails(id: number, accountId: number): Promise<GetMemberCertificateResponse> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId,
                isActive: true,
            },
        });
        if (!member) throw new NotFoundException('Member not found');

        const certificate = await this.prismaService.certificate.findUnique({
            where: {
                id,
                memberId: member.id,
                isActive: true,
            },
            include: {
                file: true,
            },
        });
        if (!certificate) throw new NotFoundException('Certificate not found');

        return {
            id: certificate.id,
            name: certificate.name,
            status: certificate.status,
            acquisitionDate: certificate.acquisitionDate,
            certificateNumber: certificate.certificateNumber,
            file: {
                type: certificate.file.type,
                key: certificate.file.key,
                fileName: certificate.file.fileName,
                size: certificate.file.size ? Number(certificate.file.size) : null,
            },
        };
    }

    async saveCertificate(accountId: number, request: UpsertMemberCertificateRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
                isActive: true,
            },
        });
        if (!member.id) throw new NotFoundException('Member not found');

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

    async partialUpdateCertificate(id: number, accountId: number, request: PartialUpdateMemberCertificateRequest): Promise<void> {
        const member = await this.prismaService.member.findFirst({
            where: {
                accountId: accountId,
                isActive: true,
            },
        });
        if (!member.id) throw new NotFoundException('Member not found');

        await this.prismaService.certificate.update({
            where: {
                id,
                memberId: member.id,
                isActive: true,
            },
            data: {
                status: request.certificationStatus,
            },
        });
    }

    async deleteCertificate(id: number, accountId: number): Promise<void> {
        const member = await this.prismaService.member.findUnique({
            where: {
                accountId,
                isActive: true,
            },
        });
        if (!member) throw new NotFoundException('Member not found');

        const existingCertificate = await this.prismaService.certificate.findUnique({
            where: {
                id,
                memberId: member.id,
                isActive: true,
            },
        });
        if (!existingCertificate) throw new NotFoundException('Certificate not found');

        await this.prismaService.certificate.update({
            where: {
                id,
                memberId: member.id,
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    }
}
