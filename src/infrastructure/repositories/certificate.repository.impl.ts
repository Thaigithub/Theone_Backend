import { Injectable } from '@nestjs/common';
import { BaseRepositoryImpl } from './base.repository.impl';
import { PrismaService } from 'infrastructure/services/prisma.service';
import { PrismaModel } from 'domain/entities/prisma.model';
import { CertificateRepository } from 'domain/repositories/certificate.repository';
import { GetMemberCertificateRequest, UpSertMemberCertificateRequest } from 'presentation/requests/member-certificate.request';
import { Certificate, CertificateStatus } from '@prisma/client';
import { GetMemberCertificateResponse } from 'presentation/responses/member-certificate.response';

@Injectable()
export class CertificateRepositoryImpl extends BaseRepositoryImpl<Certificate> implements CertificateRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.CERTIFICATE);
  }
  async delelteCertificate(id: number): Promise<void> {
    const existingCertificate: Certificate | null = await this.prismaService.certificate.findUnique({
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
  async createCertificate(memberId: number, upsertRequest: UpSertMemberCertificateRequest): Promise<void> {
    const newFile = await this.prismaService.file.create({
      data: {
        type: upsertRequest.fileType,
        key: upsertRequest.fileKey,
        size: upsertRequest.fileSize,
        fileName: upsertRequest.fileName,
      },
    });
    await this.prismaService.certificate.create({
      data: {
        name: upsertRequest.name,
        acquisitionDate: new Date(upsertRequest.acquisitionDate),
        certificateNumber: upsertRequest.certificateNumber,
        memberId: memberId,
        fileId: newFile.id,
        status: CertificateStatus.REQUESTING,
      },
    });
  }
  async findCertificateDetail(id: number): Promise<GetMemberCertificateResponse> {
    const result = await this.prismaService.certificate.findUniqueOrThrow({
      where: {
        fileId: id,
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
  async findCertificatesWithAccountId(request: GetMemberCertificateRequest, hasOrder = true): Promise<GetMemberCertificateResponse[]> {
    const result = await this.prismaService.certificate.findMany({
      where: {
        memberId: request.memberId,
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
      item =>
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
    return mappedResult;
  }
  async count(condition: any): Promise<number> {
    return await this.prismaService.certificate.count(condition);
  }
}
